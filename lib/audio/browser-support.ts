/**
 * Утилиты для проверки поддержки API браузера
 */

export function checkAudioSupport() {
  // Проверка наличия браузерного окружения
  const isBrowser = typeof window !== "undefined"

  if (!isBrowser) {
    return {
      audioSupported: false,
      webAudioSupported: false,
      mediaDevicesSupported: false,
      getUserMediaSupported: false,
      mediaRecorderSupported: false,
      audioContextSupported: false,
      audioWorkletSupported: false,
      webmSupported: false,
      mp3Supported: false,
      oggSupported: false,
    }
  }

  // Базовые проверки API
  const audioSupported = typeof Audio !== "undefined"
  const webAudioSupported = typeof (window.AudioContext || (window as any).webkitAudioContext) !== "undefined"
  const mediaDevicesSupported = !!(navigator && navigator.mediaDevices)
  const getUserMediaSupported = !!(mediaDevicesSupported && navigator.mediaDevices.getUserMedia)
  const mediaRecorderSupported = typeof MediaRecorder !== "undefined"
  const audioContextSupported = typeof (window.AudioContext || (window as any).webkitAudioContext) !== "undefined"

  // Расширенные проверки возможностей
  let audioWorkletSupported = false
  if (audioContextSupported) {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    audioWorkletSupported = !!audioContext.audioWorklet
  }

  // Проверка поддержки форматов аудио
  let webmSupported = false
  let mp3Supported = false
  let oggSupported = false

  if (mediaRecorderSupported) {
    webmSupported = MediaRecorder.isTypeSupported("audio/webm")
    mp3Supported = MediaRecorder.isTypeSupported("audio/mp4") || MediaRecorder.isTypeSupported("audio/mpeg")
    oggSupported = MediaRecorder.isTypeSupported("audio/ogg")
  }

  return {
    audioSupported,
    webAudioSupported,
    mediaDevicesSupported,
    getUserMediaSupported,
    mediaRecorderSupported,
    audioContextSupported,
    audioWorkletSupported,
    webmSupported,
    mp3Supported,
    oggSupported,
  }
}

/**
 * Создает и активирует AudioContext (требует взаимодействия пользователя)
 */
export async function createAndActivateAudioContext(): Promise<AudioContext | null> {
  try {
    if (typeof window === "undefined") return null

    // Создаем AudioContext с учетом префиксов
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) return null

    const audioContext = new AudioContextClass()

    // Если контекст в состоянии suspended, пытаемся его запустить
    if (audioContext.state === "suspended") {
      try {
        await audioContext.resume()
      } catch (error) {
        console.warn("Failed to resume AudioContext:", error)
      }
    }

    return audioContext
  } catch (error) {
    console.error("Failed to create AudioContext:", error)
    return null
  }
}

/**
 * Проверяет разрешение на доступ к микрофону
 */
export async function checkMicrophonePermission(): Promise<"granted" | "denied" | "prompt" | "unknown"> {
  try {
    if (typeof navigator === "undefined" || !navigator.permissions || !navigator.permissions.query) {
      return "unknown"
    }

    const result = await navigator.permissions.query({ name: "microphone" as PermissionName })
    return result.state as "granted" | "denied" | "prompt"
  } catch (error) {
    console.error("Failed to query microphone permission:", error)
    return "unknown"
  }
}
