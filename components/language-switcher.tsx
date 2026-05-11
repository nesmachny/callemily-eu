"use client"

import { usePathname, useRouter } from "next/navigation"
import { LOCALES, type Locale } from "@/lib/i18n"

export default function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname()
  const router = useRouter()

  function switchTo(locale: Locale) {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`
    const newPath = pathname.replace(/^\/[a-z]{2}/, `/${locale}`)
    router.push(newPath)
  }

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: "var(--ce-surface)",
        border: "1px solid var(--ce-border)",
        borderRadius: 999,
        padding: 3,
        gap: 2,
      }}
      role="group"
      aria-label="Language"
    >
      {LOCALES.map((loc) => {
        const active = loc === currentLocale
        return (
          <button
            key={loc}
            onClick={() => switchTo(loc)}
            style={{
              padding: "5px 12px",
              borderRadius: 999,
              border: "none",
              background: active ? "var(--ce-text)" : "transparent",
              color: active ? "#fff" : "var(--ce-text-2)",
              fontFamily: "var(--font-onest), sans-serif",
              fontSize: 13,
              fontWeight: 600,
              cursor: active ? "default" : "pointer",
              transition: "all .18s ease",
              letterSpacing: "0.04em",
              lineHeight: 1,
            }}
            aria-pressed={active}
            disabled={active}
          >
            {loc.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}
