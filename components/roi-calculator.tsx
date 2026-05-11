"use client"

import { useState, useMemo, useEffect } from "react"
import { usePathname } from "next/navigation"
import { t } from "@/lib/translations"

type Industry = "restaurant" | "clinic" | "auto"

function Slider({ label, value, min, max, step, onChange, suffix, formatNum, fmtFn }: {
  label: string; value: number; min: number; max: number; step: number
  onChange: (v: number) => void; suffix: string; formatNum?: boolean; fmtFn: (n: number) => string
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
        <span style={{ fontSize: 14, color: "var(--ce-text-2)" }}>{label}</span>
        <span style={{ fontFamily: "var(--font-unbounded), sans-serif", fontWeight: 700, fontSize: 20, color: "var(--ce-text)" }}>
          {formatNum ? fmtFn(value) : value}
          {suffix && <span style={{ fontSize: 13, color: "var(--ce-muted)", fontWeight: 500, marginLeft: 4 }}>{suffix}</span>}
        </span>
      </div>
      <input
        type="range" value={value} min={min} max={max} step={step}
        onChange={e => onChange(Number(e.target.value))}
        className="ce-slider"
        style={{
          width: "100%", height: 6, borderRadius: 3, outline: "none", cursor: "pointer",
          background: `linear-gradient(90deg, var(--ce-primary) 0%, var(--ce-primary) ${pct}%, var(--ce-border) ${pct}%, var(--ce-border) 100%)`,
        }}
      />
    </div>
  )
}

