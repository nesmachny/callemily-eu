"use client"

import { useState, useEffect, useRef } from "react"

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    try {
      // Проверяем localStorage на наличие согласия
      const consent = localStorage.getItem("cookie-consent")

      // Если согласия нет, показываем баннер
      if (!consent) {
        setShowConsent(true)
      }
    } catch (error) {
      // В случае ошибки (например, localStorage недоступен), показываем баннер
      console.log("Cookie consent check error:", error)
      setShowConsent(true)
    }

    setIsLoaded(true)
  }, [])

  useEffect(() => {
    // Управляем диалогом при изменении showConsent
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
    } catch (error) {
      console.log("Error saving consent:", error)
    }
    setShowConsent(false)

    // Отправляем событие для активации трекеров
    window.dispatchEvent(new Event("cookieConsentAccepted"))

    // Перезагружаем страницу для активации скриптов
    window.location.reload()
  }

  const handleDecline = () => {
    try {
      localStorage.setItem("cookie-consent", "declined")
      document.cookie = "cookie-consent=declined; path=/; max-age=31536000; SameSite=Lax; Secure"
    } catch (error) {
      console.log("Error saving consent:", error)
    }
    setShowConsent(false)
  }

  if (!isLoaded) {
    return null
  }

  return (
    <dialog
      ref={dialogRef}
      className="cookie-consent-dialog"
      style={{
        position: "fixed",
        bottom: "0",
        left: "0",
        right: "0",
        top: "auto",
        margin: 0,
        padding: 0,
        border: "none",
        background: "transparent",
        width: "100%",
        maxWidth: "100%",
        zIndex: 9999,
      }}
    >
      <div style={{ width: "100%", background: "var(--ce-surface)", borderTop: "1px solid var(--ce-border)", boxShadow: "0 -8px 32px -8px rgba(26,20,16,.12)" }}>
        <div className="ce-wrap" style={{ padding: "20px 32px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <p style={{ fontFamily: "var(--font-unbounded), sans-serif", fontWeight: 600, fontSize: 14, margin: "0 0 6px", color: "var(--ce-text)" }}>Использование cookies</p>
            <p style={{ fontSize: 13.5, color: "var(--ce-text-2)", margin: 0, lineHeight: 1.55 }}>
              Мы используем cookies для улучшения работы сайта. Подробнее —{" "}
              <a href="/privacy" style={{ color: "var(--ce-primary)", textDecoration: "underline" }}>в Политике</a>.{" "}
              Продолжая пользоваться сайтом, вы даёте согласие на использование файлов cookies.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
            <button onClick={handleAccept} className="ce-btn ce-btn-primary ce-btn-sm">Принять</button>
            <button onClick={handleDecline} className="ce-btn ce-btn-secondary ce-btn-sm">Отклонить</button>
          </div>
        </div>
      </div>
    </dialog>
  )
}
