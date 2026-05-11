"use client"

import { useState } from "react"
import { t } from "@/lib/translations"

export default function FAQSectionV2({ locale }: { locale: string }) {
  const tr = t(locale).faq
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="ce-section" style={{ background: "var(--ce-bg)" }}>
      <div className="ce-wrap-narrow">
        <div style={{ marginBottom: 48, textAlign: "center" }}>
          <span className="ce-eyebrow" style={{ display: "block", textAlign: "center" }}>{tr.eyebrow}</span>
          <h2 className="ce-h-display" style={{ fontSize: "clamp(32px, 4.4vw, 56px)", margin: 0 }}>{tr.h2}</h2>
        </div>

        <div className="ce-card" style={{ padding: 8 }}>
          {tr.items.map((it, i) => {
            const isOpen = open === i
            return (
              <div key={i} style={{ borderBottom: i < tr.items.length - 1 ? "1px solid var(--ce-border)" : "none" }}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{ width: "100%", textAlign: "left", background: "transparent", border: "none", padding: "22px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, color: "var(--ce-text)", cursor: "pointer" }}
                >
                  <span className="ce-h-display" style={{ fontSize: 17, fontWeight: 500, lineHeight: 1.35 }}>{it.q}</span>
                  <span style={{ width: 32, height: 32, borderRadius: "50%", background: isOpen ? "var(--ce-primary)" : "var(--ce-bg-alt)", color: isOpen ? "#fff" : "var(--ce-text)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .2s ease", transform: isOpen ? "rotate(45deg)" : "rotate(0)", fontSize: 20, lineHeight: 1 }}>+</span>
                </button>
                <div style={{ maxHeight: isOpen ? 400 : 0, overflow: "hidden", transition: "max-height .35s ease" }}>
                  <div style={{ padding: "0 24px 24px", fontSize: 15.5, color: "var(--ce-text-2)", lineHeight: 1.65 }}>{it.a}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
