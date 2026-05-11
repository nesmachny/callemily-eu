"use client"

import Script from "next/script"
import { useEffect, useState } from "react"

export default function YandexMetrika() {
  const [hasConsent, setHasConsent] = useState(false)
  const counterId = 101623535 // ID счетчика CallEmily

  useEffect(() => {
    // Проверяем согласие на cookies
    const checkConsent = () => {
      try {
        const consent = localStorage.getItem("cookie-consent")
        if (consent === "accepted") {
          setHasConsent(true)
        }
      } catch (error) {
        console.log("Error checking consent:", error)
      }
    }

    checkConsent()

    // Слушаем событие принятия cookies
    const handleConsentAccepted = () => {
      setHasConsent(true)
    }

    window.addEventListener("cookieConsentAccepted", handleConsentAccepted)
    window.addEventListener("storage", checkConsent)

    return () => {
      window.removeEventListener("cookieConsentAccepted", handleConsentAccepted)
      window.removeEventListener("storage", checkConsent)
    }
  }, [])

  if (!hasConsent) {
    return null
  }

  return (
    <>
      <Script
        id="yandex-metrika"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
            
            ym(${counterId}, "init", {
                clickmap:true,
                trackLinks:true,
                accurateTrackBounce:true,
                webvisor:true
            });
          `,
        }}
      />
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${counterId}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  )
}
