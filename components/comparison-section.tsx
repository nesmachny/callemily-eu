const COLS = ["Эмилия", "Администратор", "Колл-центр"]
const ROWS = [
  { metric: "Доступность 24/7",         values: ["always",      "no",           "limited"] },
  { metric: "Время ответа",             values: ["1 сек",       "30–120 сек",   "60–300 сек"] },
  { metric: "Параллельные звонки",      values: ["∞",           "1",            "10–20"] },
  { metric: "Многоязычность",           values: ["12 языков",   "1–2",          "1–2"] },
  { metric: "Знание меню / услуг",      values: ["always",      "limited",      "no"] },
  { metric: "Интеграция с CRM",         values: ["always",      "limited",      "limited"] },
  { metric: "Транскрипты звонков",      values: ["always",      "no",           "limited"] },
  { metric: "Не болеет, не увольняется", values: ["always",     "no",           "limited"] },
]

function Cell({ v }: { v: string }) {
  if (v === "always") return <span style={{ color: "var(--ce-good)" }}>✓</span>
  if (v === "no") return <span style={{ color: "var(--ce-muted)", opacity: 0.5 }}>✗</span>
  if (v === "limited") return <span style={{ color: "var(--ce-warn)", fontSize: 13, fontWeight: 600 }}>частично</span>
  return <span>{v}</span>
}

export default function ComparisonSection() {
  return (
    <section className="ce-section" style={{ background: "var(--ce-bg)" }}>
      <div className="ce-wrap">
        <div style={{ maxWidth: 720, marginBottom: 48 }}>
          <span className="ce-eyebrow">Сравнение</span>
          <h2 className="ce-h-display" style={{ fontSize: "clamp(32px, 4.4vw, 56px)", margin: 0 }}>А почему не администратор или колл-центр?</h2>
          <p style={{ fontSize: 18, color: "var(--ce-text-2)", marginTop: 18 }}>Сравнили честно. Без маркетинговых натяжек.</p>
        </div>

        <div className="ce-card" style={{ padding: 0 }}>
          <div style={{ overflowX: "auto", overflowY: "hidden", WebkitOverflowScrolling: "touch" as any, borderRadius: 24 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 620 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--ce-border)" }}>
                  <th style={{ textAlign: "left", padding: "20px 28px", fontWeight: 500, fontSize: 13, color: "var(--ce-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }} />
                  {COLS.map((c, i) => (
                    <th key={i} style={{ padding: "20px 24px", textAlign: "left", background: i === 0 ? "var(--ce-text)" : "transparent", color: i === 0 ? "#fff" : "var(--ce-text)" }}>
                      <div style={{ fontFamily: "var(--font-unbounded), sans-serif", fontWeight: 600, fontSize: 17, letterSpacing: "-0.01em" }}>{c}</div>
                      {i === 0 && <div style={{ fontSize: 12, color: "var(--ce-accent)", marginTop: 4 }}>Рекомендуем</div>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, ri) => (
                  <tr key={ri} style={{ borderBottom: ri < ROWS.length - 1 ? "1px solid var(--ce-border)" : "none" }}>
                    <td style={{ padding: "18px 28px", fontSize: 15, fontWeight: 500, color: "var(--ce-text-2)" }}>{row.metric}</td>
                    {row.values.map((v, vi) => (
                      <td key={vi} style={{ padding: "18px 24px", fontSize: 15, background: vi === 0 ? "rgba(232,93,44,.04)" : "transparent", fontWeight: vi === 0 ? 600 : 400, color: vi === 0 ? "var(--ce-text)" : "var(--ce-text-2)" }}>
                        <Cell v={v} />
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
