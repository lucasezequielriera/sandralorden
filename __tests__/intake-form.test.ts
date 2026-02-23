import { describe, it, expect, vi, beforeEach } from "vitest";

/* ─── mocks ─── */

vi.mock("@/lib/rate-limit", () => ({
  rateLimit: vi.fn(() => ({ success: true, remaining: 10 })),
}));

const mockSend = vi.fn().mockResolvedValue({ id: "mock-email-id" });
vi.mock("resend", () => ({
  Resend: vi.fn(() => ({ emails: { send: mockSend } })),
}));

let supabaseInserts: Record<string, unknown>[] = [];
let supabaseUpdates: Record<string, unknown>[] = [];
let selectSingleResult = { data: null as unknown, error: null as unknown };

function createSupabaseMock() {
  supabaseInserts = [];
  supabaseUpdates = [];

  const chain = {
    from: vi.fn(() => chain),
    select: vi.fn(() => chain),
    eq: vi.fn(() => chain),
    single: vi.fn(() => Promise.resolve(selectSingleResult)),
    insert: vi.fn((data: Record<string, unknown>) => {
      supabaseInserts.push(data);
      return { ...chain, select: vi.fn(() => chain) };
    }),
    update: vi.fn((data: Record<string, unknown>) => {
      supabaseUpdates.push(data);
      return chain;
    }),
  };
  return chain;
}

let mockSupabase = createSupabaseMock();

vi.mock("@/lib/supabase/server", () => ({
  createServiceClient: vi.fn(async () => mockSupabase),
}));

/* ─── env ─── */
process.env.RESEND_API_KEY = "re_test_123";
process.env.EMAIL_FROM = "Test <test@resend.dev>";
process.env.SANDRA_EMAIL = "sandra@test.com";

/* ─── helper ─── */
function makeRequest(body: Record<string, unknown>) {
  return new Request("http://localhost/api/intake-form", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": "1.2.3.4" },
    body: JSON.stringify(body),
  });
}

const VALID_BODY = {
  name: "María García",
  email: "maria@example.com",
  phone: "+34 612 345 678",
  service: "Entrenamiento personal presencial",
  age: "28",
  height: "165",
  weight: "60",
  goalWeight: "57",
  enfermedadesInfancia: "Ninguna",
  lesiones: "Esguince tobillo derecho 2020",
  cirugias: "No",
  diabetes: "No",
  hipertension: "No",
  corazon: "No",
  hipotiroidismo: "No",
  colesterolTrigliceridos: "No",
  digestivo: "No",
  medicamentos: "No",
  fumaOBebe: "No",
  descanso: "7-8 horas",
  comidasYHorarios: "Desayuno 8h, comida 14h, cena 21h",
  apetito: "Bueno",
  momentoApetito: "Tarde",
  alimentosPreferidos: "Pollo, Salmón, Brócoli",
  alimentosNoGustan: "Hígado, Mejillones",
  diaTipo: "Levanto 7am, trabajo oficina, entreno 18:30h",
  alergiasAlimentarias: "Ninguna",
  suplementacion: "Proteína whey",
  suplementacionInteres: "Creatina",
  dietaAnteriorBase: "Dieta hipocalórica",
  dietaAnteriorTiempo: "Hace 1 año",
  dietaAnteriorDuracion: "3 meses",
  dietaAnteriorObservaciones: "Perdí 4kg pero lo recuperé",
  diasEntrenoActual: "3 días",
  diasEntrenoCompromiso: "4 días",
  horaEntreno: "18:30",
  duracionSesion: "60 min",
  casaOGimnasio: "Gimnasio",
  materialCasa: "",
  mejoraRendimiento: "Ganar fuerza en sentadilla y peso muerto",
  mejoraEstetica: "Tonificar y reducir grasa abdominal",
  extra: "Quiero empezar cuanto antes",
};

/* ─── import after mocks ─── */
const { POST } = await import("@/app/api/intake-form/route");

