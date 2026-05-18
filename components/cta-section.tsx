"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { t } from "@/lib/translations"

export default function CTASection() {
  const pathname = usePathname()
  const locale = pathname.split("/")[1] || "en"
  const tr = t(locale).cta

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [company, setCompany] = useState("")

  const handlePhoneChange = (raw: string) => {
    let cleaned = raw.replace(/[^\d+\s()-]/g, "")
    cleaned = cleaned.replace(/(?!^)\+/g, "")
    const digits = cleaned.replace(/\D/g, "")
    if (digits.length > 15) {
      let kept = 0
      cleaned = Array.from(cleaned).filter(ch => {
        if (/\d/.test(ch)) { if (kept >= 15) return false; kept++; return true }
        return true
      }).join("")
    }
    setPhone(cleaned)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const digits = phone.replace(/\D/g, "")
    if (digits.length < 7 || digits.length > 15) {
      setError(tr.errorPhoneInvalid)
      return
    }
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, company, source: "cta-section" }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || tr.errorDefault)
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || tr.errorDefault)
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
          <div style={{ position: "absolute", right: -120, top: -120, width: 380, height: 380, border: "1px solid rgba(255,255,255,.12)", borderRadius: "50%", pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: -60, top: -60, width: 260, height: 260, border: "1px solid rgba(255,255,255,.18)", borderRadius: "50%", pointerEvents: "none" }} />

          <div style={{ position: "relative" }}>
            <h2 className="ce-h-display" style={{ fontSize: "clamp(28px, 3.8vw, 50px)", margin: "0 0 18px", color: "#fff" }}>{tr.h2}</h2>
            <p style={{ fontSize: 18, color: "rgba(255,255,255,.85)", margin: 0, maxWidth: 440 }}>{tr.sub}</p>
            <div style={{ marginTop: 32, display: "flex", gap: 28, flexWrap: "wrap" }}>
              {tr.stats.map((s, i) => (
                <div key={i}>
                  <div className="ce-stat-num" style={{ fontSize: 24, color: "var(--ce-accent)" }}>{s.v}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,.65)", marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "#fff", color: "var(--ce-text)", borderRadius: 24, padding: 28, position: "relative" }}>
            {submitted ? (
              <div style={{ padding: "40px 8px", textAlign: "center" }}>
                <span style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--ce-good-soft)", color: "var(--ce-good)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 18, fontSize: 24 }}>✓</span>
                <h3 className="ce-h-display" style={{ fontSize: 22, margin: "0 0 8px" }}>{tr.successTitle}</h3>
                <p style={{ fontSize: 14.5, color: "var(--ce-text-2)", margin: 0 }}>{tr.successSub}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <input style={inputStyle} placeholder={tr.namePlaceholder} value={name} onChange={e => setName(e.target.value)} required />
                  <input style={inputStyle} type="tel" inputMode="tel" autoComplete="tel" maxLength={20} placeholder={tr.phonePlaceholder} value={phone} onChange={e => handlePhoneChange(e.target.value)} required />
                  <input style={inputStyle} placeholder={tr.companyPlaceholder} value={company} onChange={e => setCompany(e.target.value)} />
                  <button type="submit" className="ce-btn ce-btn-primary" disabled={loading} style={{ marginTop: 8, justifyContent: "center" }}>
                    {loading ? tr.btnLoading : tr.btnSubmit}
                  </button>
                  {error && <p style={{ fontSize: 13, color: "#c0392b", margin: "4px 0 0", lineHeight: 1.5 }}>{error}</p>}
                  <p style={{ fontSize: 12, color: "var(--ce-muted)", margin: "4px 0 0", lineHeight: 1.55 }}>{tr.note}</p>
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
