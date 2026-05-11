"use client"

import Script from "next/script"

export default function TrackingScripts() {
  return (
    <Script
      defer
      src="https://app.web-metrics.ru/em.js"
      data-website-id="0a07ca37-757e-4270-92db-737cb44e3dbe"
      strategy="afterInteractive"
    />
  )
}
