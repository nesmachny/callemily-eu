export const LOCALES = ["ru", "kk", "uz"] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = "ru"

export const LOCALE_NAMES: Record<Locale, string> = {
  ru: "Русский",
  kk: "Қазақша",
  uz: "O'zbekcha",
}

export const LOCALE_FLAGS: Record<Locale, string> = {
  ru: "🇷🇺",
  kk: "🇰🇿",
  uz: "🇺🇿",
}

export function isValidLocale(locale: string): locale is Locale {
  return (LOCALES as readonly string[]).includes(locale)
}
