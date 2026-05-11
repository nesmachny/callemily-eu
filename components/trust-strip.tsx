const LOGOS = ["Тануки", "Шоколадница", "Якитория", "Кофемания", "СМ-Клиника", "Hyundai", "Беллиссимо", "Чайхона №1"]

export default function TrustStrip() {
  return (
    <section style={{ padding: "36px 0 28px", borderTop: "1px solid var(--ce-border)", borderBottom: "1px solid var(--ce-border)", background: "var(--ce-bg)" }}>
      <div className="ce-wrap">
        <p style={{ textAlign: "center", fontSize: 12, color: "var(--ce-muted)", margin: "0 0 24px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Нам доверяют рестораны, клиники и сети по всей России
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px 32px" }}>
          {LOGOS.map((l, i) => (
            <span key={i} style={{ fontFamily: "var(--font-unbounded), sans-serif", fontWeight: 500, fontSize: 15, color: "var(--ce-text-2)", opacity: 0.45 }}>
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
