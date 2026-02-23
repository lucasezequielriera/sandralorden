"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { m, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const FOOD_KEY_TO_ES: Record<string, string> = {
  pollo: "Pollo", pavo: "Pavo", ternera: "Ternera", cerdo: "Cerdo", cordero: "Cordero",
  conejo: "Conejo", jamon: "Jamón", lomo: "Lomo", solomillo: "Solomillo", higado: "Hígado",
  salmon: "Salmón", atun: "Atún", merluza: "Merluza", bacalao: "Bacalao", lubina: "Lubina",
  dorada: "Dorada", sardinas: "Sardinas", gambas: "Gambas", langostinos: "Langostinos",
  mejillones: "Mejillones", pulpo: "Pulpo", calamares: "Calamares", brocoli: "Brócoli",
  espinacas: "Espinacas", calabacin: "Calabacín", pimiento: "Pimiento", tomate: "Tomate",
  lechuga: "Lechuga", cebolla: "Cebolla", zanahoria: "Zanahoria", judias_verdes: "Judías verdes",
  berenjena: "Berenjena", coliflor: "Coliflor", esparragos: "Espárragos", champinones: "Champiñones",
  alcachofa: "Alcachofa", pepino: "Pepino", platano: "Plátano", manzana: "Manzana", fresas: "Fresas",
  naranja: "Naranja", mandarina: "Mandarina", uvas: "Uvas", sandia: "Sandía", melon: "Melón",
  pina: "Piña", kiwi: "Kiwi", pera: "Pera", melocoton: "Melocotón", mango: "Mango",
  arandanos: "Arándanos", arroz: "Arroz", pasta: "Pasta", pan: "Pan", huevos: "Huevos",
  avena: "Avena", patata: "Patata", boniato: "Boniato", legumbres: "Legumbres", quinoa: "Quinoa",
  frutos_secos: "Frutos secos", yogur: "Yogur", queso: "Queso", leche: "Leche",
  aceite_oliva: "Aceite de oliva", aguacate: "Aguacate", tofu: "Tofu",
};

