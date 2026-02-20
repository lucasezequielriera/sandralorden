"use client";

import { useState, useCallback, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import { track } from "@vercel/analytics";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import ThankYouScreen from "./ThankYouScreen";

interface TransformationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface Answers {
  name: string;
  email: string;
  phone: string;
  service: string;
  goal: string;
  levelAndDays: string;
  trainingLocation: string;
  duration: string;
  obstacle: string;
  extra: string;
  _hp: string;
}

const emptyAnswers: Answers = {
  name: "", email: "", phone: "", service: "", goal: "",
  levelAndDays: "", trainingLocation: "", duration: "", obstacle: "", extra: "", _hp: "",
};

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction < 0 ? 80 : -80, opacity: 0 }),
};

type StepId = "contact" | "service" | "goal" | "levelDays" | "location" | "duration" | "obstacle" | "extra";

function getSteps(service: string): StepId[] {
  const base: StepId[] = ["contact", "service", "goal", "levelDays"];
  base.push("duration", "obstacle", "extra");
  return base;
}

export default function TransformationModal({ isOpen, onClose }: TransformationModalProps) {
  const t = useTranslations("TransformationModal");
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);

  const steps = getSteps(answers.service);
  const currentStep = steps[stepIndex];
  const totalSteps = steps.length;

  const resetModal = useCallback(() => {
    setStepIndex(0);
    setDirection(1);
    setIsSending(false);
    setIsSent(false);
    setError(null);
    setAnswers(emptyAnswers);
  }, []);

  useEffect(() => {
    if (isOpen) track("funnel_opened");
  }, [isOpen]);

  const handleClose = () => { onClose(); setTimeout(resetModal, 300); };

  const nextStep = () => { setDirection(1); setStepIndex((s) => s + 1); };
  const prevStep = () => { setDirection(-1); setStepIndex((s) => s - 1); };

  const selectOption = (field: keyof Answers, value: string) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
    if (field === "service") track("funnel_service_selected", { service: value });
    setTimeout(nextStep, 200);
  };

  const submitAndGenerate = async () => {
    track("funnel_submitted", { service: answers.service, goal: answers.goal });
    setIsSending(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setIsSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errorDefault"));
    } finally {
      setIsSending(false);
    }
  };

  const progress = isSent ? 100 : Math.round((stepIndex / totalSteps) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
          <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClose} className="absolute inset-0 bg-warm-dark/40 backdrop-blur-sm" />
          <m.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`relative w-full overflow-y-auto bg-white shadow-2xl rounded-t-3xl sm:rounded-3xl ${isSent ? "max-w-2xl max-h-[95svh] sm:max-h-[92vh]" : "max-w-lg max-h-[92svh] sm:max-h-[90vh]"}`}
          >
            <div className="sticky top-0 z-10 bg-white rounded-t-3xl">
              <div className="h-1 bg-warm-gray-100 rounded-t-3xl overflow-hidden">
                <m.div className="h-full bg-gradient-to-r from-rosa-300 to-rosa-400" animate={{ width: `${progress}%` }} transition={{ duration: 0.4, ease: "easeOut" }} />
              </div>
            </div>
            <button onClick={handleClose} className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-warm-gray-100 flex items-center justify-center text-warm-gray-400 hover:bg-warm-gray-200 hover:text-warm-dark transition-all cursor-pointer" aria-label={t("close")}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
            </button>

            <div className="p-5 sm:p-8 pt-5 sm:pt-6">
              {isSent ? (
                <ThankYouScreen answers={answers} onClose={handleClose} />
              ) : isSending ? (
                <SendingState name={answers.name} />
              ) : error ? (
                <ErrorState error={error} onRetry={submitAndGenerate} />
              ) : (
                <AnimatePresence mode="wait" custom={direction}>
                  <m.div key={currentStep} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                    {currentStep === "contact" && (
                      <StepContact name={answers.name} email={answers.email} phone={answers.phone}
                        onChangeName={(v) => setAnswers({ ...answers, name: v })}
                        onChangeEmail={(v) => setAnswers({ ...answers, email: v })}
                        onChangePhone={(v) => setAnswers({ ...answers, phone: v })}
                        onNext={nextStep} />
                    )}
                    {currentStep === "service" && <StepService onSelect={(v) => selectOption("service", v)} selected={answers.service} />}
                    {currentStep === "goal" && <StepGoal onSelect={(v) => selectOption("goal", v)} selected={answers.goal} />}
                    {currentStep === "levelDays" && <StepLevelDays onSelect={(v) => selectOption("levelAndDays", v)} selected={answers.levelAndDays} />}
                    {currentStep === "location" && <StepLocation onSelect={(v) => selectOption("trainingLocation", v)} selected={answers.trainingLocation} />}
                    {currentStep === "duration" && <StepDuration onSelect={(v) => selectOption("duration", v)} selected={answers.duration} />}
                    {currentStep === "obstacle" && <StepObstacle onSelect={(v) => selectOption("obstacle", v)} selected={answers.obstacle} />}
                    {currentStep === "extra" && <StepExtra value={answers.extra} onChange={(v) => setAnswers({ ...answers, extra: v })} onSubmit={submitAndGenerate} />}
                  </m.div>
                </AnimatePresence>
              )}

              {!isSent && !isSending && !error && stepIndex > 0 && (
                <button onClick={prevStep} className="mt-6 text-sm text-warm-gray-400 hover:text-warm-dark transition-colors flex items-center gap-1 cursor-pointer">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
                  {t("back")}
                </button>
              )}
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}

