import { t } from "@/lib/translations"

export default function ProblemsSection({ locale }: { locale: string }) {
  const tr = t(locale).problems
  return (
    <section id="problems" className="ce-section" style={{ background: "var(--ce-bg)" }}>
      <div className="ce-wrap">
        <div style={{ maxWidth: 720, marginBottom: 56 }}>
          <span className="ce-eyebrow">{tr.eyebrow}</span>
          <h2 className="ce-h-display" style={{ fontSize: "clamp(32px, 4.4vw, 56px)", margin: 0 }}>{tr.h2}</h2>
          <p style={{ fontSize: 18, color: "var(--ce-text-2)", marginTop: 18, maxWidth: 580 }}>{tr.sub}</p>
        </div>

        <div className="ce-prob-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {tr.items.map((it, i) => (
            <div key={i} className="ce-card ce-card-hover" style={{ padding: 32, display: "flex", flexDirection: "column", gap: 16, minHeight: 240 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span className="ce-stat-num" style={{ fontSize: 68, color: "var(--ce-primary)" }}>{it.stat}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: "var(--ce-muted)" }}>{it.unit}</span>
              </div>
              <p style={{ margin: 0, fontSize: 16, color: "var(--ce-text-2)", lineHeight: 1.55 }}>{it.text}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 860px) { .ce-prob-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}
