"use client"

import { useAnalytics } from "@/hooks/use-analytics"
import { useEffect } from "react"

export default function AnalyticsExample() {
  const { trackPageView, trackButtonClick } = useAnalytics()

  useEffect(() => {
    // Отслеживаем просмотр страницы
    trackPageView("example-page")
  }, [trackPageView])

  const handleButtonClick = () => {
    // Отслеживаем клик по кнопке
    trackButtonClick("example-button", {
      section: "hero",
      variant: "primary",
    })
  }

  return <button onClick={handleButtonClick}>Пример кнопки с аналитикой</button>
}
