const STEPS = [
  { n: "01", title: "Гость звонит", text: "На ваш обычный номер. Эмилия берёт трубку с первого гудка — днём, ночью, в Новый год." },
  { n: "02", title: "Эмилия слушает", text: "Понимает, что нужно: забронировать, узнать часы работы, спросить про детское меню." },
  { n: "03", title: "Проверяет систему", text: "Свободные столики в iiko, актуальное меню, депозиты на праздники — в реальном времени." },
  { n: "04", title: "Подтверждает гостю", text: "Озвучивает детали, отправляет SMS с подтверждением. Вы видите бронь в админке." },
]

export default function HowItWorksSection() {
  return (
    <section id="how" className="ce-section" style={{ background: "var(--ce-bg)" }}>
      <div className="ce-wrap">
        <div style={{ maxWidth: 720, marginBottom: 56 }}>
          <span className="ce-eyebrow">Процесс</span>
          <h2 className="ce-h-display" style={{ fontSize: "clamp(32px, 4.4vw, 56px)", margin: 0 }}>Как это работает</h2>
          <p style={{ fontSize: 18, color: "var(--ce-text-2)", marginTop: 18, maxWidth: 580 }}>
            От первого звонка до брони в системе — меньше минуты. Без вашего участия.
          </p>
        </div>

        <div style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }} className="ce-steps-grid">
          {/* Connector line */}
          <div className="ce-steps-line" style={{
            position: "absolute", top: 38, left: "6%", right: "6%", height: 1,
            background: "repeating-linear-gradient(90deg, var(--ce-border-strong) 0 6px, transparent 6px 12px)",
            zIndex: 0,
          }} />

          {STEPS.map((s, i) => (
            <div key={i} style={{ position: "relative", zIndex: 1 }}>
              <div style={{
                width: 76, height: 76, borderRadius: 24, background: "var(--ce-bg)",
                border: "1px solid var(--ce-border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-unbounded), sans-serif", fontWeight: 600, fontSize: 20,
                color: "var(--ce-primary)", marginBottom: 20,
                boxShadow: "0 8px 22px -10px rgba(26,20,16,.18)",
              }}>{s.n}</div>
              <h3 className="ce-h-display" style={{ fontSize: 20, margin: "0 0 10px", lineHeight: 1.2 }}>{s.title}</h3>
              <p style={{ fontSize: 15, color: "var(--ce-text-2)", margin: 0, lineHeight: 1.55 }}>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .ce-steps-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
          .ce-steps-line { display: none; }
        }
      `}</style>
    </section>
  )
}