function FormularioContent() {
  const t = useTranslations("Formulario");
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
          alimentosPreferidos: Object.entries(foodSelections)
            .filter(([, v]) => v === "liked")
            .map(([k]) => FOOD_KEY_TO_ES[k] || k)
            .join(", "),
          alimentosNoGustan: Object.entries(foodSelections)
            .filter(([, v]) => v === "disliked")
            .map(([k]) => FOOD_KEY_TO_ES[k] || k)
            .join(", "),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setIsSent(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errorDefault"));
    } finally {
      setIsSending(false);
    }
  };

  const f = (key: string) => ({ key, label: t(`food_${key}`) });
  const FOOD_CATEGORIES: { name: string; emoji: string; items: { key: string; label: string }[] }[] = [
    { name: t("foodCatCarnes"), emoji: "🥩", items: ["pollo","pavo","ternera","cerdo","cordero","conejo","jamon","lomo","solomillo","higado"].map(f) },
    { name: t("foodCatPescados"), emoji: "🐟", items: ["salmon","atun","merluza","bacalao","lubina","dorada","sardinas","gambas","langostinos","mejillones","pulpo","calamares"].map(f) },
    { name: t("foodCatVerduras"), emoji: "🥦", items: ["brocoli","espinacas","calabacin","pimiento","tomate","lechuga","cebolla","zanahoria","judias_verdes","berenjena","coliflor","esparragos","champinones","alcachofa","pepino"].map(f) },
    { name: t("foodCatFrutas"), emoji: "🍎", items: ["platano","manzana","fresas","naranja","mandarina","uvas","sandia","melon","pina","kiwi","pera","melocoton","mango","arandanos"].map(f) },
    { name: t("foodCatOtros"), emoji: "🍳", items: ["arroz","pasta","pan","huevos","avena","patata","boniato","legumbres","quinoa","frutos_secos","yogur","queso","leche","aceite_oliva","aguacate","tofu"].map(f) },
  ];

  if (isSent) {
    return (
      <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#FFFAF7]">
        <div className="w-full max-w-lg text-center px-2">
          <m.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.2 }} className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#F2D1D1] to-[#E8B4B4] flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </m.div>
          <h1 style={{ fontFamily: "Georgia, 'Times New Roman', serif" }} className="text-3xl font-light italic text-[#3D2C2C] mb-4">
            {t("successTitle", { name: form.name })}
          </h1>
          <p className="text-[#8B7E7E] leading-relaxed mb-2">
            {t("successDesc1")}
          </p>
          <p className="text-[#8B7E7E] leading-relaxed mb-8">
            {t("successDesc2WhatsApp")}
          </p>
          <div className="inline-flex items-center gap-2 px-5 py-3 bg-[#25D366]/10 text-[#25D366] rounded-full text-sm font-medium">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {t("successBadge")}
          </div>
          <p className="mt-6 text-xs text-[#C4B8AD]">{t("successFooter")}</p>
        </div>
      </m.div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFAF7] py-8 sm:py-12 px-3 sm:px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 sm:mb-10">
          <p style={{ fontFamily: "Georgia, 'Times New Roman', serif" }} className="text-2xl sm:text-3xl font-light italic text-[#3D2C2C] mb-2">Sandra Lorden</p>
          <p className="text-[10px] sm:text-xs text-[#C9A88E] uppercase tracking-[2px] sm:tracking-[3px] mb-6 sm:mb-8">{t("brandSubtitle")}</p>
          <h1 style={{ fontFamily: "Georgia, 'Times New Roman', serif" }} className="text-xl sm:text-2xl md:text-3xl font-light italic text-[#3D2C2C] mb-3">{t("pageTitle")}</h1>
          <p className="text-[#8B7E7E] text-sm max-w-md mx-auto leading-relaxed px-2">{t("pageSubtitle")}</p>
        </div>

        <m.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="space-y-6">

          {/* ── DATOS PERSONALES ── */}
          <FormSection title={t("sectionAbout")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField id="f-name" label={t("labelName")} value={form.name} onChange={(v) => update("name", v)} required />
              <InputField id="f-email" label={t("labelEmail")} type="email" value={form.email} onChange={(v) => update("email", v)} required />
              <InputField id="f-phone" label={t("labelPhone")} type="tel" value={form.phone} onChange={(v) => update("phone", v)} placeholder={t("placeholderPhone")} required />
              <InputField id="f-age" label={t("labelAge")} value={form.age} onChange={(v) => update("age", v)} placeholder={t("placeholderAge")} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <InputField id="f-height" label={t("labelHeight")} value={form.height} onChange={(v) => update("height", v)} placeholder={t("placeholderHeight")} required />
              <InputField id="f-weight" label={t("labelWeight")} value={form.weight} onChange={(v) => update("weight", v)} placeholder={t("placeholderWeight")} required />
              <InputField id="f-goalWeight" label={t("labelGoalWeight")} value={form.goalWeight} onChange={(v) => update("goalWeight", v)} placeholder={t("placeholderGoalWeight")} />
            </div>
          </FormSection>

          {/* ── SALUD ── */}
          <FormSection title={t("sectionHealth")}>
            <div className="space-y-4">
              <TextareaField id="f-enfermedades" label={t("labelEnfermedades")} value={form.enfermedadesInfancia} onChange={(v) => update("enfermedadesInfancia", v)} placeholder={t("placeholderEnfermedades")} />
              <TextareaField id="f-lesiones" label={t("labelLesiones")} value={form.lesiones} onChange={(v) => update("lesiones", v)} placeholder={t("placeholderLesiones")} />
              <TextareaField id="f-cirugias" label={t("labelCirugias")} value={form.cirugias} onChange={(v) => update("cirugias", v)} placeholder={t("placeholderCirugias")} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField id="f-diabetes" label={t("labelDiabetes")} value={form.diabetes} onChange={(v) => update("diabetes", v)} options={[t("optNo"), t("optDiabetes1"), t("optDiabetes2")]} t={t} />
                <SelectField id="f-hipertension" label={t("labelHipertension")} value={form.hipertension} onChange={(v) => update("hipertension", v)} options={[t("optNo"), t("optSi")]} t={t} />
              </div>
              <TextareaField id="f-corazon" label={t("labelCorazon")} value={form.corazon} onChange={(v) => update("corazon", v)} placeholder={t("placeholderCorazon")} rows={2} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField id="f-hipotiroidismo" label={t("labelHipotiroidismo")} value={form.hipotiroidismo} onChange={(v) => update("hipotiroidismo", v)} options={[t("optNo"), t("optSi")]} t={t} />
                <SelectField id="f-colesterol" label={t("labelColesterol")} value={form.colesterolTrigliceridos} onChange={(v) => update("colesterolTrigliceridos", v)} options={[t("optNo"), t("optColesterol"), t("optTrigliceridos"), t("optAmbos")]} t={t} />
              </div>
              <SelectField id="f-digestivo" label={t("labelDigestivo")} value={form.digestivo} onChange={(v) => update("digestivo", v)} options={[t("optNo"), t("optEstrenimiento"), t("optColon"), t("optDoloresDigestivos"), t("optVarios")]} t={t} />
              <TextareaField id="f-medicamentos" label={t("labelMedicamentos")} value={form.medicamentos} onChange={(v) => update("medicamentos", v)} placeholder={t("placeholderMedicamentos")} rows={2} />
              <TextareaField id="f-fumaOBebe" label={t("labelFumaOBebe")} value={form.fumaOBebe} onChange={(v) => update("fumaOBebe", v)} placeholder={t("placeholderFumaOBebe")} rows={2} />
              <InputField id="f-descanso" label={t("labelDescanso")} value={form.descanso} onChange={(v) => update("descanso", v)} placeholder={t("placeholderDescanso")} />
            </div>
          </FormSection>

          {/* ── ALIMENTACIÓN ── */}
          <FormSection title={t("sectionNutricion")}>
            <div className="space-y-4">
              <TextareaField id="f-comidas" label={t("labelComidas")} value={form.comidasYHorarios} onChange={(v) => update("comidasYHorarios", v)} placeholder={t("placeholderComidas")} required />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField id="f-apetito" label={t("labelApetito")} value={form.apetito} onChange={(v) => update("apetito", v)} options={[t("optBueno"), t("optRegular"), t("optMalo")]} t={t} />
                <InputField id="f-momentoApetito" label={t("labelMomentoApetito")} value={form.momentoApetito} onChange={(v) => update("momentoApetito", v)} placeholder={t("placeholderMomentoApetito")} />
              </div>

              <FoodSelector selections={foodSelections} onToggle={toggleFood} foodCategories={FOOD_CATEGORIES} t={t} />

              <TextareaField id="f-diaTipo" label={t("labelDiaTipo")} value={form.diaTipo} onChange={(v) => update("diaTipo", v)} placeholder={t("placeholderDiaTipo")} rows={4} required />
              <TextareaField id="f-alergias" label={t("labelAlergias")} value={form.alergiasAlimentarias} onChange={(v) => update("alergiasAlimentarias", v)} placeholder={t("placeholderAlergias")} rows={2} />
              <TextareaField id="f-suplementos" label={t("labelSuplementos")} value={form.suplementacion} onChange={(v) => update("suplementacion", v)} placeholder={t("placeholderSuplementos")} rows={2} />
              <TextareaField id="f-suplementosInteres" label={t("labelSuplementosInteres")} value={form.suplementacionInteres} onChange={(v) => update("suplementacionInteres", v)} placeholder={t("placeholderSuplementosInteres")} rows={2} />

              <div className="bg-[#FFFAF7] rounded-xl p-4 border border-[#F0EBE6]">
                <p className="text-sm font-medium text-[#3D2C2C] mb-1">{t("dietaTitle")}</p>
                <p className="text-xs text-[#C4B8AD] mb-3">{t("dietaNote")}</p>
                <div className="space-y-3">
                  <TextareaField id="f-dietaBase" label={t("labelDietaBase")} value={form.dietaAnteriorBase} onChange={(v) => update("dietaAnteriorBase", v)} placeholder={t("placeholderDietaBase")} rows={2} />
                  <InputField id="f-dietaTiempo" label={t("labelDietaTiempo")} value={form.dietaAnteriorTiempo} onChange={(v) => update("dietaAnteriorTiempo", v)} placeholder={t("placeholderDietaTiempo")} />
                  <InputField id="f-dietaDuracion" label={t("labelDietaDuracion")} value={form.dietaAnteriorDuracion} onChange={(v) => update("dietaAnteriorDuracion", v)} placeholder={t("placeholderDietaDuracion")} />
                  <TextareaField id="f-dietaResultado" label={t("labelDietaResultado")} value={form.dietaAnteriorObservaciones} onChange={(v) => update("dietaAnteriorObservaciones", v)} placeholder={t("placeholderDietaResultado")} rows={2} />
                </div>
              </div>
            </div>
          </FormSection>

          {/* ── ENTRENAMIENTO ── */}
          <FormSection title={t("sectionEntrenamiento")}>
            <div className="space-y-4">
              <TextareaField id="f-diasActual" label={t("labelDiasActual")} value={form.diasEntrenoActual} onChange={(v) => update("diasEntrenoActual", v)} placeholder={t("placeholderDiasActual")} required />
              <TextareaField id="f-diasCompromiso" label={t("labelDiasCompromiso")} value={form.diasEntrenoCompromiso} onChange={(v) => update("diasEntrenoCompromiso", v)} placeholder={t("placeholderDiasCompromiso")} required />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField id="f-horaEntreno" label={t("labelHoraEntreno")} value={form.horaEntreno} onChange={(v) => update("horaEntreno", v)} placeholder={t("placeholderHoraEntreno")} />
                <InputField id="f-duracionSesion" label={t("labelDuracionSesion")} value={form.duracionSesion} onChange={(v) => update("duracionSesion", v)} placeholder={t("placeholderDuracionSesion")} />
              </div>
              <SelectField id="f-casaGimnasio" label={t("labelCasaGimnasio")} value={form.casaOGimnasio} onChange={(v) => update("casaOGimnasio", v)} options={[t("optGimnasio"), t("optCasa"), t("optAmbos")]} t={t} />
              <TextareaField id="f-materialCasa" label={t("labelMaterialCasa")} value={form.materialCasa} onChange={(v) => update("materialCasa", v)} placeholder={t("placeholderMaterialCasa")} rows={2} />
            </div>
          </FormSection>

          {/* ── OBJETIVOS DE MEJORA ── */}
          <FormSection title={t("sectionObjetivos")}>
            <div className="space-y-4">
              <TextareaField id="f-rendimiento" label={t("labelRendimiento")} value={form.mejoraRendimiento} onChange={(v) => update("mejoraRendimiento", v)} placeholder={t("placeholderRendimiento")} rows={3} required />
              <TextareaField id="f-estetica" label={t("labelEstetica")} value={form.mejoraEstetica} onChange={(v) => update("mejoraEstetica", v)} placeholder={t("placeholderEstetica")} rows={3} required />
            </div>
          </FormSection>

          {/* ── ALGO MÁS ── */}
          <FormSection title={t("sectionExtra")}>
            <TextareaField id="f-extra" label={t("labelExtra")} value={form.extra} onChange={(v) => update("extra", v)} placeholder={t("placeholderExtra")} rows={4} />
          </FormSection>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <m.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                {error}
              </m.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-[#F7F3F0] p-4 sm:p-6 text-center">
            <label className="flex items-start gap-2.5 mb-4 cursor-pointer text-left">
              <input type="checkbox" required className="mt-0.5 w-4 h-4 rounded border-[#E6DDD6] accent-[#C9A88E] cursor-pointer" />
              <span className="text-xs text-[#8B7E7E] leading-relaxed">
                {t("privacyCheck")}
                <Link href="/privacidad" target="_blank" className="text-[#C9A88E] underline underline-offset-2 hover:text-[#A68B70]">{t("privacyLink")}</Link>
              </span>
            </label>
            <button type="submit" disabled={isSending} className="w-full py-3.5 sm:py-4 px-6 bg-[#3D2C2C] text-white rounded-xl sm:rounded-2xl font-medium transition-all hover:bg-[#5A4545] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm">
              {isSending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  {t("submitSending")}
                </span>
              ) : t("submitButton")}
            </button>
            <p className="mt-3 text-xs text-[#C4B8AD]">{t("submitNote")}</p>
          </div>
        </m.form>
      </div>
    </div>
  );
}

