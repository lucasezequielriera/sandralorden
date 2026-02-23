const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
};

export function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (ch) => HTML_ENTITIES[ch] ?? ch);
}

export function sanitizeField(value: unknown, maxLength = 500): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export function sanitizeEmail(value: unknown): string {
  if (typeof value !== "string") return "";
  const cleaned = value.trim().slice(0, 254).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned) ? cleaned : "";
}

export function sanitizePhone(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, 30).replace(/[^\d+\-() ]/g, "");
}

export function isHoneypotFilled(body: Record<string, unknown>): boolean {
  return typeof body._hp === "string" && body._hp.length > 0;
}