export default function ROICalculator({ industry = "restaurant" }: { industry?: Industry }) {
  const pathname = usePathname()
  const locale = pathname.split("/")[1] || "en"
  const tr = t(locale).roi
  const preset = tr.presets[industry] ?? tr.presets.restaurant

  const fmtNum = (n: number) => new Intl.NumberFormat(tr.locale).format(n)

  const [calls, setCalls] = useState<number>(preset.calls)
  const [check, setCheck] = useState<number>(preset.check)
  const [conv, setConv] = useState<number>(preset.conv)

  useEffect(() => {
    setCalls(preset.calls)
    setCheck(preset.check)
    setConv(preset.conv)
  }, [industry, locale])

  const result = useMemo(() => {
    const missedDay = Math.round(calls * preset.missedRate / 100)
    const lostMonth = Math.round(missedDay * 30 * (conv / 100))
    const lostRevenue = Math.round(lostMonth * check * preset.seats)
    const recovered = Math.round(lostRevenue * 0.85)
    return { missedDay, lostMonth, lostRevenue, recovered }
  }, [calls, check, conv, industry, locale])

  return (
    <section id="roi" className="ce-section" style={{ background: "var(--ce-surface)", borderTop: "1px solid var(--ce-border)", borderBottom: "1px solid var(--ce-border)" }}>
      <div className="ce-wrap">
        <div style={{ maxWidth: 720, marginBottom: 48 }}>
          <span className="ce-eyebrow">{tr.eyebrow}</span>
          <h2 className="ce-h-display" style={{ fontSize: "clamp(32px, 4.4vw, 56px)", margin: 0 }}>
            {tr.h2Part1} <span style={{ color: "var(--ce-primary)" }}>{tr.h2Part2}</span>
          </h2>
          <p style={{ fontSize: 18, color: "var(--ce-text-2)", marginTop: 18, maxWidth: 580 }}>{tr.sub}</p>
        </div>

        <div className="ce-roi-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Inputs */}
          <div className="ce-card" style={{ padding: 32, display: "flex", flexDirection: "column", gap: 28 }}>
            <div style={{ fontSize: 12, color: "var(--ce-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {/* "Parameters · Restaurant" */}
              {locale === "pt" ? "Parâmetros" : "Parameters"} · {preset.label}
            </div>
            <Slider label={preset.callsLabel} value={calls} min={10} max={500} step={5} onChange={setCalls} suffix="" fmtFn={fmtNum} />
            <Slider label={preset.checkLabel} value={check} min={10} max={preset.maxCheck} step={preset.stepCheck} onChange={setCheck} suffix={tr.currency} formatNum fmtFn={fmtNum} />
            <Slider label={preset.convLabel} value={conv} min={5} max={95} step={1} onChange={setConv} suffix="%" fmtFn={fmtNum} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, paddingTop: 16, borderTop: "1px dashed var(--ce-border)" }}>
              <div>
                <div style={{ fontSize: 12, color: "var(--ce-muted)" }}>{tr.missedDay}</div>
                <div style={{ fontFamily: "var(--font-unbounded), sans-serif", fontWeight: 700, fontSize: 28, color: "var(--ce-text)", marginTop: 4 }}>~{result.missedDay}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "var(--ce-muted)" }}>{tr.lostMonth.replace("{unit}", preset.lostUnit)}</div>
                <div style={{ fontFamily: "var(--font-unbounded), sans-serif", fontWeight: 700, fontSize: 28, color: "var(--ce-text)", marginTop: 4 }}>~{result.lostMonth}</div>
              </div>
            </div>
          </div>

          {/* Result */}
          <div style={{
            background: "var(--ce-text)", borderRadius: 24, padding: 32,
            position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", gap: 24,
          }}>
            <div style={{ position: "absolute", top: -100, right: -100, width: 360, height: 360, background: "radial-gradient(circle, rgba(232,93,44,.32) 0%, transparent 65%)", pointerEvents: "none" }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {tr.lostRevenue.replace("{valueLabel}", preset.valueLabel)}
              </div>
              <div style={{ fontFamily: "var(--font-unbounded), sans-serif", fontWeight: 700, fontSize: "clamp(24px, 7.5vw, 68px)", color: "var(--ce-accent)", marginTop: 10, lineHeight: 1.1, wordBreak: "keep-all" }}>
                {tr.currency}{fmtNum(result.lostRevenue)}
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 18, padding: 22, position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
                <span style={{ fontFamily: "var(--font-unbounded), sans-serif", fontWeight: 700, fontSize: "clamp(18px, 5vw, 26px)", color: "var(--ce-accent)", whiteSpace: "nowrap" }}>+{tr.currency}{fmtNum(result.recovered)}</span>
                <span style={{ fontSize: 13.5, color: "rgba(255,255,255,.7)" }}>{tr.recoveredLabel}</span>
              </div>
              <div style={{ height: 8, background: "rgba(255,255,255,.08)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: "85%", height: "100%", background: "linear-gradient(90deg, var(--ce-accent), #f5d76e)", borderRadius: 4 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12, color: "rgba(255,255,255,.5)" }}>
                <span>{tr.recoveryNote}</span>
                <span>{tr.recoveryNoteSub}</span>
              </div>
            </div>

            <div style={{ position: "relative", zIndex: 1 }}>
              <a href="#cta" style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "14px 24px", background: "var(--ce-accent)", color: "var(--ce-text)",
                borderRadius: 12, fontFamily: "var(--font-onest), sans-serif",
                fontWeight: 600, fontSize: 15, textDecoration: "none",
                boxShadow: "0 10px 26px -8px rgba(245,200,66,.5)",
              }}>
                {tr.btnCta}
              </a>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,.4)", textAlign: "center", margin: "12px 0 0", lineHeight: 1.5 }}>
                {tr.ctaNote}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) { .ce-roi-grid { grid-template-columns: 1fr !important; } }
        .ce-slider { appearance: none; -webkit-appearance: none; }
        .ce-slider::-webkit-slider-thumb {
          -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%;
          background: #fff; border: 2px solid var(--ce-primary);
          box-shadow: 0 2px 8px rgba(0,0,0,.15); cursor: pointer;
        }
        .ce-slider::-moz-range-thumb {
          width: 20px; height: 20px; border-radius: 50%;
          background: #fff; border: 2px solid var(--ce-primary);
          box-shadow: 0 2px 8px rgba(0,0,0,.15); cursor: pointer;
        }
      `}</style>
    </section>
  )
}
