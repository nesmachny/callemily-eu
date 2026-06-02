import type { CaseItem } from "@/lib/cases"
import { t } from "@/lib/translations"

const FALLBACK_PHOTOS = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80",
]

export default function CasesSection({ cases, locale }: { cases: CaseItem[]; locale: string }) {
  const tr = t(locale).cases
  return (
    <section id="cases" className="ce-section" style={{ background: "var(--ce-bg-alt)" }}>
      <div className="ce-wrap">
        <div style={{ maxWidth: 720, marginBottom: 56 }}>
          <span className="ce-eyebrow">{tr.eyebrow}</span>
          <h2 className="ce-h-display" style={{ fontSize: "clamp(32px, 4.4vw, 56px)", margin: 0 }}>{tr.h2}</h2>
          <p style={{ fontSize: 18, color: "var(--ce-text-2)", marginTop: 18 }}>{tr.sub}</p>
        </div>

        <div className="ce-cases-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {cases.map((c, i) => (
            <article key={c.slug} className="ce-card ce-card-hover" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ height: 200, position: "relative", overflow: "hidden", background: "var(--ce-bg)" }}>
                <img
                  src={c.photo || FALLBACK_PHOTOS[i % FALLBACK_PHOTOS.length]}
                  alt={`CallEmily case study: ${c.name}`}
                  loading="lazy"
                  width={800}
                  height={200}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <span className="ce-chip" style={{ position: "absolute", top: 14, left: 14, background: "rgba(255,255,255,.95)" }}>{c.tag}</span>
              </div>
              <div style={{ padding: 28, display: "flex", flexDirection: "column", flex: 1 }}>
                <h3 className="ce-h-display" style={{ fontSize: 22, margin: "0 0 18px", lineHeight: 1.15 }}>{c.name}</h3>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 22, paddingBottom: 22, borderBottom: "1px dashed var(--ce-border)" }}>
                  <span className="ce-stat-num" style={{ fontSize: 52, color: "var(--ce-primary)" }}>{c.stat}</span>
                  <span style={{ fontSize: 13, color: "var(--ce-muted)", flex: 1 }}>{c.statLabel}</span>
                </div>
                <p style={{ margin: 0, fontSize: 15, color: "var(--ce-text-2)", fontStyle: "italic", lineHeight: 1.55, flex: 1 }}>"{c.quote}"</p>
                <div style={{ marginTop: 18, fontSize: 13, color: "var(--ce-muted)" }}>{c.author}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) { .ce-cases-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}
