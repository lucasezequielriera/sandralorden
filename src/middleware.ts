import createMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const LOCALE_PREFIXES = routing.locales.map((l) => `/${l}/`);

function stripLocalePrefix(pathname: string): string {
  for (const prefix of LOCALE_PREFIXES) {
    if (pathname.startsWith(prefix)) return pathname.slice(prefix.length - 1);
  }
  return pathname;
}

function isAdminPath(pathname: string): boolean {
  return stripLocalePrefix(pathname).startsWith("/admin");
}

function isLoginPath(pathname: string): boolean {
  return stripLocalePrefix(pathname) === "/admin/login";
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!isAdminPath(pathname)) {
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
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          pendingCookies = cookiesToSet;
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLogin = isLoginPath(pathname);

  if (!isLogin && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  if (!isLogin && user) {
    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (roleRow?.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("error", "unauthorized");
      await supabase.auth.signOut();
      return NextResponse.redirect(url);
    }
  }

  if (isLogin && user) {
    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (roleRow?.role === "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
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
    "/((?!api|_next|_vercel|icon|apple-icon|favicon\\.ico|robots\\.txt|sitemap\\.xml|manifest\\.json|.*\\..*).*)",
  ],
};
