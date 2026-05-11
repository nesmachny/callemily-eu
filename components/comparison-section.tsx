import { t } from "@/lib/translations"

function Cell({ v, partial }: { v: string; partial: string }) {
  if (v === "always") return <span style={{ color: "var(--ce-good)" }}>✓</span>
  if (v === "no") return <span style={{ color: "var(--ce-muted)", opacity: 0.5 }}>✗</span>
  if (v === "limited") return <span style={{ color: "var(--ce-warn)", fontSize: 13, fontWeight: 600 }}>{partial}</span>
  return <span>{v}</span>
}

export default function ComparisonSection({ locale }: { locale: string }) {
  const tr = t(locale).comparison
  return (
    <section className="ce-section" style={{ background: "var(--ce-bg)" }}>
      <div className="ce-wrap">
        <div style={{ maxWidth: 720, marginBottom: 48 }}>
          <span className="ce-eyebrow">{tr.eyebrow}</span>
          <h2 className="ce-h-display" style={{ fontSize: "clamp(32px, 4.4vw, 56px)", margin: 0 }}>{tr.h2}</h2>
          <p style={{ fontSize: 18, color: "var(--ce-text-2)", marginTop: 18 }}>{tr.sub}</p>
        </div>

        <div className="ce-card" style={{ padding: 0 }}>
          <div style={{ overflowX: "auto", overflowY: "hidden", WebkitOverflowScrolling: "touch" as any, borderRadius: 24 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 620 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--ce-border)" }}>
                  <th style={{ textAlign: "left", padding: "20px 28px", fontWeight: 500, fontSize: 13, color: "var(--ce-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }} />
                  {tr.cols.map((c, i) => (
                    <th key={i} style={{ padding: "20px 24px", textAlign: "left", background: i === 0 ? "var(--ce-text)" : "transparent", color: i === 0 ? "#fff" : "var(--ce-text)" }}>
                      <div style={{ fontFamily: "var(--font-unbounded), sans-serif", fontWeight: 600, fontSize: 17, letterSpacing: "-0.01em" }}>{c}</div>
                      {i === 0 && <div style={{ fontSize: 12, color: "var(--ce-accent)", marginTop: 4 }}>{tr.recommended}</div>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tr.rows.map((row, ri) => (
                  <tr key={ri} style={{ borderBottom: ri < tr.rows.length - 1 ? "1px solid var(--ce-border)" : "none" }}>
                    <td style={{ padding: "18px 28px", fontSize: 15, fontWeight: 500, color: "var(--ce-text-2)" }}>{row.metric}</td>
                    {row.values.map((v, vi) => (
                      <td key={vi} style={{ padding: "18px 24px", fontSize: 15, background: vi === 0 ? "rgba(232,93,44,.04)" : "transparent", fontWeight: vi === 0 ? 600 : 400, color: vi === 0 ? "var(--ce-text)" : "var(--ce-text-2)" }}>
                        <Cell v={v} partial={tr.partial} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
