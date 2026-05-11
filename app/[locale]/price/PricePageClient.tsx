"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Header from "@/components/header"
import type { MenuItem } from "@/lib/menu"
import Footer from "@/components/footer"
import FaqSchema from "@/components/faq-schema"
import ROICalculator from "@/components/roi-calculator"
import { t } from "@/lib/translations"

// ── Modal form ───────────────────────────────────────────────────────────────

function LeadModal({ onClose, locale }: { onClose: () => void; locale: string }) {
  const tr = t(locale).price
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [consent, setConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!consent) { setError(tr.modalConsentError); return }
    setError(""); setLoading(true)
    try {
      const res = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, source: "price-page" }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || tr.modalErrorDefault)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || tr.modalErrorDefault)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(26,20,16,.65)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", padding: 16 }}
      onClick={onClose}
    >
      <div
        style={{ background: "#fff", borderRadius: 24, padding: "40px 36px", maxWidth: 440, width: "100%", position: "relative", boxShadow: "0 40px 80px -20px rgba(26,20,16,.45)", animation: "ce-modal-in .2s ease" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", cursor: "pointer", color: "var(--ce-muted)", padding: 6, borderRadius: 8, lineHeight: 1, fontSize: 18 }}
          aria-label={tr.closeLabel}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        {success ? (
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "var(--ce-good-soft)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--ce-good)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3 style={{ fontFamily: "var(--font-unbounded), sans-serif", fontWeight: 700, fontSize: 20, color: "var(--ce-text)", margin: "0 0 10px" }}>{tr.modalSuccessTitle}</h3>
            <p style={{ fontSize: 15, color: "var(--ce-text-2)", lineHeight: 1.6, margin: "0 0 28px" }}>
              {tr.modalSuccessSub} <strong>{email}</strong> {tr.modalSuccessSubAfter}
            </p>
            <button onClick={onClose} className="ce-btn ce-btn-primary" style={{ width: "100%" }}>
              {tr.modalSuccessBtn}
            </button>
          </div>
        ) : (
          <>
            <h3 style={{ fontFamily: "var(--font-unbounded), sans-serif", fontWeight: 700, fontSize: 21, color: "var(--ce-text)", margin: "0 0 6px", paddingRight: 28 }}>
              {tr.modalTitle}
            </h3>
            <p style={{ fontSize: 14, color: "var(--ce-text-2)", margin: "0 0 28px", lineHeight: 1.55 }}>
              {tr.modalSub}
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Name */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--ce-text-2)", marginBottom: 6 }}>
                  {tr.modalNameLabel} <span style={{ color: "var(--ce-primary)" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder={tr.modalNamePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ width: "100%", boxSizing: "border-box", padding: "12px 16px", borderRadius: 12, border: "1.5px solid var(--ce-border)", fontFamily: "var(--font-onest), sans-serif", fontSize: 15, color: "var(--ce-text)", background: "var(--ce-bg)", outline: "none", transition: "border-color .15s" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--ce-primary)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--ce-border)")}
                />
              </div>

              {/* Email */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--ce-text-2)", marginBottom: 6 }}>
                  Email <span style={{ color: "var(--ce-primary)" }}>*</span>
                </label>
                <input
                  type="email"
                  placeholder="john@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ width: "100%", boxSizing: "border-box", padding: "12px 16px", borderRadius: 12, border: "1.5px solid var(--ce-border)", fontFamily: "var(--font-onest), sans-serif", fontSize: 15, color: "var(--ce-text)", background: "var(--ce-bg)", outline: "none", transition: "border-color .15s" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--ce-primary)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--ce-border)")}
                />
              </div>

              {/* GDPR Consent */}
              <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                <div style={{ position: "relative", flexShrink: 0, marginTop: 1 }}>
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => { setConsent(e.target.checked); if (e.target.checked) setError("") }}
                    style={{ width: 18, height: 18, accentColor: "var(--ce-primary)", cursor: "pointer" }}
                  />
                </div>
                <span style={{ fontSize: 12.5, color: "var(--ce-text-2)", lineHeight: 1.5 }}>
                  {tr.modalConsentText}{" "}
                  <a href={tr.modalConsentHref} target="_blank" rel="noopener" style={{ color: "var(--ce-primary)", textDecoration: "none" }}>
                    {tr.modalConsentLink}
                  </a>
                </span>
              </label>

              {error && (
                <p style={{ fontSize: 13, color: "var(--ce-primary)", margin: 0, padding: "8px 12px", background: "var(--ce-primary-soft)", borderRadius: 8 }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="ce-btn ce-btn-primary"
                style={{ width: "100%", justifyContent: "center", marginTop: 4, opacity: loading ? 0.7 : 1 }}
              >
                {loading ? tr.modalLoading : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.7 4.6L18 9l-4.3 1.4L12 15l-1.7-4.6L6 9l4.3-1.4z"/></svg>
                    {tr.modalSubmit}
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>

      <style>{`@keyframes ce-modal-in { from { opacity: 0; transform: scale(.96) translateY(8px) } to { opacity: 1; transform: none } }`}</style>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function PricePageClient({ navItems }: { navItems?: MenuItem[] }) {
  const pathname = usePathname()
  const locale = pathname.split("/")[1] || "en"
  const tr = t(locale).price
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [modal, setModal] = useState(false)

  const faqItems = [...tr.faq]
  const valueStrip = [...tr.valueStrip]
  const steps = [...tr.steps]

  return (
    <div style={{ background: "var(--ce-bg)", minHeight: "100vh" }}>
      <FaqSchema items={faqItems.map(f => ({ question: f.q, answer: f.a }))} />

      <Header navItems={navItems} />

      {modal && <LeadModal onClose={() => setModal(false)} locale={locale} />}

      {/* Hero */}
      <section style={{ paddingTop: 80, paddingBottom: 72, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -160, right: -100, width: 440, height: 440, background: "radial-gradient(circle, var(--ce-primary-soft) 0%, transparent 65%)", filter: "blur(20px)", opacity: 0.7, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, left: -120, width: 360, height: 360, background: "radial-gradient(circle, var(--ce-accent-soft) 0%, transparent 65%)", filter: "blur(20px)", opacity: 0.5, pointerEvents: "none" }} />
        <div className="ce-wrap" style={{ position: "relative" }}>
          <div className="ce-eyebrow" style={{ marginBottom: 20 }}>{tr.heroEyebrow}</div>
          <h1 className="ce-h-display" style={{ fontSize: "clamp(32px, 5vw, 60px)", margin: "0 auto 20px", maxWidth: 700 }}>
            {tr.heroH1}<br />
            <span style={{ color: "var(--ce-primary)" }}>{tr.heroH1Emph}</span>
          </h1>
          <p style={{ fontSize: 18, color: "var(--ce-text-2)", maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.6 }}>
            {tr.heroSub}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#calculator" className="ce-btn ce-btn-primary">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              {tr.heroBtnCalc}
            </a>
            <button onClick={() => setModal(true)} className="ce-btn ce-btn-secondary">
              {tr.heroBtnExpert}
            </button>
          </div>
        </div>
      </section>

      {/* Value props strip */}
      <section style={{ background: "var(--ce-surface)", borderTop: "1px solid var(--ce-border)", borderBottom: "1px solid var(--ce-border)", paddingTop: 32, paddingBottom: 32 }}>
        <div className="ce-wrap">
          <div className="ce-value-strip" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
            {([
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--ce-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><circle cx="8" cy="6" r="2" fill="var(--ce-primary-soft)" stroke="var(--ce-primary)"/><line x1="4" y1="12" x2="20" y2="12"/><circle cx="16" cy="12" r="2" fill="var(--ce-primary-soft)" stroke="var(--ce-primary)"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="10" cy="18" r="2" fill="var(--ce-primary-soft)" stroke="var(--ce-primary)"/></svg> },
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--ce-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> },
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--ce-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><path d="M2 20h20"/></svg> },
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--ce-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l7 3v5c0 4.5-3 8.5-7 10C8 18.5 5 14.5 5 10V5l7-3z"/><polyline points="9 12 11 14 15 10"/></svg> },
            ] as { icon: React.ReactNode }[]).map((v, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--ce-primary-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {v.icon}
                  </div>
                </div>
                <div style={{ fontFamily: "var(--font-unbounded), sans-serif", fontWeight: 600, fontSize: 13, color: "var(--ce-text)", marginBottom: 4 }}>{valueStrip[i].title}</div>
                <div style={{ fontSize: 12.5, color: "var(--ce-muted)", lineHeight: 1.4 }}>{valueStrip[i].sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <div id="calculator">
        <ROICalculator />
      </div>

      {/* How pricing works */}
      <section style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div className="ce-wrap">
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div className="ce-eyebrow" style={{ marginBottom: 12 }}>{tr.stepsEyebrow}</div>
            <h2 className="ce-h-display" style={{ fontSize: "clamp(26px, 4vw, 44px)", margin: "0 0 16px" }}>{tr.stepsH2}</h2>
            <p style={{ fontSize: 16, color: "var(--ce-text-2)", maxWidth: 480, margin: "0 auto" }}>{tr.stepsSub}</p>
          </div>
          <div className="ce-steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28, maxWidth: 860, margin: "0 auto" }}>
            {steps.map((s, i) => (
              <div key={i} style={{ background: "var(--ce-surface)", border: "1px solid var(--ce-border)", borderRadius: 20, padding: 28 }}>
                <div style={{ fontFamily: "var(--font-unbounded), sans-serif", fontWeight: 700, fontSize: 32, color: "var(--ce-primary)", opacity: 0.35, marginBottom: 16, letterSpacing: "-0.03em" }}>{s.num}</div>
                <div style={{ fontFamily: "var(--font-unbounded), sans-serif", fontWeight: 600, fontSize: 15, color: "var(--ce-text)", marginBottom: 10 }}>{s.title}</div>
                <div style={{ fontSize: 14, color: "var(--ce-text-2)", lineHeight: 1.6 }}>{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ paddingTop: 72, paddingBottom: 72, background: "var(--ce-surface)", borderTop: "1px solid var(--ce-border)" }}>
        <div className="ce-wrap">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="ce-eyebrow" style={{ marginBottom: 12 }}>{tr.faqTitle}</div>
            <h2 className="ce-h-display" style={{ fontSize: "clamp(26px, 4vw, 42px)", margin: 0 }}>{tr.faqH2}</h2>
          </div>
          <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 2 }}>
            {faqItems.map((item, i) => {
              const open = openFaq === i
              return (
                <div key={i} style={{ background: "#fff", border: "1px solid var(--ce-border)", borderRadius: 16, overflow: "hidden" }}>
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, padding: "20px 24px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                  >
                    <span style={{ fontFamily: "var(--font-onest), sans-serif", fontWeight: 600, fontSize: 15, color: "var(--ce-text)" }}>{item.q}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ce-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }}><polyline points="6 9 12 15 18 9" /></svg>
                  </button>
                  {open && (
                    <div style={{ padding: "0 24px 20px", fontSize: 14.5, color: "var(--ce-text-2)", lineHeight: 1.65 }}>{item.a}</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" style={{ background: "var(--ce-text)", paddingTop: 80, paddingBottom: 80 }}>
        <div className="ce-wrap" style={{ textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.1)", borderRadius: 999, padding: "6px 18px", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.65)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 24 }}>
            {tr.ctaBadge}
          </div>
          <h2 style={{ fontFamily: "var(--font-unbounded), sans-serif", fontWeight: 700, fontSize: "clamp(26px, 4vw, 44px)", color: "#fff", margin: "0 auto 16px", maxWidth: 600, lineHeight: 1.15 }}>
            {tr.ctaH2}
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,.65)", maxWidth: 480, margin: "0 auto 40px", lineHeight: 1.6 }}>
            {tr.ctaSub}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => setModal(true)}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 30px", background: "var(--ce-primary)", color: "#fff", borderRadius: 12, fontFamily: "var(--font-onest), sans-serif", fontWeight: 600, fontSize: 15, border: "none", cursor: "pointer" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.7 4.6L18 9l-4.3 1.4L12 15l-1.7-4.6L6 9l4.3-1.4z"/></svg>
              {tr.ctaBtn}
            </button>
            <a href={tr.ctaPhoneHref} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 30px", background: "rgba(255,255,255,.1)", color: "#fff", borderRadius: 12, fontFamily: "var(--font-onest), sans-serif", fontWeight: 600, fontSize: 15, textDecoration: "none", border: "1px solid rgba(255,255,255,.2)" }}>
              {tr.ctaPhone}
            </a>
          </div>
          <p style={{ marginTop: 24, fontSize: 13, color: "rgba(255,255,255,.35)" }}>{tr.ctaNote}</p>
        </div>
      </section>

      <Footer locale={locale} />

      <style>{`
        @media (max-width: 900px) {
          .ce-value-strip { grid-template-columns: repeat(2, 1fr) !important; }
          .ce-steps-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .ce-value-strip { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  )
}
