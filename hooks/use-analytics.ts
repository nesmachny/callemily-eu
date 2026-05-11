"use client"

import { useCallback } from "react"

export function useAnalytics() {
  const trackEvent = useCallback((eventName: string, eventParams: Record<string, any> = {}) => {
    try {
      // Проверяем согласие на cookies
      const consent = localStorage.getItem("cookie-consent")
      if (consent !== "accepted") {
        console.log("Analytics tracking blocked - no cookie consent")
        return
      }

      // Только Яндекс.Метрика
      if (typeof window !== "undefined" && typeof window.ym === "function") {
        try {
          window.ym(101623535, "reachGoal", eventName, eventParams)
        } catch (error) {
          console.error(`Error in ym for ${eventName}:`, error)
        }
      }

      console.log(`Event tracked: ${eventName}`, eventParams)
    } catch (error) {
      console.error(`Error in trackEvent for ${eventName}:`, error)
    }
  }, [])

  const trackButtonClick = useCallback(
    (buttonName: string, additionalData: Record<string, any> = {}) => {
      trackEvent("button_click", {
        button_name: buttonName,
        ...additionalData,
      })
    },
    [trackEvent],
  )

  const trackFormSubmit = useCallback(
    (formName: string, additionalData: Record<string, any> = {}) => {
      trackEvent("form_submit", {
        form_name: formName,
        ...additionalData,
      })
    },
    [trackEvent],
  )

  const trackPageView = useCallback(
    (pageName: string, additionalData: Record<string, any> = {}) => {
      trackEvent("page_view", {
        page_name: pageName,
        page_path: window.location.pathname,
        page_title: document.title,
        ...additionalData,
      })
    },
    [trackEvent],
  )

  return {
    trackEvent,
    trackButtonClick,
    trackFormSubmit,
    trackPageView,
  }
}