export default function FormularioPage() {
  const t = useTranslations("Formulario");
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#FFFAF7]"><p className="text-[#C9A88E]">{t("loadingText")}</p></div>}>
      <FormularioContent />
    </Suspense>
  );
}

/* ──────── UI Components ──────── */

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-[#F7F3F0] p-5 sm:p-8 md:p-10">
      <h2 style={{ fontFamily: "Georgia, 'Times New Roman', serif" }} className="text-base sm:text-lg font-light italic text-[#3D2C2C] mb-4 sm:mb-5 pb-2 border-b border-[#F2D1D1]">
        {title}
      </h2>
      {children}
    </div>
  );
}

function InputField({ label, value, onChange, type = "text", placeholder, required, id }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean; id: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[#3D2C2C] mb-1.5">
        {label} {required && <span className="text-[#E8B4B4]">*</span>}
      </label>
      <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} className="w-full px-4 py-3 rounded-xl bg-[#FFFAF7] border border-[#F0EBE6] text-[#3D2C2C] placeholder:text-[#C4B8AD] focus:outline-none focus:ring-2 focus:ring-[#F2D1D1] focus:border-transparent transition-all text-sm" />
    </div>
  );
}

function TextareaField({ label, value, onChange, placeholder, required, rows = 3, id }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean; rows?: number; id: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[#3D2C2C] mb-1.5">
        {label} {required && <span className="text-[#E8B4B4]">*</span>}
      </label>
      <textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} rows={rows} className="w-full px-4 py-3 rounded-xl bg-[#FFFAF7] border border-[#F0EBE6] text-[#3D2C2C] placeholder:text-[#C4B8AD] focus:outline-none focus:ring-2 focus:ring-[#F2D1D1] focus:border-transparent transition-all resize-none text-sm" />
    </div>
  );
}

