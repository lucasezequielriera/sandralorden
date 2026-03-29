import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/programa-de-90-dias": {
      en: "/90-days-program",
    },
    "/cita-virtual": {
      en: "/virtual-appointment",
    },
    "/cita-virtual/reprogramar": {
      en: "/virtual-appointment/reschedule",
    },
    "/formulario": "/formulario",
    "/login": "/login",
    "/cliente": "/cliente",
    "/privacidad": "/privacidad",
    "/cookies": "/cookies",
    "/aviso-legal": "/aviso-legal",
    "/admin": "/admin",
    "/admin/clientes": "/admin/clientes",
    "/admin/clientes/nuevo": "/admin/clientes/nuevo",
    "/admin/clientes/[id]": "/admin/clientes/[id]",
    "/admin/contabilidad": "/admin/contabilidad",
    "/admin/archivos": "/admin/archivos",
    "/admin/citas-virtuales": {
      en: "/admin/virtual-appointments",
    },
  },
});
