"use client"

import { useState } from "react"

export default function CTASection() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [company, setCompany] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, company, source: "cta-section" }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || "Ошибка отправки")
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || "Что-то пошло не так. Попробуйте ещё раз.")
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: "100%", padding: "14px 16px",
    border: "1px solid var(--ce-border)", borderRadius: 12,
    fontSize: 15, fontFamily: "inherit", color: "var(--ce-text)",
    background: "var(--ce-surface-2)", outline: "none",
    boxSizing: "border-box" as const,
  }

  return (
    <section id="cta" className="ce-section" style={{ background: "var(--ce-bg)", position: "relative", overflow: "hidden" }}>
      <div className="ce-wrap">
        <div className="ce-cta-grid" style={{
          background: "linear-gradient(135deg, var(--ce-primary) 0%, var(--ce-primary-deep) 100%)",
          borderRadius: 36, padding: "64px 56px",
          display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 48, alignItems: "center",
          position: "relative", overflow: "hidden", color: "#fff",
        }}>
          {/* Decorative rings */}
          <div style={{ position: "absolute", right: -120, top: -120, width: 380, height: 380, border: "1px solid rgba(255,255,255,.12)", borderRadius: "50%", pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: -60, top: -60, width: 260, height: 260, border: "1px solid rgba(255,255,255,.18)", borderRadius: "50%", pointerEvents: "none" }} />

          {/* Left */}
          <div style={{ position: "relative" }}>
            <h2 className="ce-h-display" style={{ fontSize: "clamp(28px, 3.8vw, 50px)", margin: "0 0 18px", color: "#fff" }}>Получите персональный расчёт за 15 минут</h2>
            <p style={{ fontSize: 18, color: "rgba(255,255,255,.85)", margin: 0, maxWidth: 440 }}>Покажем, сколько вы теряете и сколько сэкономите. Без презентаций и продавцов — только цифры по вашему бизнесу.</p>
            <div style={{ marginTop: 32, display: "flex", gap: 28, flexWrap: "wrap" }}>
              {[{ v: "15 мин", l: "на расчёт" }, { v: "14 дней", l: "триал бесплатно" }, { v: "2–4 мес", l: "средний ROI" }].map((s, i) => (
                <div key={i}>
                  <div className="ce-stat-num" style={{ fontSize: 24, color: "var(--ce-accent)" }}>{s.v}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,.65)", marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div style={{ background: "#fff", color: "var(--ce-text)", borderRadius: 24, padding: 28, position: "relative" }}>
            {submitted ? (
              <div style={{ padding: "40px 8px", textAlign: "center" }}>
                <span style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--ce-good-soft)", color: "var(--ce-good)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 18, fontSize: 24 }}>✓</span>
                <h3 className="ce-h-display" style={{ fontSize: 22, margin: "0 0 8px" }}>Заявка отправлена</h3>
                <p style={{ fontSize: 14.5, color: "var(--ce-text-2)", margin: 0 }}>Эмилия позвонит вам в течение 15 минут.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <input style={inputStyle} placeholder="Ваше имя" value={name} onChange={e => setName(e.target.value)} required />
                  <input style={inputStyle} placeholder="+7 (___) ___-__-__" value={phone} onChange={e => setPhone(e.target.value)} required />
                  <input style={inputStyle} placeholder="Название заведения" value={company} onChange={e => setCompany(e.target.value)} />
                  <button type="submit" className="ce-btn ce-btn-primary" disabled={loading} style={{ marginTop: 8, justifyContent: "center" }}>
                    {loading ? "Отправляем..." : "Получить расчёт →"}
                  </button>
                  {error && (
                    <p style={{ fontSize: 13, color: "#c0392b", margin: "4px 0 0", lineHeight: 1.5 }}>{error}</p>
                  )}
                  <p style={{ fontSize: 12, color: "var(--ce-muted)", margin: "4px 0 0", lineHeight: 1.55 }}>
                    Перезвоним в течение 15 минут в рабочее время. Расчёт пришлём по email.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .ce-cta-grid { grid-template-columns: 1fr !important; padding: 36px 28px !important; }
        }
      `}</style>
    </section>
  )
}
