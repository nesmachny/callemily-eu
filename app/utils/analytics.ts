export const EVENTS = {
  FORM_SUBMIT: "form_submit",
  BUTTON_CLICK: "button_click",
  LINK_CLICK: "link_click",
}

export const trackEvent = (eventName: string, eventParams: any) => {
  try {
    console.log(`Event: ${eventName}`, eventParams)

    // Только Яндекс.Метрика
    if (typeof window !== "undefined" && typeof window.ym === "function") {
      try {
        window.ym(101623535, "reachGoal", eventName, eventParams)
      } catch (ymError) {
        console.error(`Error in ym for ${eventName}:`, ymError)
      }
    }
  } catch (error) {
    console.error(`Error in trackEvent for ${eventName}:`, error)
  }
}