describe("POST /api/intake-form", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSend.mockResolvedValue({ id: "mock-email-id" });
    selectSingleResult = { data: null, error: null };
    mockSupabase = createSupabaseMock();
  });

  /* ── happy path ── */

  it("returns success with all valid fields", async () => {
    const res = await POST(makeRequest(VALID_BODY) as never);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
  });

  it("sends email to Sandra with correct subject and content", async () => {
    await POST(makeRequest(VALID_BODY) as never);

    expect(mockSend).toHaveBeenCalledOnce();
    const call = mockSend.mock.calls[0][0];
    expect(call.to).toBe("sandra@test.com");
    expect(call.subject).toContain("María García");
    expect(call.subject).toContain("Entrenamiento personal presencial");
    expect(call.html).toBeTruthy();
    expect(typeof call.html).toBe("string");
  });

  it("creates new client in Supabase with correct fields", async () => {
    await POST(makeRequest(VALID_BODY) as never);

    const clientInsert = supabaseInserts.find((d) => "status" in d && "email" in d);
    expect(clientInsert).toBeTruthy();
    expect(clientInsert!.name).toBe("María García");
    expect(clientInsert!.email).toBe("maria@example.com");
    expect(clientInsert!.phone).toBe("+34 612 345 678");
    expect(clientInsert!.service_type).toBe("Entrenamiento personal presencial");
    expect(clientInsert!.status).toBe("active");
  });

  it("combines mejoraRendimiento + mejoraEstetica into goal with | separator", async () => {
    await POST(makeRequest({
      ...VALID_BODY,
      mejoraRendimiento: "Fuerza",
      mejoraEstetica: "Definición",
    }) as never);

    const clientInsert = supabaseInserts.find((d) => "goal" in d);
    expect(clientInsert).toBeTruthy();
    expect(clientInsert!.goal).toBe("Fuerza | Definición");
  });

  it("logs activity after successful submission", async () => {
    await POST(makeRequest(VALID_BODY) as never);

    const logInsert = supabaseInserts.find((d) => "action" in d);
    expect(logInsert).toBeTruthy();
    expect(logInsert!.action).toContain("formulario");
    expect(logInsert!.details).toContain("María García");
    expect(logInsert!.details).toContain("maria@example.com");
  });

  /* ── validation errors ── */

  it("returns 400 when name is missing", async () => {
    const res = await POST(makeRequest({ ...VALID_BODY, name: "" }) as never);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBeTruthy();
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("returns 400 when email is missing", async () => {
    const res = await POST(makeRequest({ ...VALID_BODY, email: "" }) as never);
    expect(res.status).toBe(400);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("returns 400 when email is invalid", async () => {
    const res = await POST(makeRequest({ ...VALID_BODY, email: "not-an-email" }) as never);
    expect(res.status).toBe(400);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("returns 400 when phone is missing", async () => {
    const res = await POST(makeRequest({ ...VALID_BODY, phone: "" }) as never);
    expect(res.status).toBe(400);
    expect(mockSend).not.toHaveBeenCalled();
  });

  /* ── honeypot ── */

  it("silently accepts honeypot-filled requests without sending email", async () => {
    const res = await POST(makeRequest({ ...VALID_BODY, _hp: "bot-value" }) as never);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(mockSend).not.toHaveBeenCalled();
  });

  /* ── sanitization ── */

  it("truncates name to 100 chars in email subject", async () => {
    const longName = "A".repeat(200);
    await POST(makeRequest({ ...VALID_BODY, name: `  ${longName}  ` }) as never);

    expect(mockSend).toHaveBeenCalledOnce();
    const call = mockSend.mock.calls[0][0];
    expect(call.subject).toContain("A".repeat(100));
    expect(call.subject).not.toContain("A".repeat(101));
  });

  /* ── existing client update ── */

  it("updates existing client instead of creating a duplicate", async () => {
    selectSingleResult = { data: { id: "existing-uuid" }, error: null };

    await POST(makeRequest(VALID_BODY) as never);

    expect(supabaseUpdates.length).toBeGreaterThan(0);
    const update = supabaseUpdates[0];
    expect(update.name).toBe("María García");
  });

  /* ── rate limiting ── */

  it("returns 429 when rate limited", async () => {
    const { rateLimit } = await import("@/lib/rate-limit");
    (rateLimit as ReturnType<typeof vi.fn>).mockReturnValueOnce({ success: false, remaining: 0 });

    const res = await POST(makeRequest(VALID_BODY) as never);
    expect(res.status).toBe(429);
    expect(mockSend).not.toHaveBeenCalled();
  });
});
