const ITEMS = [
  { stat: "30%", unit: "звонков", text: "теряется в часы пик и нерабочее время. Клиент звонит конкуренту через 30 секунд." },
  { stat: "1 из 4", unit: "клиентов", text: "не вернётся после плохого опыта общения по телефону. Долгое ожидание, хамство, ошибки." },
  { stat: "₽0", unit: "учёта", text: "большинство заведений не считают, сколько денег теряют на пропущенных звонках. И поэтому продолжают терять." },
]

export default function ProblemsSection() {
  return (
    <section id="problems" className="ce-section" style={{ background: "var(--ce-bg)" }}>
      <div className="ce-wrap">
        <div style={{ maxWidth: 720, marginBottom: 56 }}>
          <span className="ce-eyebrow">Проблема</span>
          <h2 className="ce-h-display" style={{ fontSize: "clamp(32px, 4.4vw, 56px)", margin: 0 }}>Сколько стоит каждый пропущенный звонок</h2>
          <p style={{ fontSize: 18, color: "var(--ce-text-2)", marginTop: 18, maxWidth: 580 }}>
            Эти цифры — про ваш бизнес. Посчитайте сами в калькуляторе ниже.
          </p>
        </div>

        <div className="ce-prob-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {ITEMS.map((it, i) => (
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
