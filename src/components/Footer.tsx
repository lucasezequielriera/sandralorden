"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("Footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-10 sm:py-12 bg-warm-dark" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          {/* Logo */}
          <div className="text-center md:text-left">
            <a
              href="#inicio"
              className="font-[family-name:var(--font-script)] text-2xl text-white/90"
            >
              Sandra Lorden
            </a>
            <p className="mt-1 text-sm text-white/40">
              {t("subtitle")}
            </p>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link href="/privacidad" className="text-sm text-white/50 hover:text-white/90 transition-colors duration-300">{t("privacyPolicy")}</Link>
            <span className="text-white/20">·</span>
            <Link href="/aviso-legal" className="text-sm text-white/50 hover:text-white/90 transition-colors duration-300">{t("legalNotice")}</Link>
            <span className="text-white/20">·</span>
            <Link href="/cookies" className="text-sm text-white/50 hover:text-white/90 transition-colors duration-300">{t("cookiePolicy")}</Link>
            <span className="text-white/20">·</span>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-cookie-settings"))}
              className="text-sm text-white/50 hover:text-white/90 transition-colors duration-300 cursor-pointer"
            >
              {t("cookieSettings")}
            </button>
          </div>

          {/* Social */}
          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/sandralordenfit"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-all duration-300 text-xs"
              aria-label={t("ariaIgPro")}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
              </svg>
              @sandralordenfit
            </a>
            <a
              href="https://www.instagram.com/sandralorden"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-all duration-300 text-xs"
              aria-label={t("ariaIgPersonal")}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
              </svg>
              @sandralorden
            </a>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-xs text-white/30">
              &copy; {currentYear} Sandra Lorden. {t("rights")}
            </p>
            <p className="text-xs text-white/30">
              {t("madeBy")}{" "}
              <a
                href="https://www.lucasriera.com"
                target="_blank"
                rel="author noopener noreferrer"
                className="text-white/50 hover:text-white/80 transition-colors"
              >
                Lucas Riera
              </a>
              {" "}· {t("devCredit")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
