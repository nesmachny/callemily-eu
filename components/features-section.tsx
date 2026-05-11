import { t } from "@/lib/translations"

export default function FeaturesSection({ locale }: { locale: string }) {
  const tr = t(locale).features
  return (
    <section id="features" className="ce-section" style={{ background: "var(--ce-bg-alt)" }}>
      <div className="ce-wrap">
        <div className="ce-feat-head" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "end", marginBottom: 56 }}>
          <div>
            <span className="ce-eyebrow">{tr.eyebrow}</span>
            <h2 className="ce-h-display" style={{ fontSize: "clamp(32px, 4.4vw, 56px)", margin: 0 }}>{tr.h2}</h2>
          </div>
          <p style={{ fontSize: 18, color: "var(--ce-text-2)", margin: 0 }}>{tr.sub}</p>
        </div>

        <div className="ce-feat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {tr.items.map((f, i) => (
            <div key={i} className="ce-card ce-card-hover" style={{
              padding: 28, display: "flex", flexDirection: "column", gap: 14, minHeight: 220,
              background: i === 0 ? "var(--ce-text)" : "var(--ce-surface)",
              color: i === 0 ? "#fff" : "var(--ce-text)",
              borderColor: i === 0 ? "var(--ce-text)" : "var(--ce-border)",
            }}>
              <span className={i === 0 ? "ce-chip" : "ce-chip ce-chip-primary"} style={
                i === 0 ? { background: "rgba(255,255,255,.12)", borderColor: "rgba(255,255,255,.2)", color: "rgba(255,255,255,.85)" } : {}
              }>{f.tag}</span>
              <h3 className="ce-h-display" style={{ fontSize: 22, margin: 0, lineHeight: 1.2, color: i === 0 ? "#fff" : "var(--ce-text)" }}>{f.title}</h3>
              <p style={{ fontSize: 15, color: i === 0 ? "rgba(255,255,255,.75)" : "var(--ce-text-2)", margin: 0, lineHeight: 1.55 }}>{f.text}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .ce-feat-head { grid-template-columns: 1fr !important; }
          .ce-feat-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 901px) and (max-width: 1100px) {
          .ce-feat-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  )
}
