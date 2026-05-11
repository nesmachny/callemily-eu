"use client"

import { useState, useRef, useCallback, useEffect } from "react"

interface UseAudioPlayerOptions {
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  onError?: (error: Error) => void
}

export function useAudioPlayer(options: UseAudioPlayerOptions = {}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioUrlRef = useRef<string | null>(null)

  // Инициализация аудио элемента
  useEffect(() => {
    if (typeof window !== "undefined" && !audioRef.current) {
      const audio = new Audio()

      // Настраиваем обработчики событий
      audio.onplay = () => {
        console.log("Аудио воспроизведение началось")
        setIsPlaying(true)
        options.onPlay?.()
      }

      audio.onpause = () => {
        if (!audio.ended) {
          console.log("Аудио воспроизведение приостановлено")
          setIsPlaying(false)
          options.onPause?.()
        }
      }

      audio.onended = () => {
        console.log("Аудио воспроизведение завершено")
        setIsPlaying(false)
        options.onEnded?.()
      }

      audio.onerror = (e) => {
        const errorMessage = audio.error
          ? `Ошибка аудио: ${audio.error.code} - ${audio.error.message}`
          : "Неизвестная ошибка аудио"
        console.error(errorMessage, e)
        setIsPlaying(false)
        setError(new Error(errorMessage))
        options.onError?.(new Error(errorMessage))
      }

      audioRef.current = audio
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""

        if (audioUrlRef.current) {
          URL.revokeObjectURL(audioUrlRef.current)
          audioUrlRef.current = null
        }
      }
    }
  }, [options])

  // Воспроизведение аудио из Blob
  const playAudioBlob = useCallback(
    async (audioBlob: Blob) => {
      try {
        if (!audioRef.current) {
          throw new Error("Аудио элемент не инициализирован")
        }

        // Проверяем, что Blob не пустой
        if (audioBlob.size === 0) {
          throw new Error("Получен пустой аудио Blob")
        }

        setIsLoading(true)
        setError(null)

        // Останавливаем текущее воспроизведение
        audioRef.current.pause()
        audioRef.current.currentTime = 0

        // Освобождаем предыдущий URL
        if (audioUrlRef.current) {
          URL.revokeObjectURL(audioUrlRef.current)
          audioUrlRef.current = null
        }

        // Создаем URL для Blob
        const url = URL.createObjectURL(audioBlob)
        audioUrlRef.current = url

        console.log(`Создан URL для Blob: ${url}`)

        // Настраиваем источник и начинаем воспроизведение
        audioRef.current.src = url

        // Добавляем обработчик для проверки загрузки
        const loadPromise = new Promise<void>((resolve, reject) => {
          if (!audioRef.current) return reject(new Error("Аудио элемент не инициализирован"))

          const onCanPlay = () => {
            audioRef.current?.removeEventListener("canplaythrough", onCanPlay)
            resolve()
          }

          const onError = (e: Event) => {
            audioRef.current?.removeEventListener("error", onError)
            reject(new Error(`Ошибка загрузки аудио: ${audioRef.current?.error?.message || "неизвестная ошибка"}`))
          }

          audioRef.current.addEventListener("canplaythrough", onCanPlay)
          audioRef.current.addEventListener("error", onError)

          // Таймаут для загрузки
          setTimeout(() => {
            audioRef.current?.removeEventListener("canplaythrough", onCanPlay)
            audioRef.current?.removeEventListener("error", onError)
            reject(new Error("Таймаут загрузки аудио"))
          }, 10000)
        })

        // Загружаем аудио
        audioRef.current.load()

        // Ждем загрузки и затем воспроизводим
        await loadPromise
        console.log("Аудио загружено, начинаем воспроизведение")
        await audioRef.current.play()
      } catch (error) {
        console.error("Ошибка при воспроизведении аудио:", error)
        setError(error instanceof Error ? error : new Error(String(error)))
        options.onError?.(error instanceof Error ? error : new Error(String(error)))

        // Пробуем альтернативный метод воспроизведения
        try {
          if (audioRef.current && audioUrlRef.current) {
            console.log("Пробуем альтернативный метод воспроизведения")
            // Создаем новый аудио элемент
            const newAudio = new Audio(audioUrlRef.current)
            newAudio.onended = () => {
              options.onEnded?.()
              setIsPlaying(false)
            }
            newAudio.onplay = () => {
              setIsPlaying(true)
              options.onPlay?.()
            }
            await newAudio.play()
          }
        } catch (fallbackError) {
          console.error("Альтернативный метод также не сработал:", fallbackError)
        }
      } finally {
        setIsLoading(false)
      }
    },
    [options],
  )

  // Воспроизведение аудио из ArrayBuffer
  const playAudioBuffer = useCallback(
    async (buffer: ArrayBuffer, mimeType = "audio/mpeg") => {
      try {
        // Проверяем, что буфер не пустой
        if (!buffer || buffer.byteLength === 0) {
          throw new Error("Получен пустой аудио буфер")
        }

        console.log(`Воспроизведение аудио буфера размером ${buffer.byteLength} байт`)

        // Создаем Blob из буфера
        const blob = new Blob([buffer], { type: mimeType })

        // Проверяем размер Blob
        if (blob.size === 0) {
          throw new Error("Создан пустой Blob из буфера")
        }

        await playAudioBlob(blob)
      } catch (error) {
        console.error("Ошибка при воспроизведении аудио буфера:", error)
        setError(error instanceof Error ? error : new Error(String(error)))
        options.onError?.(error instanceof Error ? error : new Error(String(error)))
      }
    },
    [playAudioBlob, options],
  )

  // Остановка воспроизведения
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
    }
  }, [])

  // Пауза
  const pauseAudio = useCallback(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause()
    }
  }, [isPlaying])

  // Возобновление воспроизведения
  const resumeAudio = useCallback(() => {
    if (audioRef.current && !isPlaying && audioRef.current.src) {
      audioRef.current.play().catch((error) => {
        console.error("Ошибка при возобновлении воспроизведения:", error)
        setError(error instanceof Error ? error : new Error(String(error)))
        options.onError?.(error instanceof Error ? error : new Error(String(error)))
      })
    }
  }, [isPlaying, options])

  return {
    isPlaying,
    isLoading,
    error,
    playAudioBlob,
    playAudioBuffer,
    stopAudio,
    pauseAudio,
    resumeAudio,
  }
}
