"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

function FormularioContent() {
  const searchParams = useSearchParams();
  const prefillName = searchParams.get("name") || "";
  const prefillEmail = searchParams.get("email") || "";
  const prefillPhone = searchParams.get("phone") || "";
  const prefillService = searchParams.get("service") || "";

  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: prefillName,
    email: prefillEmail,
    phone: prefillPhone,
    service: prefillService,
    age: "",
    height: "",
    weight: "",
    goalWeight: "",
    enfermedadesInfancia: "",
    lesiones: "",
    cirugias: "",
    diabetes: "",
    hipertension: "",
    corazon: "",
    hipotiroidismo: "",
    colesterolTrigliceridos: "",
    digestivo: "",
    medicamentos: "",
    fumaOBebe: "",
    descanso: "",
    comidasYHorarios: "",
    apetito: "",
    momentoApetito: "",
    diaTipo: "",
    alergiasAlimentarias: "",
    suplementacion: "",
    suplementacionInteres: "",
    dietaAnteriorBase: "",
    dietaAnteriorTiempo: "",
    dietaAnteriorDuracion: "",
    dietaAnteriorObservaciones: "",
    diasEntrenoActual: "",
    diasEntrenoCompromiso: "",
    horaEntreno: "",
    duracionSesion: "",
    casaOGimnasio: "",
    materialCasa: "",
    mejoraRendimiento: "",
    mejoraEstetica: "",
    extra: "",
  });

  const [foodSelections, setFoodSelections] = useState<Record<string, "liked" | "disliked">>({});

  const toggleFood = (food: string) => {
    setFoodSelections((prev) => {
      const current = prev[food];
      const next = { ...prev };
      if (!current) next[food] = "liked";
      else if (current === "liked") next[food] = "disliked";
      else delete next[food];
      return next;
    });
  };

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setError(null);
    try {
      const res = await fetch("/api/intake-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          alimentosPreferidos: Object.entries(foodSelections).filter(([, v]) => v === "liked").map(([k]) => k).join(", "),
          alimentosNoGustan: Object.entries(foodSelections).filter(([, v]) => v === "disliked").map(([k]) => k).join(", "),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setIsSent(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hubo un error. Inténtalo de nuevo.");
    } finally {
      setIsSending(false);
    }
  };

  if (isSent) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen flex items-center justify-center p-4 bg-[#FFFAF7]">
        <div className="w-full max-w-lg text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.2 }} className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#F2D1D1] to-[#E8B4B4] flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </motion.div>
          <h1 style={{ fontFamily: "Georgia, 'Times New Roman', serif" }} className="text-3xl font-light italic text-[#3D2C2C] mb-4">
            ¡Recibido, {form.name}!
          </h1>
          <p className="text-[#8B7E7E] leading-relaxed mb-2">
            Ya tengo toda tu info. Me pongo manos a la obra con tu plan.
          </p>
          <p className="text-[#8B7E7E] leading-relaxed mb-8">
            Te escribo por <strong className="text-[#3D2C2C]">WhatsApp</strong> en cuanto lo tenga listo y empezamos.
          </p>
          <div className="inline-flex items-center gap-2 px-5 py-3 bg-[#25D366]/10 text-[#25D366] rounded-full text-sm font-medium">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Te escribiré pronto
          </div>
          <p className="mt-6 text-xs text-[#C4B8AD]">Sandra Lorden · Entrenadora Personal & Nutricionista</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFAF7] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <p style={{ fontFamily: "Georgia, 'Times New Roman', serif" }} className="text-3xl font-light italic text-[#3D2C2C] mb-2">Sandra Lorden</p>
          <p className="text-xs text-[#C9A88E] uppercase tracking-[3px] mb-8">Entrenadora Personal & Nutricionista</p>
          <h1 style={{ fontFamily: "Georgia, 'Times New Roman', serif" }} className="text-2xl md:text-3xl font-light italic text-[#3D2C2C] mb-3">Tu formulario de transformación</h1>
          <p className="text-[#8B7E7E] text-sm max-w-md mx-auto leading-relaxed">Necesito conocerte bien para prepararte un plan hecho a tu medida. Cuantos más detalles me des, mejor te voy a poder ayudar.</p>
        </div>

        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="space-y-6">

          {/* ── DATOS PERSONALES ── */}
          <FormSection title="Cuéntame sobre ti">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="¿Cómo te llamas?" value={form.name} onChange={(v) => update("name", v)} required />
              <InputField label="Tu email" type="email" value={form.email} onChange={(v) => update("email", v)} required />
              <InputField label="Tu WhatsApp" type="tel" value={form.phone} onChange={(v) => update("phone", v)} placeholder="+34 600 000 000" required />
              <InputField label="¿Cuántos años tienes?" value={form.age} onChange={(v) => update("age", v)} placeholder="Ej: 28" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <InputField label="¿Cuánto mides? (cm)" value={form.height} onChange={(v) => update("height", v)} placeholder="Ej: 165" required />
              <InputField label="¿Cuánto pesas ahora? (kg)" value={form.weight} onChange={(v) => update("weight", v)} placeholder="Ej: 68" required />
              <InputField label="¿Cuál es tu peso objetivo? (kg)" value={form.goalWeight} onChange={(v) => update("goalWeight", v)} placeholder="Ej: 60" />
            </div>
          </FormSection>

          {/* ── SALUD ── */}
          <FormSection title="Tu salud">
            <div className="space-y-4">
              <TextareaField label="¿Has tenido alguna enfermedad desde pequeña/o? ¿Cuáles?" value={form.enfermedadesInfancia} onChange={(v) => update("enfermedadesInfancia", v)} placeholder="Si no has tenido ninguna, escribe 'Ninguna'" />
              <TextareaField label="¿Tienes alguna lesión? ¿Cuáles?" value={form.lesiones} onChange={(v) => update("lesiones", v)} placeholder="Ej: Esguince de tobillo, tendinitis... o Ninguna" />
              <TextareaField label="¿Te has operado de algo? ¿De qué?" value={form.cirugias} onChange={(v) => update("cirugias", v)} placeholder="Ej: Apendicitis, rodilla... o Ninguna" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField label="¿Tienes Diabetes I o II?" value={form.diabetes} onChange={(v) => update("diabetes", v)} options={["No", "Diabetes tipo I", "Diabetes tipo II"]} />
                <SelectField label="¿Tienes Hipertensión Arterial?" value={form.hipertension} onChange={(v) => update("hipertension", v)} options={["No", "Sí"]} />
              </div>
              <TextareaField label="¿Tienes alguna enfermedad del corazón? ¿Cuál?" value={form.corazon} onChange={(v) => update("corazon", v)} placeholder="Ej: Arritmia, soplo... o No" rows={2} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField label="¿Tienes Hipotiroidismo?" value={form.hipotiroidismo} onChange={(v) => update("hipotiroidismo", v)} options={["No", "Sí"]} />
                <SelectField label="¿Colesterol alto y/o Triglicéridos?" value={form.colesterolTrigliceridos} onChange={(v) => update("colesterolTrigliceridos", v)} options={["No", "Colesterol alto", "Triglicéridos altos", "Ambos"]} />
              </div>
              <SelectField label="¿Tienes estreñimiento, colon irritable o dolores digestivos?" value={form.digestivo} onChange={(v) => update("digestivo", v)} options={["No", "Estreñimiento", "Colon irritable", "Dolores digestivos", "Varios de estos"]} />
              <TextareaField label="¿Tomas algún medicamento o suplemento médico? ¿Cuáles?" value={form.medicamentos} onChange={(v) => update("medicamentos", v)} placeholder="Ej: Eutirox 50mg, Omeprazol... o Ninguno" rows={2} />
              <TextareaField label="¿Fumas o bebes?" value={form.fumaOBebe} onChange={(v) => update("fumaOBebe", v)} placeholder="Ej: No fumo, bebo socialmente los fines de semana" rows={2} />
              <InputField label="¿Descansas bien? ¿Cuántas horas duermes de media?" value={form.descanso} onChange={(v) => update("descanso", v)} placeholder="Ej: Regular, unas 6 horas" />
            </div>
          </FormSection>

          {/* ── ALIMENTACIÓN ── */}
          <FormSection title="Tu alimentación">
            <div className="space-y-4">
              <TextareaField label="¿Cuántas comidas haces al día y en qué horarios?" value={form.comidasYHorarios} onChange={(v) => update("comidasYHorarios", v)} placeholder="Ej: 3 comidas — Desayuno 8:00, Comida 14:00, Cena 21:00" required />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField label="¿Cómo describirías tu apetito?" value={form.apetito} onChange={(v) => update("apetito", v)} options={["Bueno", "Regular", "Malo"]} />
                <InputField label="¿En qué momento del día tienes más hambre?" value={form.momentoApetito} onChange={(v) => update("momentoApetito", v)} placeholder="Ej: Por la noche, media mañana..." />
              </div>

              <FoodSelector selections={foodSelections} onToggle={toggleFood} />

              <TextareaField label="Cuéntame un día tipo: ¿qué comes desde que te levantas hasta que te acuestas?" value={form.diaTipo} onChange={(v) => update("diaTipo", v)} placeholder="Ej: Me levanto a las 7, desayuno café con tostadas. A las 10 un yogur. A las 14 como arroz con pollo..." rows={4} required />
              <TextareaField label="¿Eres alérgica/o a algún alimento o te sienta mal algo? ¿Qué?" value={form.alergiasAlimentarias} onChange={(v) => update("alergiasAlimentarias", v)} placeholder="Ej: Intolerante a la lactosa, alergia a frutos secos... o Ninguna" rows={2} />
              <TextareaField label="¿Tomas algún suplemento? ¿Cuáles? (si puedes, dime la marca y mándame foto por WhatsApp)" value={form.suplementacion} onChange={(v) => update("suplementacion", v)} placeholder="Ej: Proteína whey de Gold Standard, creatina... o No tomo nada" rows={2} />
              <TextareaField label="Si no tomas suplementos, ¿te gustaría empezar con alguno para cumplir tus objetivos?" value={form.suplementacionInteres} onChange={(v) => update("suplementacionInteres", v)} placeholder="Ej: Sí, me interesa saber qué podría tomar / No me interesa" rows={2} />

              <div className="bg-[#FFFAF7] rounded-xl p-4 border border-[#F0EBE6]">
                <p className="text-sm font-medium text-[#3D2C2C] mb-1">¿Has hecho alguna dieta antes?</p>
                <p className="text-xs text-[#C4B8AD] mb-3">Rellénalo solo si has hecho alguna dieta antes. Me ayuda a saber qué te ha funcionado y qué no.</p>
                <div className="space-y-3">
                  <TextareaField label="¿En qué se basaba?" value={form.dietaAnteriorBase} onChange={(v) => update("dietaAnteriorBase", v)} placeholder="Ej: Dieta keto, déficit calórico, ayuno intermitente..." rows={2} />
                  <InputField label="¿Hace cuánto tiempo la hiciste?" value={form.dietaAnteriorTiempo} onChange={(v) => update("dietaAnteriorTiempo", v)} placeholder="Ej: Hace 6 meses, hace 2 años..." />
                  <InputField label="¿Durante cuánto tiempo?" value={form.dietaAnteriorDuracion} onChange={(v) => update("dietaAnteriorDuracion", v)} placeholder="Ej: 3 meses, 1 año..." />
                  <TextareaField label="¿Qué tal te fue?" value={form.dietaAnteriorObservaciones} onChange={(v) => update("dietaAnteriorObservaciones", v)} placeholder="Ej: Perdí 5kg pero los volví a coger, me sentía bien pero no era sostenible..." rows={2} />
                </div>
              </div>
            </div>
          </FormSection>

          {/* ── ENTRENAMIENTO ── */}
          <FormSection title="Tu entrenamiento">
            <div className="space-y-4">
              <TextareaField label="¿Cuántos días entrenas a la semana actualmente? Dime los días concretos si puedes" value={form.diasEntrenoActual} onChange={(v) => update("diasEntrenoActual", v)} placeholder="Ej: 3 días — Lunes, Miércoles y Viernes / Actualmente no entreno" required />
              <TextareaField label="¿Cuántos días te comprometes a entrenar con este plan? Dime los días concretos si puedes" value={form.diasEntrenoCompromiso} onChange={(v) => update("diasEntrenoCompromiso", v)} placeholder="Ej: 4 días — Lunes, Martes, Jueves y Viernes" required />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="¿Sobre qué hora vas a entrenar?" value={form.horaEntreno} onChange={(v) => update("horaEntreno", v)} placeholder="Ej: Sobre las 18:00" />
                <InputField label="¿Cuánto suele durarte cada sesión?" value={form.duracionSesion} onChange={(v) => update("duracionSesion", v)} placeholder="Ej: 1 hora, 45 minutos..." />
              </div>
              <SelectField label="¿Quieres el plan para casa o para el gimnasio?" value={form.casaOGimnasio} onChange={(v) => update("casaOGimnasio", v)} options={["Gimnasio", "Casa", "Ambos"]} />
              <TextareaField label="Si entrenas en casa, ¿qué material tienes?" value={form.materialCasa} onChange={(v) => update("materialCasa", v)} placeholder="Ej: Mancuernas, bandas elásticas, esterilla, barra de dominadas... o Nada" rows={2} />
            </div>
          </FormSection>

          {/* ── OBJETIVOS DE MEJORA ── */}
          <FormSection title="Tus objetivos">
            <div className="space-y-4">
              <TextareaField label="A nivel de rendimiento físico, ¿qué te gustaría mejorar?" value={form.mejoraRendimiento} onChange={(v) => update("mejoraRendimiento", v)} placeholder="Cuéntame también si notas dolores, pesadez, falta de energía, calambres... y en qué momentos te ocurre." rows={3} required />
              <TextareaField label="A nivel estético, ¿qué te gustaría cambiar?" value={form.mejoraEstetica} onChange={(v) => update("mejoraEstetica", v)} placeholder="Ej: Tonificar piernas y glúteos, perder grasa abdominal, definir brazos..." rows={3} required />
            </div>
          </FormSection>

          {/* ── ALGO MÁS ── */}
          <FormSection title="¿Algo más que quieras contarme?">
            <TextareaField label="Aquí tienes espacio libre para lo que quieras (opcional)" value={form.extra} onChange={(v) => update("extra", v)} placeholder="Dudas, motivación, situación personal... lo que creas que me puede servir para conocerte mejor." rows={4} />
          </FormSection>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <div className="bg-white rounded-3xl shadow-sm border border-[#F7F3F0] p-6 text-center">
            <button type="submit" disabled={isSending} className="w-full py-4 px-6 bg-[#3D2C2C] text-white rounded-2xl font-medium transition-all hover:bg-[#5A4545] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm">
              {isSending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Enviando...
                </span>
              ) : "Enviar formulario a Sandra"}
            </button>
            <p className="mt-3 text-xs text-[#C4B8AD]">En cuanto lo reciba, te escribo por WhatsApp y empezamos</p>
          </div>
        </motion.form>
      </div>
    </div>
  );
}

