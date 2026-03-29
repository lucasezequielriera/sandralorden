import createMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

/** Ruta sin prefijo de locale (p. ej. /en/admin → /admin). */
function pathnameWithoutLocale(pathname: string): string {
  for (const loc of routing.locales) {
    if (loc === routing.defaultLocale) continue;
    const prefix = `/${loc}/`;
    if (pathname.startsWith(prefix)) {
      return `/${pathname.slice(prefix.length)}`;
    }
  }
  return pathname;
}

/** Aplica el mismo prefijo de locale que la petición actual (p. ej. /en + /login → /en/login). */
function withLocalePrefix(pathname: string, unprefixedTarget: string): string {
  for (const loc of routing.locales) {
    if (loc === routing.defaultLocale) continue;
    const prefix = `/${loc}`;
    if (pathname.startsWith(`${prefix}/`) || pathname === prefix) {
      return `${prefix}${unprefixedTarget}`;
    }
  }
  return unprefixedTarget;
}

function isAdminPath(stripped: string): boolean {
  return stripped.startsWith("/admin");
}

function isClientPath(stripped: string): boolean {
  return stripped.startsWith("/cliente");
}

function isUnifiedLoginPath(stripped: string): boolean {
  return stripped === "/login";
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  /** Túnel Sentry (next.config tunnelRoute); no pasar por next-intl. */
  if (pathname === "/monitoring" || pathname.startsWith("/monitoring/")) {
    return NextResponse.next();
  }

  const stripped = pathnameWithoutLocale(pathname);

  if (stripped === "/admin/login" || stripped === "/cliente/login") {
    const url = request.nextUrl.clone();
    url.pathname = withLocalePrefix(pathname, "/login");
    return NextResponse.redirect(url);
  }

  const needsAuthMiddleware =
    isAdminPath(stripped) || isClientPath(stripped) || isUnifiedLoginPath(stripped);

  if (!needsAuthMiddleware) {
    return intlMiddleware(request);
  }

  let pendingCookies: Array<{
    name: string;
    value: string;
    options: Record<string, unknown>;
  }> = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          pendingCookies = cookiesToSet;
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoginPage = isUnifiedLoginPath(stripped);
  const isPasswordSetup = isLoginPage && request.nextUrl.searchParams.get("nueva") === "1";

  if (isLoginPage && user) {
    const { data: roleRow } = await supabase.from("user_roles").select("role").eq("user_id", user.id).single();
    const role = roleRow?.role;

    if (isPasswordSetup) {
      if (role === "admin") {
        const url = request.nextUrl.clone();
        url.pathname = withLocalePrefix(pathname, "/admin");
        url.searchParams.delete("nueva");
        return NextResponse.redirect(url);
      }
    } else {
      if (role === "admin") {
        const url = request.nextUrl.clone();
        url.pathname = withLocalePrefix(pathname, "/admin");
        return NextResponse.redirect(url);
      }
      if (role === "client") {
        const url = request.nextUrl.clone();
        url.pathname = withLocalePrefix(pathname, "/cliente");
        return NextResponse.redirect(url);
      }
    }
  }

  const isAdminZone = isAdminPath(stripped);
  const isClientZone = isClientPath(stripped);

  if (!isLoginPage && !user) {
    const url = request.nextUrl.clone();
    url.pathname = withLocalePrefix(pathname, "/login");
    return NextResponse.redirect(url);
  }

  if (!isLoginPage && user) {
    const { data: roleRow } = await supabase.from("user_roles").select("role").eq("user_id", user.id).single();
    const role = roleRow?.role;
    const requiredRole = isAdminZone ? "admin" : "client";
    if (role !== requiredRole) {
      const url = request.nextUrl.clone();
      url.pathname = withLocalePrefix(pathname, "/login");
      url.searchParams.set("error", "unauthorized");
      await supabase.auth.signOut();
      return NextResponse.redirect(url);
    }
  }

  const response = intlMiddleware(request);

  pendingCookies.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });

  return response;
}

export const config = {
  matcher: [
    "/",
    "/(es|en)/:path*",
    "/((?!api|stripe/webhook|monitoring|_next|_vercel|icon|apple-icon|favicon\\.ico|robots\\.txt|sitemap\\.xml|manifest\\.json|.*\\..*).*)",
  ],
};
