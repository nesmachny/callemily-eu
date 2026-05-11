"use client"

import type React from "react"
import "./globals.css"
import { Montserrat, Open_Sans } from "next/font/google"
import { useEffect } from "react"

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["700"],
  variable: "--font-montserrat",
  display: "swap",
})

const openSans = Open_Sans({
  subsets: ["latin", "cyrillic"],
  weight: ["400"],
  variable: "--font-open-sans",
  display: "swap",
})

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Применяем фикс при монтировании компонента
  useEffect(() => {
    if (typeof window !== "undefined" && typeof process !== "undefined" && process.env) {
      // Перехватываем доступ к проблемным переменным
      Object.defineProperties(process.env, {
        NPM_RC: {
          get() {
            return undefined
          },
          configurable: true,
        },
        NPM_TOKEN: {
          get() {
            return undefined
          },
          configurable: true,
        },
      })
    }
  }, [])

  return (
    <html lang="ru" className={`${montserrat.variable} ${openSans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
