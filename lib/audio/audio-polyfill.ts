/**
 * Полифилл для поддержки аудио API в различных браузерах
 */

// Функция для добавления WebAudio API полифиллов
export function setupAudioPolyfills() {
  if (typeof window === "undefined") return

  // Полифилл для AudioContext
  window.AudioContext = window.AudioContext || (window as any).webkitAudioContext

  // Полифилл для getUserMedia
  if (navigator.mediaDevices === undefined) {
    ;(navigator as any).mediaDevices = {}
  }

  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = (constraints) => {
      const getUserMedia =
        navigator.getUserMedia ||
        (navigator as any).webkitGetUserMedia ||
        (navigator as any).mozGetUserMedia ||
        (navigator as any).msGetUserMedia

      if (!getUserMedia) {
        return Promise.reject(new Error("getUserMedia is not supported in this browser"))
      }

      return new Promise((resolve, reject) => {
        getUserMedia.call(navigator, constraints, resolve, reject)
      })
    }
  }

  // Полифилл для Audio
  if (typeof Audio !== "undefined") {
    // Патчим прототип Audio для более надежного воспроизведения
    const originalPlay = Audio.prototype.play
    Audio.prototype.play = function () {
      // Добавляем автоматическую загрузку перед воспроизведением
      if (this.readyState === 0) {
        this.load()
      }

      // Вызываем оригинальный метод
      return originalPlay.call(this).catch((error) => {
        console.warn("Audio play failed, trying alternative method:", error)

        // Если ошибка связана с автоматическим воспроизведением, пробуем с задержкой
        if (error.name === "NotAllowedError") {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              originalPlay.call(this).then(resolve).catch(reject)
            }, 300)
          })
        }

        // Иначе пробрасываем ошибку дальше
        return Promise.reject(error)
      })
    }
  }

  // Базовый полифилл для MediaRecorder если он не поддерживается
  if (typeof MediaRecorder === "undefined") {
    console.warn("MediaRecorder is not supported in this browser. Audio recording will not work.")
  }
}

// Экспортируем функцию для активации AudioContext через пользовательское взаимодействие
export async function unlockAudioContext(audioContext: AudioContext | null): Promise<boolean> {
  if (!audioContext) return false

  // Если контекст уже запущен, возвращаем успех
  if (audioContext.state === "running") {
    return true
  }

  // Пытаемся запустить контекст
  try {
    await audioContext.resume()

    // Воспроизводим тихий звук для разблокировки аудио в iOS
    const buffer = audioContext.createBuffer(1, 1, 22050)
    const source = audioContext.createBufferSource()
    source.buffer = buffer
    source.connect(audioContext.destination)
    source.start(0)

    return audioContext.state === "running"
  } catch (error) {
    console.error("Failed to unlock audio context:", error)
    return false
  }
}

// Функция для проверки и настройки аудио разрешений
export async function requestAudioPermissions(): Promise<boolean> {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("getUserMedia is not supported in this browser")
      return false
    }

    // Запрашиваем доступ к микрофону
    await navigator.mediaDevices.getUserMedia({ audio: true })
    return true
  } catch (error) {
    console.error("Error requesting audio permission:", error)
    return false
  }
}

// Функция для разблокировки воспроизведения аудио на iOS
export function unlockAudioOnIOS() {
  if (typeof window === "undefined") return

  // Проверяем, iOS ли это
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream

  if (!isIOS) return

  // Функция для разблокировки
  const unlock = () => {
    // Создаем временный аудио элемент
    const audio = new Audio()
    audio.controls = false

    // Устанавливаем пустой источник (короткий тихий звук)
    audio.src =
      "data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA"

    // Пробуем воспроизвести
    const playPromise = audio.play()
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Игнорируем ошибки - нам важен только факт попытки воспроизведения
      })
    }

    // Удаляем обработчики после использования
    document.removeEventListener("touchstart", unlock)
    document.removeEventListener("touchend", unlock)
    document.removeEventListener("click", unlock)
  }

  // Добавляем обработчики событий для разблокировки
  document.addEventListener("touchstart", unlock, false)
  document.addEventListener("touchend", unlock, false)
  document.addEventListener("click", unlock, false)
}
