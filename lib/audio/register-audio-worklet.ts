/**
 * Регистрация AudioWorklet для воспроизведения аудио
 * Теперь загружает процессор из внешнего файла public/audio-player-processor.js
 */

let isRegistrationAttempted = false // Tracks if we've tried to register for a given context
let isSuccessfullyRegistered = false // Tracks if registration was successful for a given context

export async function registerAudioWorklet(audioContext: AudioContext): Promise<boolean> {
  // If already successfully registered for this context instance (or a similar one), assume it's fine.
  // This simple check might need to be more sophisticated if multiple audio contexts are used and re-created.
  if (isSuccessfullyRegistered && audioContext.state === "running") {
    console.log("AudioPlayerRegister: Worklet already successfully registered and context is running.")
    return true
  }

  if (audioContext.state === "closed") {
    console.error("AudioPlayerRegister: Cannot register worklet with a closed AudioContext.")
    isSuccessfullyRegistered = false // Reset status if context was closed
    return false
  }

  // Prevent re-registration attempts if one is already in progress or failed recently for this context
  // This is a simple guard; more robust would involve a Map of contexts to registration status.
  if (isRegistrationAttempted && !isSuccessfullyRegistered) {
    console.warn(
      "AudioPlayerRegister: Previous registration attempt failed or is in progress. Not re-attempting immediately.",
    )
    // return false; // Or allow re-attempt after a delay, or based on context state changes
  }

  isRegistrationAttempted = true
  isSuccessfullyRegistered = false // Assume failure until success

  const workletURL = "/audio-player-processor.js" // Path to the external worklet file

  try {
    console.log(`AudioPlayerRegister: Attempting to add module from URL: ${workletURL}`)

    // Add a cache-busting query parameter to the URL
    // This is a common technique to help ensure the browser fetches the latest version.
    const cacheBustingURL = `${workletURL}?v=${Date.now()}`

    await audioContext.audioWorklet.addModule(cacheBustingURL)

    console.log(`AudioPlayerRegister: AudioWorklet module from ${cacheBustingURL} added successfully.`)
    isSuccessfullyRegistered = true
    return true
  } catch (error) {
    console.error(`AudioPlayerRegister: Failed to add AudioWorklet module from ${workletURL}. Error:`, error)
    // isRegistrationAttempted = false; // Allow another attempt later if desired
    return false
  }
}
