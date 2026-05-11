"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import LanguageSwitcher from "@/components/language-switcher"
import { isValidLocale, DEFAULT_LOCALE, type Locale } from "@/lib/i18n"
import type { MenuItem } from "@/lib/menu"

const FALLBACK_NAV: MenuItem[] = [
  { id: "problems", label: "Проблемы",   url: "/#problems", target: null, sort_order: 0, parent_id: null },
  { id: "features", label: "Возможности", url: "/#features", target: null, sort_order: 1, parent_id: null },
  { id: "how",      label: "Как работает",url: "/#how",      target: null, sort_order: 2, parent_id: null },
  { id: "cases",    label: "Кейсы",       url: "/#cases",    target: null, sort_order: 3, parent_id: null },
  { id: "price",    label: "Стоимость",   url: "/price",     target: null, sort_order: 4, parent_id: null },
]

function resolveHref(url: string, locale: string): string {
  // anchor-only: /#section or #section → /locale#section
  const hashOnly = url.match(/^\/?#(.+)/)
  if (hashOnly) return `/${locale}#${hashOnly[1]}`
  // absolute external
  if (url.startsWith("http")) return url
  // internal path
  return `/${locale}${url.startsWith("/") ? url : `/${url}`}`
}

export default function Header({
  transparent = false,
  navItems,
}: {
  transparent?: boolean
  navItems?: MenuItem[]
}) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const rawLocale = pathname.split("/")[1]
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE

  const nav = navItems?.length ? navItems : FALLBACK_NAV

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      background: scrolled ? "rgba(250,247,242,.92)" : "var(--ce-bg)",
      backdropFilter: scrolled ? "blur(18px) saturate(160%)" : "none",
      WebkitBackdropFilter: scrolled ? "blur(18px) saturate(160%)" : "none",
      borderBottom: scrolled ? "1px solid var(--ce-border)" : "1px solid transparent",
      transition: "all .25s ease",
    }}>
      <div className="ce-wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        {/* Logo */}
        <Link href={`/${locale}`} style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-unbounded), sans-serif", fontWeight: 600, fontSize: 19, letterSpacing: "-0.02em", color: "var(--ce-text)", textDecoration: "none" }}>
          <span style={{ width: 34, height: 34, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "var(--ce-primary)", color: "#fff", borderRadius: 10, boxShadow: "0 6px 14px -4px rgba(232,93,44,.55)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </span>
          CallEmily
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: "flex", gap: 28, fontSize: 14.5, color: "var(--ce-text-2)" }} className="ce-nav-desktop">
          {nav.map(n => (
            <Link
              key={n.id}
              href={resolveHref(n.url, locale)}
              target={n.target ?? undefined}
              className="ce-nav-link"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <LanguageSwitcher currentLocale={locale} />
          <a href={`/${locale}#cta`} className="ce-btn ce-btn-primary ce-btn-sm ce-cta-desktop">Узнать стоимость</a>
          <button
            onClick={() => setOpen(o => !o)}
            className="ce-nav-burger"
            aria-label="Меню"
            style={{ display: "none", background: "none", border: "none", fontSize: 22, color: "var(--ce-text)", cursor: "pointer" }}
          >{open ? "✕" : "☰"}</button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: "var(--ce-surface)", borderTop: "1px solid var(--ce-border)", padding: "16px 0" }}>
          <div className="ce-wrap" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {nav.map(n => (
              <Link
                key={n.id}
                href={resolveHref(n.url, locale)}
                target={n.target ?? undefined}
                onClick={() => setOpen(false)}
                style={{ fontSize: 16, color: "var(--ce-text)", textDecoration: "none", fontWeight: 500 }}
              >
                {n.label}
              </Link>
            ))}
            <div style={{ paddingTop: 8, borderTop: "1px solid var(--ce-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <LanguageSwitcher currentLocale={locale} />
              <a href={`/${locale}#cta`} className="ce-btn ce-btn-primary ce-btn-sm" onClick={() => setOpen(false)}>
                Узнать стоимость
              </a>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .ce-nav-desktop { display: none !important; }
          .ce-nav-burger { display: flex !important; }
          .ce-cta-desktop { display: none !important; }
        }
        .ce-nav-link { color: var(--ce-text-2); text-decoration: none; transition: color .15s; }
        .ce-nav-link:hover { color: var(--ce-primary); }
      `}</style>
    </header>
  )
}
