"use client"

import { useState, useRef, useEffect, useCallback } from "react"

// Типы для аудио системы
type AudioState = "inactive" | "recording" | "processing" | "error"

interface AudioStreamOptions {
  onSpeechStart?: () => void
  onSpeechEnd?: (audioData: Blob) => void
  onAudioChunk?: (audioData: Blob) => void
  onError?: (error: Error) => void
  silenceThreshold?: number
  silenceDuration?: number
}

/**
 * Хук для работы с аудио потоком и обработкой речи
 */
export function useAudioStream(options: AudioStreamOptions = {}) {
  const [audioState, setAudioState] = useState<AudioState>("inactive")
  const [audioLevel, setAudioLevel] = useState<number>(0)
  const [isSilent, setIsSilent] = useState<boolean>(true)
  const [speechDetected, setSpeechDetected] = useState<boolean>(false)

  // Refs для хранения ресурсов
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const animationFrameRef = useRef<number | null>(null)
  const silenceStartTimeRef = useRef<number | null>(null)
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const audioProcessorRef = useRef<ScriptProcessorNode | null>(null)

  // Функция проверки поддержки API
  function checkAudioSupport(): {
    mediaDevicesSupported: boolean
    getUserMediaSupported: boolean
    mediaRecorderSupported: boolean
    audioContextSupported: boolean
  } {
    const mediaDevicesSupported = !!(navigator && navigator.mediaDevices)
    const getUserMediaSupported = !!(mediaDevicesSupported && navigator.mediaDevices.getUserMedia)
    const mediaRecorderSupported = typeof MediaRecorder !== "undefined"
    const audioContextSupported = typeof (window.AudioContext || (window as any).webkitAudioContext) !== "undefined"

    return {
      mediaDevicesSupported,
      getUserMediaSupported,
      mediaRecorderSupported,
      audioContextSupported,
    }
  }

  // Функция для анализа уровня звука
  const analyzeAudioLevel = useCallback(() => {
    if (!analyserRef.current || audioState !== "recording") return

    const analyser = analyserRef.current
    const dataArray = new Uint8Array(analyser.frequencyBinCount)
    analyser.getByteFrequencyData(dataArray)

    // Вычисляем средний уровень звука
    let sum = 0
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i]
    }
    const average = sum / dataArray.length
    setAudioLevel(average)

    // Определяем, есть ли речь
    const threshold = options.silenceThreshold || 10
    const isSilentNow = average < threshold
    setIsSilent(isSilentNow)

    // Обработка обнаружения речи и тишины
    if (!isSilentNow) {
      // Если обнаружена речь
      if (!speechDetected) {
        console.log("Speech detected")
        setSpeechDetected(true)
        options.onSpeechStart?.()
      }

      // Сбрасываем таймер тишины
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current)
        silenceTimeoutRef.current = null
      }
      silenceStartTimeRef.current = null
    } else if (speechDetected) {
      // Если была речь, а теперь тишина
      if (silenceStartTimeRef.current === null) {
        silenceStartTimeRef.current = Date.now()
      } else {
        const silenceDuration = Date.now() - silenceStartTimeRef.current
        const silenceThreshold = options.silenceDuration || 2000 // 2 секунды тишины по умолчанию

        if (silenceDuration > silenceThreshold && !silenceTimeoutRef.current) {
          // Устанавливаем таймер для завершения речи
          silenceTimeoutRef.current = setTimeout(() => {
            if (audioChunksRef.current.length > 0) {
              console.log("Speech ended due to silence")
              const audioBlob = new Blob(audioChunksRef.current, {
                type: mediaRecorderRef.current?.mimeType || "audio/webm",
              })
              options.onSpeechEnd?.(audioBlob)

              // Сбрасываем состояние
              setSpeechDetected(false)
              audioChunksRef.current = []
              silenceStartTimeRef.current = null
              silenceTimeoutRef.current = null
            }
          }, 500) // Небольшая задержка перед отправкой
        }
      }
    }

    // Продолжаем анализ в следующем кадре анимации
    animationFrameRef.current = requestAnimationFrame(analyzeAudioLevel)
  }, [audioState, options, speechDetected])

  // Запуск записи аудио
  const startRecording = useCallback(async () => {
    try {
      console.log("Starting audio recording...")

      // Проверяем поддержку API
      const support = checkAudioSupport()
      if (!support.mediaDevicesSupported || !support.getUserMediaSupported) {
        throw new Error("Ваш браузер не поддерживает API для доступа к микрофону")
      }

      if (!support.mediaRecorderSupported) {
        throw new Error("Ваш браузер не поддерживает MediaRecorder API")
      }

      if (!support.audioContextSupported) {
        throw new Error("Ваш браузер не поддерживает Web Audio API")
      }

      setAudioState("recording")

      // Запрашиваем доступ к микрофону с расширенными настройками
      const constraints = {
        audio: {
          echoCancellation: { ideal: true },
          noiseSuppression: { ideal: true },
          autoGainControl: { ideal: true },
          channelCount: { ideal: 1 },
          sampleRate: { ideal: 44100 },
        },
      }

      // Более надежный способ запроса доступа с обработкой ошибок
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        mediaStreamRef.current = stream
        console.log("Microphone access granted")

        // Проверяем, что поток содержит аудио треки
        const audioTracks = stream.getAudioTracks()
        if (audioTracks.length === 0) {
          throw new Error("Не удалось получить аудио треки с микрофона")
        }

        console.log(`Получено аудио треков: ${audioTracks.length}`)
        console.log(`Состояние первого трека: ${audioTracks[0].readyState}`)
        console.log(`Включен: ${audioTracks[0].enabled}`)

        // Проверяем настройки трека
        const settings = audioTracks[0].getSettings()
        console.log("Настройки аудио трека:", settings)
      } catch (mediaError: any) {
        console.error("Error accessing microphone:", mediaError)

        // Попробуем запросить с минимальными параметрами
        if (mediaError.name === "NotAllowedError") {
          throw new Error("Доступ к микрофону запрещен. Пожалуйста, разрешите доступ в настройках браузера.")
        } else if (mediaError.name === "NotFoundError") {
          throw new Error("Микрофон не найден. Пожалуйста, подключите микрофон к устройству.")
        } else {
          // Пробуем получить доступ с минимальными параметрами
          try {
            const basicStream = await navigator.mediaDevices.getUserMedia({ audio: true })
            mediaStreamRef.current = basicStream
            console.log("Microphone access granted with basic constraints")

            // Проверяем треки
            const audioTracks = basicStream.getAudioTracks()
            console.log(`Получено аудио треков (базовый режим): ${audioTracks.length}`)
          } catch (basicError) {
            throw new Error(`Ошибка доступа к микрофону: ${mediaError.message}`)
          }
        }
      }

      // Создаем AudioContext для анализа звука
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      audioContextRef.current = audioContext
      console.log(`AudioContext создан, состояние: ${audioContext.state}`)

      // Если контекст в состоянии suspended, пытаемся его запустить
      if (audioContext.state === "suspended") {
        try {
          await audioContext.resume()
          console.log(`AudioContext запущен, новое состояние: ${audioContext.state}`)
        } catch (resumeError) {
          console.error("Ошибка при запуске AudioContext:", resumeError)
        }
      }

      // Создаем анализатор звука
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 1024 // Увеличиваем размер FFT для лучшего анализа
      analyser.smoothingTimeConstant = 0.3 // Добавляем сглаживание для более стабильных значений
      analyserRef.current = analyser

      // Подключаем микрофон к анализатору
      const source = audioContext.createMediaStreamSource(mediaStreamRef.current)
      source.connect(analyser)

      // Добавляем ScriptProcessorNode для более надежного анализа звука
      const processor = audioContext.createScriptProcessor(2048, 1, 1)
      audioProcessorRef.current = processor

      // Подключаем процессор
      analyser.connect(processor)
      processor.connect(audioContext.destination)

      // Добавляем обработчик для анализа звука
      processor.onaudioprocess = (e) => {
        const input = e.inputBuffer.getChannelData(0)
        let sum = 0

        // Вычисляем среднеквадратичное значение (RMS) для лучшего определения громкости
        for (let i = 0; i < input.length; i++) {
          sum += input[i] * input[i]
        }

        const rms = Math.sqrt(sum / input.length)
        const db = 20 * Math.log10(rms) // Преобразуем в децибелы

        // Нормализуем значение для использования в UI (0-100)
        const normalizedLevel = Math.max(0, Math.min(100, (db + 100) * 2))

        // Обновляем уровень звука
        setAudioLevel(normalizedLevel)

        // Определяем тишину с более низким порогом
        const threshold = options.silenceThreshold || 5
        const isSilentNow = normalizedLevel < threshold
        setIsSilent(isSilentNow)

        // Обработка обнаружения речи и тишины (аналогично analyzeAudioLevel)
        if (!isSilentNow) {
          if (!speechDetected) {
            console.log("Speech detected via processor")
            setSpeechDetected(true)
            options.onSpeechStart?.()
          }

          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current)
            silenceTimeoutRef.current = null
          }
          silenceStartTimeRef.current = null
        } else if (speechDetected) {
          if (silenceStartTimeRef.current === null) {
            silenceStartTimeRef.current = Date.now()
          } else {
            const silenceDuration = Date.now() - silenceStartTimeRef.current
            const silenceThreshold = options.silenceDuration || 2000

            if (silenceDuration > silenceThreshold && !silenceTimeoutRef.current) {
              silenceTimeoutRef.current = setTimeout(() => {
                if (audioChunksRef.current.length > 0) {
                  console.log("Speech ended due to silence (processor)")
                  const audioBlob = new Blob(audioChunksRef.current, {
                    type: mediaRecorderRef.current?.mimeType || "audio/webm",
                  })
                  options.onSpeechEnd?.(audioBlob)

                  setSpeechDetected(false)
                  audioChunksRef.current = []
                  silenceStartTimeRef.current = null
                  silenceTimeoutRef.current = null
                }
              }, 500)
            }
          }
        }
      }

      // При создании MediaRecorder добавим обработку ошибок
      try {
        // Определяем поддерживаемый формат аудио с fallback
        let mimeType = "audio/webm"
        if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
          mimeType = "audio/webm;codecs=opus"
          console.log("Using audio/webm;codecs=opus")
        } else if (MediaRecorder.isTypeSupported("audio/webm")) {
          mimeType = "audio/webm"
          console.log("Using audio/webm")
        } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
          mimeType = "audio/mp4"
          console.log("Using audio/mp4")
        } else if (MediaRecorder.isTypeSupported("audio/ogg")) {
          mimeType = "audio/ogg"
          console.log("Using audio/ogg")
        } else {
          console.log("Using default audio format")
        }

        // Настраиваем MediaRecorder с более низким битрейтом для лучшей совместимости
        const options = {
          mimeType,
          audioBitsPerSecond: 128000,
        }

        const mediaRecorder = new MediaRecorder(mediaStreamRef.current, options)
        mediaRecorderRef.current = mediaRecorder

        // Добавим обработчик ошибок для MediaRecorder
        mediaRecorder.onerror = (event) => {
          console.error("MediaRecorder error:", event)
          options.onError?.(new Error("Ошибка записи звука"))
        }

        // Обработчик данных
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            console.log(`Received audio chunk: ${event.data.size} bytes`)
            audioChunksRef.current.push(event.data)

            // Отправляем чанк через callback, если он определен
            options.onAudioChunk?.(event.data)
          }
        }

        // Начинаем запись и анализ
        mediaRecorder.start(500) // Отправляем данные каждые 500 мс
        console.log("MediaRecorder started")

        // Запускаем анализ уровня звука
        animationFrameRef.current = requestAnimationFrame(analyzeAudioLevel)

        // Сбрасываем состояние обнаружения речи
        setSpeechDetected(false)
        setIsSilent(true)
        silenceStartTimeRef.current = null
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current)
          silenceTimeoutRef.current = null
        }
      } catch (recorderError) {
        console.error("Error creating MediaRecorder:", recorderError)
        throw new Error(`Не удалось создать MediaRecorder: ${recorderError.message}`)
      }
    } catch (error) {
      console.error("Error starting recording:", error)
      setAudioState("error")
      options.onError?.(error instanceof Error ? error : new Error(String(error)))
    }
  }, [analyzeAudioLevel, options])

  // Остановка записи
  const stopRecording = useCallback(() => {
    console.log("Stopping audio recording...")

    // Останавливаем анализ звука
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    // Очищаем таймер тишины
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current)
      silenceTimeoutRef.current = null
    }

    // Отключаем и очищаем ScriptProcessor
    if (audioProcessorRef.current && audioContextRef.current) {
      audioProcessorRef.current.disconnect()
      audioProcessorRef.current = null
    }

    // Останавливаем MediaRecorder и отправляем последний чанк
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop()

      // Добавляем обработчик для последнего чанка
      mediaRecorderRef.current.onstop = () => {
        if (audioChunksRef.current.length > 0 && speechDetected) {
          console.log("Sending final audio chunk on stop")
          const audioBlob = new Blob(audioChunksRef.current, {
            type: mediaRecorderRef.current?.mimeType || "audio/webm",
          })
          options.onSpeechEnd?.(audioBlob)
        }

        // Сбрасываем состояние
        setSpeechDetected(false)
        audioChunksRef.current = []
      }
    }

    // Освобождаем ресурсы
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => {
        track.stop()
        console.log(`Track ${track.kind} stopped`)
      })
      mediaStreamRef.current = null
    }

    if (audioContextRef.current) {
      audioContextRef.current.close().catch(console.error)
      audioContextRef.current = null
    }

    // Сбрасываем состояние
    setAudioState("inactive")
    setSpeechDetected(false)
    setIsSilent(true)
    silenceStartTimeRef.current = null
  }, [options, speechDetected])

  // Очистка ресурсов при размонтировании
  useEffect(() => {
    return () => {
      stopRecording()
    }
  }, [stopRecording])

  return {
    audioState,
    audioLevel,
    isSilent,
    speechDetected,
    startRecording,
    stopRecording,
  }
}
