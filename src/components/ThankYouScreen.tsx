"use client";

import { m } from "framer-motion";
import { useTranslations } from "next-intl";
import type { Answers } from "./TransformationModal";

interface ThankYouScreenProps {
  answers: Answers;
  onClose: () => void;
}

export default function ThankYouScreen({ answers }: ThankYouScreenProps) {
  const t = useTranslations("ThankYouScreen");
  return (
    <m.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="text-center py-4">
        <m.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="w-14 h-14 mx-auto mb-5 rounded-full bg-gradient-to-br from-rosa-100 to-rosa-200 flex items-center justify-center"
        >
          <svg className="w-7 h-7 text-rosa-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
          </svg>
        </m.div>

        <h2 className="font-[family-name:var(--font-script)] text-2xl text-rosa-400 mb-3">
          {t("greeting", { name: answers.name })}
        </h2>

        <p className="text-sm text-warm-gray-400 leading-relaxed max-w-sm mx-auto mb-2">
          {t("desc1")}
        </p>

        <p className="text-sm text-warm-gray-400 leading-relaxed max-w-sm mx-auto mb-6">
          {(() => {
            const text = t("desc2", { email: answers.email });
            const parts = text.split(answers.email);
            return (
              <>
                {parts[0]}
                <strong className="text-warm-dark">{answers.email}</strong>
                {parts[1]}
              </>
            );
          })()}
        </p>

        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-warm-gray-100/50 rounded-2xl p-5 text-left max-w-sm mx-auto"
        >
          <p className="text-xs text-warm-gray-300 uppercase tracking-wider mb-3">{t("nextStepsLabel")}</p>
          <div className="space-y-3">
            <Step number={1} text={t("step1")} active />
            <Step number={2} text={t("step2")} />
            <Step number={3} text={t("step3")} />
          </div>
        </m.div>

        <p className="mt-5 text-xs text-warm-gray-300">{t("checkSpam")}</p>
      </div>
    </m.div>
  );
}

function Step({ number, text, active }: { number: number; text: string; active?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0 ${active ? "bg-rosa-400 text-white" : "bg-warm-gray-200 text-warm-gray-400"}`}>
        {number}
      </div>
      <p className={`text-sm ${active ? "text-warm-dark font-medium" : "text-warm-gray-400"}`}>{text}</p>
    </div>
  );
}
