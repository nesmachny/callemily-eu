import Link from "next/link"
import { t } from "@/lib/translations"

export default function Footer({ locale = "en" }: { locale?: string }) {
  const tr = t(locale).footer
  return (
    <footer style={{ background: "var(--ce-text)", color: "rgba(255,255,255,.7)", paddingTop: 72, paddingBottom: 32 }}>
      <div className="ce-wrap">
        <div className="ce-foot-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 40, marginBottom: 60 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#fff", fontFamily: "var(--font-unbounded), sans-serif", fontWeight: 600, fontSize: 18, marginBottom: 16 }}>
              <span style={{ width: 34, height: 34, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "var(--ce-primary)", color: "#fff", borderRadius: 10 }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </span>
              CallEmily
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.65, maxWidth: 300, margin: "0 0 24px" }}>{tr.desc}</p>
            <div style={{ fontSize: 14, lineHeight: 1.9 }}>
              {tr.phone && <div><a href={`tel:${tr.phone}`} style={{ color: "#fff", textDecoration: "none" }}>{tr.phone}</a></div>}
              <div><a href={`mailto:${tr.email}`} style={{ color: "rgba(255,255,255,.7)", textDecoration: "none" }}>{tr.email}</a></div>
            </div>
          </div>

          {tr.cols.map((col, i) => (
            <div key={i}>
              <div style={{ color: "#fff", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 18 }}>{col.title}</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10, fontSize: 14.5 }}>
                {col.links.map((l, j) => (
                  <li key={j}>
                    <Link href={`/${locale}${l.href.startsWith("/") ? l.href : l.href}`} className="ce-foot-link">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ paddingTop: 24, borderTop: "1px solid rgba(255,255,255,.1)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, fontSize: 13, color: "rgba(255,255,255,.5)" }}>
          <div>{tr.copy} <Link href={`/${locale}/privacy`} style={{ color: "rgba(255,255,255,.5)", textDecoration: "underline" }}>{tr.privacyLabel}</Link></div>
          <div>{tr.madeIn}</div>
        </div>
      </div>
      <style>{`
        @media (max-width: 800px) { .ce-foot-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 480px) { .ce-foot-grid { grid-template-columns: 1fr !important; } }
        .ce-foot-link { opacity: 0.8; text-decoration: none; transition: opacity .15s; color: rgba(255,255,255,.7); }
        .ce-foot-link:hover { opacity: 1; }
      `}</style>
    </footer>
  )
}