export default function FormularioPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#FFFAF7]"><p className="text-[#C9A88E]">Cargando formulario...</p></div>}>
      <FormularioContent />
    </Suspense>
  );
}

/* ──────── UI Components ──────── */

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-[#F7F3F0] p-8 md:p-10">
      <h2 style={{ fontFamily: "Georgia, 'Times New Roman', serif" }} className="text-lg font-light italic text-[#3D2C2C] mb-5 pb-2 border-b border-[#F2D1D1]">
        {title}
      </h2>
      {children}
    </div>
  );
}

function InputField({ label, value, onChange, type = "text", placeholder, required }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#3D2C2C] mb-1.5">
        {label} {required && <span className="text-[#E8B4B4]">*</span>}
      </label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} className="w-full px-4 py-3 rounded-xl bg-[#FFFAF7] border border-[#F0EBE6] text-[#3D2C2C] placeholder:text-[#C4B8AD] focus:outline-none focus:ring-2 focus:ring-[#F2D1D1] focus:border-transparent transition-all text-sm" />
    </div>
  );
}

function TextareaField({ label, value, onChange, placeholder, required, rows = 3 }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean; rows?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#3D2C2C] mb-1.5">
        {label} {required && <span className="text-[#E8B4B4]">*</span>}
      </label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} rows={rows} className="w-full px-4 py-3 rounded-xl bg-[#FFFAF7] border border-[#F0EBE6] text-[#3D2C2C] placeholder:text-[#C4B8AD] focus:outline-none focus:ring-2 focus:ring-[#F2D1D1] focus:border-transparent transition-all resize-none text-sm" />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#3D2C2C] mb-1.5">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#FFFAF7] border border-[#F0EBE6] text-[#3D2C2C] focus:outline-none focus:ring-2 focus:ring-[#F2D1D1] focus:border-transparent transition-all text-sm appearance-none cursor-pointer">
        <option value="">Seleccionar...</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

