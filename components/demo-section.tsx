"use client"

import { useState, useEffect, useRef } from "react"
import { t } from "@/lib/translations"

type Industry = "restaurant" | "clinic" | "auto"

const ICONS: Record<Industry, React.ReactNode> = {
  restaurant: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7c0 1.66 1.34 3 3 3s3-1.34 3-3V2"/><line x1="6" y1="13" x2="6" y2="22"/><line x1="15" y1="2" x2="15" y2="22"/>
    </svg>
  ),
  clinic: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  ),
  auto: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 11l2-5h10l2 5"/><rect x="2" y="11" width="20" height="7" rx="1"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>
    </svg>
  ),
}

const WAVEFORM_BARS = 52
const WAVEFORM_HEIGHTS = Array.from({ length: WAVEFORM_BARS }, (_, i) =>
  `${Math.min(100, 22 + Math.abs(Math.sin(i * 0.55) + Math.cos(i * 1.7)) * 48).toFixed(4)}%`
)

const toSec = (ts: string) => { const [m, s] = ts.split(":").map(Number); return m * 60 + s }
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`

function ProgressWaveform({ progress, playing }: { progress: number; playing: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2, height: 40 }}>
      {WAVEFORM_HEIGHTS.map((h, i) => {
        const played = i / WAVEFORM_BARS < progress
        const isEdge = playing && Math.abs(i / WAVEFORM_BARS - progress) < 0.04
        return (
          <span
            key={i}
            style={{
              flex: 1,
              height: isEdge ? "100%" : h,
              background: played ? "var(--ce-accent)" : "rgba(255,255,255,.18)",
              borderRadius: 2,
              transition: "background .15s, height .1s",
            }}
          />
        )
      })}
    </div>
  )
}

export default function DemoSection({ locale }: { locale: string }) {
  const tr = t(locale).demo
  const [industry, setIndustry] = useState<Industry>("restaurant")
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const demo = tr.industries[industry]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    audio.src = demo.audioFile
    audio.load()
    setPlaying(false)
    setTime(0)
    if (containerRef.current) containerRef.current.scrollTop = 0
  }, [industry, demo.audioFile])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTimeUpdate = () => setTime(audio.currentTime)
    const onEnded = () => { setPlaying(false); setTime(demo.total) }
    audio.addEventListener("timeupdate", onTimeUpdate)
    audio.addEventListener("ended", onEnded)
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate)
      audio.removeEventListener("ended", onEnded)
    }
  }, [demo.total])

  const transcript = [...demo.transcript]
  const activeIdx = transcript.reduce((acc, line, i) => (toSec(line.t) <= time ? i : acc), -1)

  useEffect(() => {
    if (!containerRef.current || activeIdx < 0) return
    const el = containerRef.current.querySelector(`[data-line="${activeIdx}"]`) as HTMLElement | null
    if (el) {
      const top = el.offsetTop - containerRef.current.offsetTop - 40
      containerRef.current.scrollTo({ top, behavior: "smooth" })
    }
  }, [activeIdx])

  const handlePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      if (time >= demo.total) { audio.currentTime = 0; setTime(0) }
      audio.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    audio.currentTime = ratio * demo.total
    setTime(audio.currentTime)
  }

  return (
    <section id="demo" className="ce-section" style={{ background: "var(--ce-text)", color: "#fff", position: "relative", overflow: "hidden" }}>
      <audio ref={audioRef} preload="none" />

      <div style={{ position: "absolute", top: "-10%", right: "-15%", width: 600, height: 600, background: "radial-gradient(circle, rgba(232,93,44,.25) 0%, transparent 65%)", pointerEvents: "none" }} />

      <div className="ce-wrap" style={{ position: "relative" }}>
        {/* Header */}
        <div style={{ maxWidth: 720, marginBottom: 40 }}>
          <span className="ce-eyebrow" style={{ color: "var(--ce-accent)" }}>{tr.eyebrow}</span>
          <h2 className="ce-h-display" style={{ fontSize: "clamp(32px, 4.4vw, 56px)", margin: 0, color: "#fff" }}>{tr.h2}</h2>
        </div>

        {/* Industry tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
          {(["restaurant", "clinic", "auto"] as Industry[]).map(id => {
            const d = tr.industries[id]
            const active = id === industry
            return (
              <button
                key={id}
                onClick={() => setIndustry(id)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 20px", borderRadius: 40, border: "none", cursor: "pointer",
                  fontFamily: "inherit", fontSize: 14, fontWeight: 500,
                  background: active ? "var(--ce-primary)" : "rgba(255,255,255,.08)",
                  color: active ? "#fff" : "rgba(255,255,255,.6)",
                  transition: "background .2s, color .2s",
                }}
              >
                {ICONS[id]}
                {d.label}
              </button>
            )
          })}
        </div>

        {/* Player card */}
        <div className="ce-demo-grid" style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 28, padding: 32, display: "grid", gridTemplateColumns: "300px 1fr", gap: 32, backdropFilter: "blur(8px)" }}>

          {/* Left: player */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>{tr.realCall}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)" }}>{demo.subtitle}</div>
            </div>
            <div style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 18, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <button
                  onClick={handlePlay}
                  style={{ width: 52, height: 52, borderRadius: "50%", border: "none", background: "var(--ce-accent)", color: "var(--ce-text)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 22px -6px rgba(242,201,76,.5)", cursor: "pointer", flexShrink: 0 }}
                >
                  {playing
                    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>
                    : <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 2 }}><path d="M8 5v14l11-7z"/></svg>
                  }
                </button>
                <span style={{ fontFamily: "monospace", fontSize: 13, color: "rgba(255,255,255,.7)" }}>{fmt(time)} / {fmt(demo.total)}</span>
              </div>
              <div onClick={handleSeek} style={{ cursor: "pointer" }}>
                <ProgressWaveform progress={time / demo.total} playing={playing} />
              </div>
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,.08)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 13 }}>
                <div>
                  <div style={{ color: "rgba(255,255,255,.5)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{tr.guestLabel}</div>
                  <div style={{ marginTop: 2 }}>{demo.phone}</div>
                </div>
                <div>
                  <div style={{ color: "rgba(255,255,255,.5)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{tr.resultLabel}</div>
                  <div style={{ marginTop: 2, color: "var(--ce-accent)" }}>{demo.result}</div>
                </div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,.55)", lineHeight: 1.55, margin: 0 }}>
              {tr.disclaimer}
            </p>
          </div>

          {/* Right: transcript */}
          <div ref={containerRef} style={{ maxHeight: 420, overflowY: "auto", padding: "4px 8px 4px 0", scrollbarWidth: "thin" }}>
            {transcript.map((line, i) => {
              const isEmily = line.who === "emily"
              const isActive = i === activeIdx
              const isPast = i < activeIdx
              return (
                <div key={`${industry}-${i}`} data-line={i} style={{ display: "flex", flexDirection: isEmily ? "row" : "row-reverse", marginBottom: 16, opacity: isActive ? 1 : isPast ? 0.55 : 0.3, transition: "opacity .3s ease" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, margin: isEmily ? "0 12px 0 0" : "0 0 0 12px", background: isEmily ? "var(--ce-primary)" : "rgba(255,255,255,.12)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 13 }}>
                    {isEmily ? tr.emilyInitial : tr.guestInitial}
                  </div>
                  <div style={{ maxWidth: "80%" }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", textAlign: isEmily ? "left" : "right", marginBottom: 5 }}>
                      {isEmily ? tr.emilyLabel : tr.guestLabel} · <span style={{ fontFamily: "monospace" }}>{line.t}</span>
                    </div>
                    <div style={{ padding: "11px 16px", borderRadius: 16, borderTopLeftRadius: isEmily ? 4 : 16, borderTopRightRadius: isEmily ? 16 : 4, background: isEmily ? (isActive ? "var(--ce-primary)" : "rgba(232,93,44,.15)") : (isActive ? "rgba(255,255,255,.18)" : "rgba(255,255,255,.06)"), color: "#fff", fontSize: 14.5, lineHeight: 1.5, transition: "background .3s ease" }}>
                      {line.text}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .ce-demo-grid { grid-template-columns: 1fr !important; padding: 20px !important; }
        }
      `}</style>
    </section>
  )
}
