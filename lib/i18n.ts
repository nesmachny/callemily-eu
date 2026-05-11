export const LOCALES = ["en", "pt"] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = "en"

export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  pt: "Português",
}

export const LOCALE_FLAGS: Record<Locale, string> = {
  en: "🇬🇧",
  pt: "🇵🇹",
}

export function isValidLocale(locale: string): locale is Locale {
  return (LOCALES as readonly string[]).includes(locale)
}
