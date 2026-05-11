"use client"

import { useState } from "react"
import { t } from "@/lib/translations"

type Industry = "restaurant" | "clinic" | "auto"

const PHOTOS: Record<Industry, string> = {
  restaurant: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
  clinic: "https://images.unsplash.com/photo-1631815587646-b85a1bb027e1?auto=format&fit=crop&w=900&q=80",
  auto: "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=900&q=80",
}

const MINI_WAVEFORM_BARS = 22
const MINI_WAVEFORM_HEIGHTS = Array.from({ length: MINI_WAVEFORM_BARS }, (_, i) =>
  `${Math.min(100, 20 + Math.abs(Math.sin(i * 0.7) + Math.cos(i * 1.3)) * 40).toFixed(4)}%`
)

function MiniWaveform() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2, height: 28 }}>
      {MINI_WAVEFORM_HEIGHTS.map((h, i) => (
        <span key={i} style={{
          width: 2, height: h,
          background: i < MINI_WAVEFORM_BARS * 0.4 ? "var(--ce-primary)" : "var(--ce-border)",
          borderRadius: 2,
          animation: "ce-wave 1.1s ease-in-out infinite",
          animationDelay: `${i * 40}ms`,
        }} />
      ))}
    </div>
  )
}

export default function HeroSection({ locale }: { locale: string }) {
  const [industry, setIndustry] = useState<Industry>("restaurant")
  const tr = t(locale).hero
  const c = tr.content[industry]

  return (
    <section id="top" style={{ position: "relative", paddingTop: 48, paddingBottom: 100, overflow: "hidden", background: "var(--ce-bg)" }}>
      <div style={{ position: "absolute", top: -200, right: -160, width: 540, height: 540, background: "radial-gradient(circle, var(--ce-primary-soft) 0%, transparent 65%)", filter: "blur(20px)", opacity: 0.7, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 320, left: -180, width: 420, height: 420, background: "radial-gradient(circle, var(--ce-accent-soft) 0%, transparent 65%)", filter: "blur(20px)", opacity: 0.6, pointerEvents: "none" }} />

      <div className="ce-wrap" style={{ position: "relative" }}>
        {/* Industry switcher */}
        <div style={{ marginBottom: 36 }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ce-muted)", margin: "0 0 14px" }}>{tr.industryLabel}</p>
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" as any, maxWidth: "100%", paddingBottom: 2 }}>
            <div style={{ display: "inline-flex", padding: 4, background: "var(--ce-surface)", border: "1px solid var(--ce-border)", borderRadius: 999, gap: 4, minWidth: "min-content" }}>
              {(["restaurant", "clinic", "auto"] as Industry[]).map(id => {
                const active = industry === id
                return (
                  <button
                    key={id}
                    onClick={() => setIndustry(id)}
                    className="ce-industry-btn"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      padding: "10px 20px", borderRadius: 999, border: "none",
                      background: active ? "var(--ce-text)" : "transparent",
                      color: active ? "#fff" : "var(--ce-text-2)",
                      fontFamily: "var(--font-onest), sans-serif",
                      fontSize: 14, fontWeight: 500, cursor: "pointer",
                      transition: "all .2s ease", whiteSpace: "nowrap", flexShrink: 0,
                    }}
                  >
                    {tr.industries[id]}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Two-column grid */}
        <div className="ce-hero-grid" style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 56, alignItems: "center" }}>
          <div>
            <h1 className="ce-h-display" style={{ fontSize: "clamp(36px, 5.5vw, 72px)", margin: "0 0 24px", lineHeight: 1.05 }}>
              {c.h1}{" "}
              <span style={{ color: "var(--ce-primary)", backgroundImage: "linear-gradient(180deg, transparent 65%, var(--ce-accent-soft) 65%)", backgroundRepeat: "no-repeat" }}>{c.emph}</span>
              {c.tail ? " " + c.tail : ""}
            </h1>

            <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--ce-text-2)", maxWidth: 540, margin: "0 0 36px" }}>{c.sub}</p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="#cta" className="ce-btn ce-btn-primary">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3l1.7 4.6L18 9l-4.3 1.4L12 15l-1.7-4.6L6 9l4.3-1.4z"/><path d="M19 14l.7 1.8L21 17l-1.3.5L19 19l-.7-1.5L17 17l1.3-1.2z"/></svg>
                {tr.btnExpert}
              </a>
              <a href="#demo" className="ce-btn ce-btn-secondary">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                {tr.btnListen}
              </a>
            </div>

            <div style={{ display: "flex", gap: 36, marginTop: 52, flexWrap: "wrap" }}>
              {tr.stats.map((s, i) => (
                <div key={i}>
                  <div className="ce-stat-num" style={{ fontSize: 30 }}>{s.v}</div>
                  <div style={{ fontSize: 13, color: "var(--ce-muted)", marginTop: 4 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right visual */}
          <div className="ce-hero-visual" style={{ position: "relative", height: 560 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 28, overflow: "hidden", boxShadow: "0 30px 80px -30px rgba(26,20,16,.35)" }}>
              <img key={industry} src={PHOTOS[industry]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "opacity .4s ease" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,.35))" }} />
            </div>

            {/* Live call card */}
            <div style={{ position: "absolute", top: 24, left: 24, right: 24, background: "rgba(255,255,255,.96)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,.6)", borderRadius: 20, padding: 16, boxShadow: "0 20px 50px -20px rgba(26,20,16,.35)", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--ce-primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", animation: "ce-pulse-ring 2s infinite", flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "var(--ce-good)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--ce-good)", flexShrink: 0 }} />
                  {tr.liveLine}
                </div>
                <div style={{ fontWeight: 600, fontSize: 14.5, marginTop: 2, fontFamily: "var(--font-unbounded), sans-serif" }}>+351 912 345 678</div>
                <div style={{ fontSize: 12, color: "var(--ce-muted)" }}>{tr.duration}</div>
              </div>
              <MiniWaveform />
            </div>

            {/* Confirmation card */}
            <div style={{ position: "absolute", bottom: 28, right: 22, width: 268, background: "#fff", borderRadius: 18, padding: 16, boxShadow: "0 18px 45px -18px rgba(26,20,16,.4)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--ce-good-soft)", color: "var(--ce-good)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
                <span style={{ fontSize: 11, fontWeight: 600, color: "var(--ce-good)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{c.confirm.label}</span>
              </div>
              <div style={{ fontFamily: "var(--font-unbounded), sans-serif", fontWeight: 600, fontSize: 15 }}>{c.confirm.title}</div>
              <div style={{ fontSize: 12.5, color: "var(--ce-muted)", marginTop: 2 }}>{c.confirm.sub}</div>
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px dashed var(--ce-border)", display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--ce-muted)" }}>
                <span>{c.confirm.system}</span><span>{tr.synced}</span>
              </div>
            </div>

            {/* Stat pill */}
            <div style={{ position: "absolute", bottom: 140, left: -12, background: "var(--ce-text)", color: "#fff", borderRadius: 16, padding: "14px 18px", boxShadow: "0 14px 36px -14px rgba(26,20,16,.5)" }}>
              <div style={{ fontFamily: "var(--font-unbounded), sans-serif", fontWeight: 700, fontSize: 26, color: "var(--ce-accent)", letterSpacing: "-0.03em" }}>{c.stat}</div>
              <div style={{ fontSize: 12, opacity: 0.75 }}>{c.statLabel}</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .ce-hero-grid { grid-template-columns: 1fr !important; }
          .ce-hero-visual { display: none !important; }
        }
        @media (max-width: 520px) {
          .ce-industry-btn { padding: 9px 14px !important; font-size: 13px !important; }
        }
      `}</style>
    </section>
  )
}