/* ──────── Food Selector ──────── */

const FOOD_CATEGORIES: { name: string; emoji: string; items: string[] }[] = [
  { name: "Carnes", emoji: "🥩", items: ["Pollo", "Pavo", "Ternera", "Cerdo", "Cordero", "Conejo", "Jamón", "Lomo", "Solomillo", "Hígado"] },
  { name: "Pescados y mariscos", emoji: "🐟", items: ["Salmón", "Atún", "Merluza", "Bacalao", "Lubina", "Dorada", "Sardinas", "Gambas", "Langostinos", "Mejillones", "Pulpo", "Calamares"] },
  { name: "Verduras y hortalizas", emoji: "🥦", items: ["Brócoli", "Espinacas", "Calabacín", "Pimiento", "Tomate", "Lechuga", "Cebolla", "Zanahoria", "Judías verdes", "Berenjena", "Coliflor", "Espárragos", "Champiñones", "Alcachofa", "Pepino"] },
  { name: "Frutas", emoji: "🍎", items: ["Plátano", "Manzana", "Fresas", "Naranja", "Mandarina", "Uvas", "Sandía", "Melón", "Piña", "Kiwi", "Pera", "Melocotón", "Mango", "Arándanos"] },
  { name: "Otros alimentos", emoji: "🍳", items: ["Arroz", "Pasta", "Pan", "Huevos", "Avena", "Patata", "Boniato", "Legumbres", "Quinoa", "Frutos secos", "Yogur", "Queso", "Leche", "Aceite de oliva", "Aguacate", "Tofu"] },
];

