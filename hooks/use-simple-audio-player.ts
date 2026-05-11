"use client"

import { useState, useCallback } from "react"

interface UseSimpleAudioPlayerOptions {
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  onError?: (error: Error) => void
}

export function useSimpleAudioPlayer(options: UseSimpleAudioPlayerOptions = {}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [activeAudio, setActiveAudio] = useState<HTMLAudioElement | null>(null)

  // Остановка текущего воспроизведения
  const stopCurrentAudio = useCallback(() => {
    if (activeAudio) {
      console.log("Останавливаем текущее воспроизведение")
      activeAudio.pause()
      activeAudio.src = ""
      setActiveAudio(null)
      setIsPlaying(false)
    }
  }, [activeAudio])

  // Воспроизведе��ие аудио из ArrayBuffer
  const playAudioBuffer = useCallback(
    async (buffer: ArrayBuffer, mimeType = "audio/mpeg") => {
      try {
        console.log(`Воспроизведение аудио буфера размером ${buffer.byteLength} байт`)
        setIsLoading(true)
        setError(null)

        // Проверяем, что буфер не пустой
        if (!buffer || buffer.byteLength === 0) {
          throw new Error("Получен пустой аудио буфер")
        }

        // Останавливаем текущее воспроизведение
        stopCurrentAudio()

        // Создаем Blob из буфера
        const blob = new Blob([buffer], { type: mimeType })

        // Проверяем размер Blob
        if (blob.size === 0) {
          throw new Error("Создан пустой Blob из буфера")
        }

        // Создаем URL для Blob
        const url = URL.createObjectURL(blob)
        console.log(`Создан URL для Blob: ${url}`)

        // Создаем новый аудио элемент
        const audio = new Audio()

        // Настраиваем обработчики событий
        const setupAudio = () => {
          return new Promise<void>((resolve, reject) => {
            // Обработчик успешной загрузки
            audio.oncanplaythrough = () => {
              console.log("Аудио загружено и готово к воспроизведению")
              audio.removeEventListener("canplaythrough", audio.oncanplaythrough)
              resolve()
            }

            // Обработчик ошибки
            audio.onerror = (e) => {
              const errorMessage = audio.error
                ? `Ошибка аудио: ${audio.error.code} - ${audio.error.message}`
                : "Неизвестная ошибка аудио"
              console.error(errorMessage, e)

              // Освобождаем URL
              URL.revokeObjectURL(url)
              audio.removeEventListener("error", audio.onerror)
              reject(new Error(errorMessage))
            }

            // Обработчик начала воспроизведения
            audio.onplay = () => {
              console.log("Аудио воспроизведение началось")
              setIsPlaying(true)
              options.onPlay?.()
            }

            // Обработчик завершения воспроизведения
            audio.onended = () => {
              console.log("Аудио воспроизведение завершено")
              setIsPlaying(false)
              setActiveAudio(null)

              // Освобождаем URL
              URL.revokeObjectURL(url)

              options.onEnded?.()
            }

            // Устанавливаем источник и загружаем
            audio.src = url
            audio.load()

            // Устанавливаем таймаут для загрузки
            setTimeout(() => {
              if (!audio.readyState) {
                audio.removeEventListener("canplaythrough", audio.oncanplaythrough)
                audio.removeEventListener("error", audio.onerror)
                reject(new Error("Таймаут загрузки аудио"))
              }
            }, 5000)
          })
        }

        // Настраиваем аудио и ждем загрузки
        await setupAudio()

        // Сохраняем ссылку на активный аудио элемент
        setActiveAudio(audio)

        // Воспроизводим
        console.log("Начинаем воспроизведение")
        try {
          await audio.play()
        } catch (playError) {
          console.error("Ошибка при начале воспроизведения:", playError)
          // Если ошибка связана с политикой автовоспроизведения, пытаемся снова после взаимодействия
          if (playError instanceof DOMException && playError.name === "NotAllowedError") {
            console.log("Проблема с автовоспроизведением, пробуем альтернативный метод")
            // Пробуем альтернативный метод
            await playWithWebAudio(buffer)
          } else {
            throw playError
          }
        }

        return true
      } catch (error) {
        console.error("Ошибка при воспроизведении аудио:", error)
        setError(error instanceof Error ? error : new Error(String(error)))
        options.onError?.(error instanceof Error ? error : new Error(String(error)))

        // Пробуем альтернативный метод
        try {
          console.log("Пробуем альтернативный метод воспроизведения")
          await playWithWebAudio(buffer)
          return true
        } catch (fallbackError) {
          console.error("Альтернативный метод также не сработал:", fallbackError)
          return false
        }
      } finally {
        setIsLoading(false)
      }
    },
    [options, stopCurrentAudio],
  )

  // Альтернативный метод воспроизведения через Web Audio API
  const playWithWebAudio = async (buffer: ArrayBuffer): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      try {
        console.log("Воспроизведение через Web Audio API")

        // Проверяем поддержку API
        if (!window.AudioContext && !(window as any).webkitAudioContext) {
          return reject(new Error("Web Audio API не поддерживается"))
        }

        // Создаем AudioContext
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

        // Декодируем аудио данные
        audioContext.decodeAudioData(
          buffer.slice(0), // Создаем копию буфера
          (decodedData) => {
            try {
              // Создаем источник
              const source = audioContext.createBufferSource()
              source.buffer = decodedData

              // Подключаем к выходу
              source.connect(audioContext.destination)

              // Обработчики событий
              source.onended = () => {
                console.log("Web Audio API воспроизведение завершено")
                setIsPlaying(false)
                options.onEnded?.()
                resolve(true)
              }

              // Запускаем воспроизведение
              source.start(0)
              console.log("Web Audio API воспроизведение начато")
              setIsPlaying(true)
              options.onPlay?.()
            } catch (sourceError) {
              console.error("Ошибка при запуске источника:", sourceError)
              reject(sourceError)
            }
          },
          (decodeError) => {
            console.error("Ошибка декодирования аудио:", decodeError)
            reject(decodeError)
          },
        )
      } catch (error) {
        console.error("Ошибка Web Audio API:", error)
        reject(error)
      }
    })
  }

  // Остановка воспроизведения
  const stopAudio = useCallback(() => {
    stopCurrentAudio()
  }, [stopCurrentAudio])

  return {
    isPlaying,
    isLoading,
    error,
    playAudioBuffer,
    stopAudio,
  }
}
