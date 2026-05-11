"use client"

import { usePathname, useRouter } from "next/navigation"
import { LOCALES, LOCALE_NAMES, type Locale } from "@/lib/i18n"
import { useState } from "react"

export default function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  function switchTo(locale: Locale) {
    setOpen(false)
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`
    const newPath = pathname.replace(/^\/[a-z]{2}/, `/${locale}`)
    router.push(newPath)
  }

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 12px", borderRadius: 8,
          border: "1px solid var(--ce-border)",
          background: "var(--ce-surface)",
          color: "var(--ce-text-2)",
          fontFamily: "var(--font-onest), sans-serif",
          fontSize: 13, fontWeight: 500, cursor: "pointer",
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        {currentLocale.toUpperCase()}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          style={{
            position: "absolute", top: "calc(100% + 6px)", right: 0,
            background: "#fff", border: "1px solid var(--ce-border)",
            borderRadius: 10, padding: 4, minWidth: 130,
            boxShadow: "0 8px 24px -8px rgba(26,20,16,.2)",
            zIndex: 100, listStyle: "none", margin: 0,
          }}
        >
          {LOCALES.filter((loc) => loc === "ru").map((loc) => (
            <li key={loc}>
              <button
                role="option"
                aria-selected={loc === currentLocale}
                onClick={() => switchTo(loc)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  width: "100%", padding: "8px 12px", borderRadius: 7,
                  border: "none", background: loc === currentLocale ? "var(--ce-surface)" : "transparent",
                  color: "var(--ce-text)", cursor: "pointer",
                  fontFamily: "var(--font-onest), sans-serif", fontSize: 13, fontWeight: 500,
                  textAlign: "left",
                }}
              >
                <span style={{ fontWeight: loc === currentLocale ? 700 : 400, color: loc === currentLocale ? "var(--ce-primary)" : undefined }}>
                  {loc.toUpperCase()}
                </span>
                <span style={{ color: "var(--ce-muted)" }}>{LOCALE_NAMES[loc]}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 99 }}
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}
    </div>
  )
}