function FoodSelector({ selections, onToggle }: { selections: Record<string, "liked" | "disliked">; onToggle: (food: string) => void }) {
  return (
    <div className="bg-[#FFFAF7] rounded-xl p-4 border border-[#F0EBE6]">
      <p className="text-sm font-medium text-[#3D2C2C] mb-1">Tus preferencias de alimentos</p>
      <p className="text-xs text-[#C4B8AD] mb-1">Pulsa una vez = <span className="text-emerald-500 font-semibold">me gusta</span> · Pulsa otra vez = <span className="text-red-400 font-semibold">no me gusta</span> · Pulsa otra vez = sin marcar</p>
      <p className="text-xs text-[#C4B8AD] mb-4">Los que no marques los tomaré como neutros.</p>
      <div className="space-y-4">
        {FOOD_CATEGORIES.map((cat) => (
          <div key={cat.name}>
            <p className="text-xs font-semibold text-[#3D2C2C] mb-2">{cat.emoji} {cat.name}</p>
            <div className="flex flex-wrap gap-2">
              {cat.items.map((food) => {
                const state = selections[food];
                return (
                  <button
                    key={food}
                    type="button"
                    onClick={() => onToggle(food)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer border ${
                      state === "liked"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm"
                        : state === "disliked"
                        ? "bg-red-50 text-red-500 border-red-300 shadow-sm line-through"
                        : "bg-white text-[#8B7E7E] border-[#E8E3DE] hover:border-[#C9A88E] hover:text-[#3D2C2C]"
                    }`}
                  >
                    {state === "liked" && "✓ "}
                    {state === "disliked" && "✗ "}
                    {food}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