function SelectField({ label, value, onChange, options, t, id }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; t: (key: string) => string; id: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[#3D2C2C] mb-1.5">{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#FFFAF7] border border-[#F0EBE6] text-[#3D2C2C] focus:outline-none focus:ring-2 focus:ring-[#F2D1D1] focus:border-transparent transition-all text-sm appearance-none cursor-pointer">
        <option value="">{t("selectDefault")}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

/* ──────── Food Selector ──────── */

function FoodSelector({ selections, onToggle, foodCategories, t }: { 
  selections: Record<string, "liked" | "disliked">; 
  onToggle: (food: string) => void;
  foodCategories: { name: string; emoji: string; items: { key: string; label: string }[] }[];
  t: (key: string) => string;
}) {
  return (
    <div className="bg-[#FFFAF7] rounded-xl p-3 sm:p-4 border border-[#F0EBE6]">
      <p className="text-sm font-medium text-[#3D2C2C] mb-1">{t("foodTitle")}</p>
      <p className="text-xs text-[#C4B8AD] mb-1">
        {t("foodInstruction1")}
        <span className="text-emerald-500 font-semibold">{t("foodLiked")}</span>
        {t("foodInstruction2")}
        <span className="text-red-400 font-semibold">{t("foodDisliked")}</span>
        {t("foodInstruction3")}
      </p>
      <p className="text-xs text-[#C4B8AD] mb-3 sm:mb-4">{t("foodNeutral")}</p>
      <div className="space-y-4">
        {foodCategories.map((cat) => (
          <div key={cat.name}>
            <p className="text-xs font-semibold text-[#3D2C2C] mb-2">{cat.emoji} {cat.name}</p>
            <div className="flex flex-wrap gap-2">
              {cat.items.map((food) => {
                const state = selections[food.key];
                return (
                  <button
                    key={food.key}
                    type="button"
                    onClick={() => onToggle(food.key)}
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
                    {food.label}
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