/* ──────────── SHARED UI ──────────── */

function StepHeader({ emoji, title, subtitle }: { emoji: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <span className="text-3xl mb-3 block">{emoji}</span>
      <h3 className="font-[family-name:var(--font-display)] italic text-2xl font-light text-warm-dark">{title}</h3>
      {subtitle && <p className="mt-2 text-sm text-warm-gray-400">{subtitle}</p>}
    </div>
  );
}

function OptionCard({ label, description, selected, onClick }: { label: string; description?: string; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${selected ? "border-rosa-300 bg-rosa-50 shadow-sm" : "border-warm-gray-100 bg-warm-gray-100/30 hover:border-rosa-200 hover:bg-rosa-50/50"}`}>
      <p className="font-medium text-warm-dark text-sm">{label}</p>
      {description && <p className="text-xs text-warm-gray-400 mt-1">{description}</p>}
    </button>
  );
}

/* ──────────── STEPS ──────────── */

function StepContact({ name, email, phone, onChangeName, onChangeEmail, onChangePhone, onNext }: {
  name: string; email: string; phone: string;
  onChangeName: (v: string) => void; onChangeEmail: (v: string) => void; onChangePhone: (v: string) => void;
  onNext: () => void;
}) {
  const t = useTranslations("TransformationModal");
  const isValid = name.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && phone.replace(/\D/g, "").length >= 9;
  return (
    <div>
      <StepHeader emoji="✨" title={t("contactTitle")} subtitle={t("contactSubtitle")} />
      <div className="space-y-3.5">
        <div>
          <label htmlFor="modal-name" className="block text-sm font-medium text-warm-dark mb-1.5">{t("labelName")}</label>
          <input id="modal-name" type="text" value={name} onChange={(e) => onChangeName(e.target.value)} placeholder={t("placeholderName")} className="w-full px-4 py-3 rounded-xl bg-warm-gray-100/50 border border-warm-gray-200/50 text-warm-dark placeholder:text-warm-gray-300 focus:outline-none focus:ring-2 focus:ring-rosa-200 focus:border-transparent transition-all" />
        </div>
        <div>
          <label htmlFor="modal-email" className="block text-sm font-medium text-warm-dark mb-1.5">{t("labelEmail")}</label>
          <input id="modal-email" type="email" value={email} onChange={(e) => onChangeEmail(e.target.value)} placeholder={t("placeholderEmail")} className="w-full px-4 py-3 rounded-xl bg-warm-gray-100/50 border border-warm-gray-200/50 text-warm-dark placeholder:text-warm-gray-300 focus:outline-none focus:ring-2 focus:ring-rosa-200 focus:border-transparent transition-all" />
        </div>
        <div>
          <label htmlFor="modal-phone" className="block text-sm font-medium text-warm-dark mb-1.5">{t("labelPhone")}</label>
          <input id="modal-phone" type="tel" value={phone} onChange={(e) => onChangePhone(e.target.value)} onKeyDown={(e) => e.key === "Enter" && isValid && onNext()} placeholder={t("placeholderPhone")} className="w-full px-4 py-3 rounded-xl bg-warm-gray-100/50 border border-warm-gray-200/50 text-warm-dark placeholder:text-warm-gray-300 focus:outline-none focus:ring-2 focus:ring-rosa-200 focus:border-transparent transition-all" />
        </div>
      </div>
      <button onClick={onNext} disabled={!isValid} className="mt-5 w-full px-6 py-3 text-sm font-medium text-white bg-warm-dark rounded-xl transition-all hover:bg-warm-gray-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">{t("continue")}</button>
      <p className="mt-2 text-center text-[11px] text-warm-gray-300">{t("contactNote")}</p>
    </div>
  );
}

function StepService({ onSelect, selected }: { onSelect: (v: string) => void; selected: string }) {
  const t = useTranslations("TransformationModal");
  const options = [
    { value: t("serviceNutricion"), desc: t("serviceNutricionDesc") },
    { value: t("serviceEntreno"), desc: t("serviceEntrenoDesc") },
    { value: t("servicePack"), desc: t("servicePackDesc") },
  ];
  return (
    <div>
      <StepHeader emoji="🪄" title={t("serviceTitle")} subtitle={t("serviceSubtitle")} />
      <div className="space-y-3">
        {options.map((o) => (
          <OptionCard key={o.value} label={o.value} description={o.desc} selected={selected === o.value} onClick={() => onSelect(o.value)} />
        ))}
      </div>
    </div>
  );
}

function StepGoal({ onSelect, selected }: { onSelect: (v: string) => void; selected: string }) {
  const t = useTranslations("TransformationModal");
  const options = [
    { value: t("goal1"), desc: t("goal1Desc") },
    { value: t("goal2"), desc: t("goal2Desc") },
    { value: t("goal3"), desc: t("goal3Desc") },
    { value: t("goal4"), desc: t("goal4Desc") },
  ];
  return (
    <div>
      <StepHeader emoji="🎯" title={t("goalTitle")} subtitle={t("goalSubtitle")} />
      <div className="space-y-3">
        {options.map((o) => (
          <OptionCard key={o.value} label={o.value} description={o.desc} selected={selected === o.value} onClick={() => onSelect(o.value)} />
        ))}
      </div>
    </div>
  );
}

function StepLevelDays({ onSelect, selected }: { onSelect: (v: string) => void; selected: string }) {
  const t = useTranslations("TransformationModal");
  const options = [
    { value: t("level1"), desc: t("level1Desc") },
    { value: t("level2"), desc: t("level2Desc") },
    { value: t("level3"), desc: t("level3Desc") },
  ];
  return (
    <div>
      <StepHeader emoji="💪" title={t("levelTitle")} subtitle={t("levelSubtitle")} />
      <div className="space-y-3">
        {options.map((o) => (
          <OptionCard key={o.value} label={o.value} description={o.desc} selected={selected === o.value} onClick={() => onSelect(o.value)} />
        ))}
      </div>
    </div>
  );
}

function StepLocation({ onSelect, selected }: { onSelect: (v: string) => void; selected: string }) {
  const t = useTranslations("TransformationModal");
  const options = [
    { value: t("locationGym"), desc: t("locationGymDesc") },
    { value: t("locationHome"), desc: t("locationHomeDesc") },
  ];
  return (
    <div>
      <StepHeader emoji="📍" title={t("locationTitle")} subtitle={t("locationSubtitle")} />
      <div className="space-y-3">
        {options.map((o) => (
          <OptionCard key={o.value} label={o.value} description={o.desc} selected={selected === o.value} onClick={() => onSelect(o.value)} />
        ))}
      </div>
    </div>
  );
}

function StepDuration({ onSelect, selected }: { onSelect: (v: string) => void; selected: string }) {
  const t = useTranslations("TransformationModal");
  const options = [
    { value: t("duration1"), desc: t("duration1Desc") },
    { value: t("duration2"), desc: t("duration2Desc") },
    { value: t("duration3"), desc: t("duration3Desc") },
    { value: t("duration4"), desc: t("duration4Desc") },
  ];
  return (
    <div>
      <StepHeader emoji="⏳" title={t("durationTitle")} />
      <div className="space-y-3">
        {options.map((o) => (
          <OptionCard key={o.value} label={o.value} description={o.desc} selected={selected === o.value} onClick={() => onSelect(o.value)} />
        ))}
      </div>
    </div>
  );
}

function StepObstacle({ onSelect, selected }: { onSelect: (v: string) => void; selected: string }) {
  const t = useTranslations("TransformationModal");
  const options = [
    { value: t("obstacle1"), desc: t("obstacle1Desc") },
    { value: t("obstacle2"), desc: t("obstacle2Desc") },
    { value: t("obstacle3"), desc: t("obstacle3Desc") },
    { value: t("obstacle4"), desc: t("obstacle4Desc") },
  ];
  return (
    <div>
      <StepHeader emoji="💭" title={t("obstacleTitle")} />
      <div className="space-y-3">
        {options.map((o) => (
          <OptionCard key={o.value} label={o.value} description={o.desc} selected={selected === o.value} onClick={() => onSelect(o.value)} />
        ))}
      </div>
    </div>
  );
}

function StepExtra({ value, onChange, onSubmit }: { value: string; onChange: (v: string) => void; onSubmit: () => void }) {
  const t = useTranslations("TransformationModal");
  const [accepted, setAccepted] = useState(false);
  return (
    <div>
      <StepHeader emoji="📋" title={t("extraTitle")} subtitle={t("extraSubtitle")} />
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl bg-warm-gray-100/50 border border-warm-gray-200/50 text-warm-dark placeholder:text-warm-gray-300 focus:outline-none focus:ring-2 focus:ring-rosa-200 focus:border-transparent transition-all resize-none text-sm" placeholder={t("extraPlaceholder")} />
      <label className="flex items-start gap-2.5 mt-4 cursor-pointer">
        <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="mt-0.5 w-4 h-4 rounded border-warm-gray-200 text-rosa-400 focus:ring-rosa-200 accent-rosa-400 cursor-pointer" />
        <span className="text-xs text-warm-gray-400 leading-relaxed">
          {t("privacyCheck")}{" "}
          <Link href="/privacidad" target="_blank" className="text-rosa-400 underline underline-offset-2 hover:text-rosa-500">{t("privacyLink")}</Link>
        </span>
      </label>
      <button onClick={onSubmit} disabled={!accepted} className="mt-4 w-full px-6 py-4 text-sm font-medium text-white bg-gradient-to-r from-rosa-400 to-rosa-300 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none">{t("submit")}</button>
      <p className="mt-3 text-center text-xs text-warm-gray-300">{t("submitNote")}</p>
    </div>
  );
}

/* ──────────── STATES ──────────── */

function SendingState({ name }: { name: string }) {
  const t = useTranslations("TransformationModal");
  return (
    <div className="py-12 text-center">
      <m.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-12 h-12 mx-auto mb-6 rounded-full border-2 border-warm-gray-100 border-t-rosa-400" />
      <h3 className="font-[family-name:var(--font-display)] italic text-xl font-light text-warm-dark mb-2">{t("sendingTitle")}</h3>
      <p className="text-sm text-warm-gray-400">{t("sendingDesc", { name })}</p>
      <div className="mt-6 flex justify-center gap-1">
        {["dot-1", "dot-2", "dot-3"].map((id, i) => (
          <m.div key={id} animate={{ y: [0, -8, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} className="w-2 h-2 rounded-full bg-rosa-300" />
        ))}
      </div>
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  const t = useTranslations("TransformationModal");
  return (
    <div className="py-12 text-center">
      <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-rosa-50 flex items-center justify-center">
        <svg className="w-6 h-6 text-rosa-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
      </div>
      <h3 className="font-[family-name:var(--font-display)] italic text-xl font-light text-warm-dark mb-2">{t("errorTitle")}</h3>
      <p className="text-sm text-warm-gray-400 mb-6">{error}</p>
      <button onClick={onRetry} className="px-6 py-3 text-sm font-medium text-white bg-warm-dark rounded-xl transition-all hover:bg-warm-gray-500 cursor-pointer">{t("retry")}</button>
    </div>
  );
}
