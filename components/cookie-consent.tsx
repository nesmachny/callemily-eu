"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { t } from "@/lib/translations"

export default function CookieConsent() {
  const pathname = usePathname()
  const locale = pathname.split("/")[1] || "en"
  const tr = t(locale).cookie

  const [showConsent, setShowConsent] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    try {
      const consent = localStorage.getItem("cookie-consent")
      if (!consent) setShowConsent(true)
    } catch {
      setShowConsent(true)
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (showConsent && dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal()
    } else if (!showConsent && dialogRef.current && dialogRef.current.open) {
      dialogRef.current.close()
    }
  }, [showConsent])

  const handleAccept = () => {
    try {
      localStorage.setItem("cookie-consent", "accepted")
      document.cookie = "cookie-consent=accepted; path=/; max-age=31536000; SameSite=Lax; Secure"
    } catch {}
    setShowConsent(false)
    window.dispatchEvent(new Event("cookieConsentAccepted"))
    window.location.reload()
  }

  const handleDecline = () => {
    try {
      localStorage.setItem("cookie-consent", "declined")
      document.cookie = "cookie-consent=declined; path=/; max-age=31536000; SameSite=Lax; Secure"
    } catch {}
    setShowConsent(false)
  }

  if (!isLoaded) return null

  return (
    <dialog
      ref={dialogRef}
      className="cookie-consent-dialog"
      style={{ position: "fixed", bottom: "0", left: "0", right: "0", top: "auto", margin: 0, padding: 0, border: "none", background: "transparent", width: "100%", maxWidth: "100%", zIndex: 9999 }}
    >
      <div style={{ width: "100%", background: "var(--ce-surface)", borderTop: "1px solid var(--ce-border)", boxShadow: "0 -8px 32px -8px rgba(26,20,16,.12)" }}>
        <div className="ce-wrap" style={{ padding: "20px 32px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <p style={{ fontFamily: "var(--font-unbounded), sans-serif", fontWeight: 600, fontSize: 14, margin: "0 0 6px", color: "var(--ce-text)" }}>{tr.title}</p>
            <p style={{ fontSize: 13.5, color: "var(--ce-text-2)", margin: 0, lineHeight: 1.55 }}>
              {tr.text}{" "}
              <a href={`/${locale}/privacy`} style={{ color: "var(--ce-primary)", textDecoration: "underline" }}>{tr.privacyLink}</a>
              {tr.textAfter}
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
            <button onClick={handleAccept} className="ce-btn ce-btn-primary ce-btn-sm">{tr.accept}</button>
            <button onClick={handleDecline} className="ce-btn ce-btn-secondary ce-btn-sm">{tr.decline}</button>
          </div>
        </div>
      </div>
    </dialog>
  )
}
