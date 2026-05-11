import { NextRequest, NextResponse } from "next/server"

const LOCALES = ["ru", "kk", "uz"]
const DEFAULT_LOCALE = "ru"

function detectLocale(acceptLanguage: string): string {
  if (!acceptLanguage) return DEFAULT_LOCALE
  const langs = acceptLanguage
    .split(",")
    .map((s) => {
      const [lang, q = "1"] = s.trim().split(";q=")
      return { lang: lang.trim().split("-")[0].toLowerCase(), q: parseFloat(q) }
    })
    .sort((a, b) => b.q - a.q)
  return langs.find(({ lang }) => LOCALES.includes(lang))?.lang ?? DEFAULT_LOCALE
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Pass through API routes and static files
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    /\.\w{1,5}$/.test(pathname)
  ) {
    return NextResponse.next()
  }

  const hasLocale = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  )

  if (hasLocale) {
    const locale = pathname.split("/")[1]
    const res = NextResponse.next()
    res.headers.set("x-locale", locale)
    return res
  }

  // Detect from cookie or Accept-Language, then redirect
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value
  const locale =
    cookieLocale && LOCALES.includes(cookieLocale)
      ? cookieLocale
      : detectLocale(request.headers.get("accept-language") ?? "")

  const target = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`
  return NextResponse.redirect(new URL(target, request.url))
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
}
