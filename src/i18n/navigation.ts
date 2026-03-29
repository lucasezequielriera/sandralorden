import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

const navigation = createNavigation(routing);

export const { Link, redirect, usePathname, useRouter, getPathname } = navigation;

type AppRouter = ReturnType<typeof navigation.useRouter>;
type AppPathname = ReturnType<typeof navigation.usePathname>;

/** usePathname typing includes internal template keys; runtime value is always resolved. */
export function replacePathLocale(
  router: AppRouter,
  pathname: AppPathname,
  locale: (typeof routing.locales)[number],
) {
  router.replace(pathname as never, { locale });
}
