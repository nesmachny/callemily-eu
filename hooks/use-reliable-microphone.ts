"use client"

import { useState, useRef, useEffect, useCallback } from "react"

interface UseReliableMicrophoneOptions {
  onAudioAvailable?: (blob: Blob) => void
  onAudioData?: (audioData: Float32Array, sampleRate: number) => void
  onError?: (error: Error) => void
  debug?: boolean
  // Добавляем опцию для более быстрой отправки аудио
  chunkDuration?: number // в миллисекундах
}

export function useReliableMicrophone(options: UseReliableMicrophoneOptions = {}) {
  const [isRecording, setIsRecording] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [permissionStatus, setPermissionStatus] = useState<PermissionState | "unknown">("unknown")
  const [debugInfo, setDebugInfo] = useState<string[]>([])

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const processorRef = useRef<ScriptProcessorNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const isCleaningUpRef = useRef(false)
  const lastChunkTimeRef = useRef<number>(0)
  // Add a ref to store the current audio level to avoid state updates in animation frames
  const audioLevelRef = useRef<number>(0)
  // Add a ref for the interval timer
  const audioLevelIntervalRef = useRef<number | null>(null)

  // Используем более короткую длительность чанка для быстрой отправки
  const chunkDuration = options.chunkDuration || 200 // 200мс по умолчанию вместо 300мс

  // Функция для логирования отладочной информации
  const logDebug = useCallback(
    (message: string) => {
      console.log(`[Microphone] ${message}`)
      if (options.debug) {
        setDebugInfo((prev) => [...prev.slice(-19), message])
      }
    },
    [options.debug],
  )

  // Проверка разрешения на доступ к микрофону
  const checkPermission = useCallback(async () => {
    try {
      if (!navigator.permissions || !navigator.permissions.query) {
        logDebug("Permissions API не поддерживается")
        return "unknown"
      }

      const result = await navigator.permissions.query({ name: "microphone" as PermissionName })
      logDebug(`Статус разрешения микрофона: ${result.state}`)
      setPermissionStatus(result.state)
      return result.state
    } catch (error) {
      logDebug(`Ошибка при проверке разрешения: ${error}`)
      return "unknown"
    }
  }, [logDebug])

  // Безопасное освобождение ресурсов
  const cleanupResources = useCallback(() => {
    if (isCleaningUpRef.current) return
    isCleaningUpRef.current = true

    logDebug("Освобождение ресурсов...")

    // Clear the interval for updating audio level
    if (audioLevelIntervalRef.current !== null) {
      window.clearInterval(audioLevelIntervalRef.current)
      audioLevelIntervalRef.current = null
    }

    // Останавливаем анализ звука
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    // Безопасно останавливаем MediaRecorder
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop()
        // Remove event listeners to prevent disconnected port usage
        mediaRecorderRef.current.ondataavailable = null
        mediaRecorderRef.current.onstop = null
        mediaRecorderRef.current.onerror = null
        logDebug("MediaRecorder остановлен")
      }
    } catch (e) {
      logDebug(`Ошибка при остановке MediaRecorder: ${e}`)
    }
    mediaRecorderRef.current = null

    // Отключаем процессор
    try {
      if (processorRef.current) {
        processorRef.current.disconnect()
        processorRef.current = null
        logDebug("Процессор отключен")
      }
    } catch (e) {
      logDebug(`Ошибка при отключении процессора: ${e}`)
    }

    // Отключаем источник от анализатора
    try {
      if (sourceRef.current) {
        sourceRef.current.disconnect()
        sourceRef.current = null
        logDebug("Источник аудио отключен")
      }
    } catch (e) {
      logDebug(`Ошибка при отключении источника: ${e}`)
    }

    // Отключаем анализатор
    try {
      if (analyserRef.current) {
        analyserRef.current.disconnect()
        analyserRef.current = null
        logDebug("Анализатор отключен")
      }
    } catch (e) {
      logDebug(`Ошибка при отключении анализатора: ${e}`)
    }

    // Останавливаем медиа потоки
    try {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => {
          track.stop()
          logDebug(`Трек ${track.kind} остановлен`)
        })
        mediaStreamRef.current = null
      }
    } catch (e) {
      logDebug(`Ошибка при остановке медиа потоков: ${e}`)
    }

    // Закрываем AudioContext
    try {
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch((e) => logDebug(`Ошибка при закрытии AudioContext: ${e}`))
        audioContextRef.current = null
        logDebug("AudioContext закрыт")
      }
    } catch (e) {
      logDebug(`Ошибка при закрытии AudioContext: ${e}`)
    }

    // Clear chunks
    chunksRef.current = []

    setIsRecording(false)
    setAudioLevel(0)
    audioLevelRef.current = 0
    isCleaningUpRef.current = false
    logDebug("Ресурсы освобождены")
  }, [logDebug])

  // Setup interval for updating audio level state from ref
  useEffect(() => {
    // Clear any existing interval
    if (audioLevelIntervalRef.current !== null) {
      window.clearInterval(audioLevelIntervalRef.current)
      audioLevelIntervalRef.current = null
    }

    // Only set up the interval if recording is active
    if (isRecording) {
      // Update audio level state from ref every 100ms
      audioLevelIntervalRef.current = window.setInterval(() => {
        setAudioLevel(audioLevelRef.current)
      }, 100)
    }

    // Clean up on unmount or when recording state changes
    return () => {
      if (audioLevelIntervalRef.current !== null) {
        window.clearInterval(audioLevelIntervalRef.current)
        audioLevelIntervalRef.current = null
      }
    }
  }, [isRecording])

  // Начало записи
  const startRecording = useCallback(async () => {
    try {
      // Если уже идет запись, останавливаем ее
      if (isRecording) {
        cleanupResources()
      }

      logDebug("Запуск записи с микрофона...")

      // Проверяем поддержку API
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Ваш браузер не поддерживает API для доступа к микрофону")
      }

      // Проверяем разрешение
      const permission = await checkPermission()
      if (permission === "denied") {
        throw new Error("Доступ к микрофону запрещен. П��жалуйста, разрешите доступ в настройках браузера.")
      }

      // Запрашиваем доступ к микрофону с оптимальными настройками для PCM16
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
          sampleRate: 24000, // 24kHz для соответствия требованиям OpenAI
        },
      })

      mediaStreamRef.current = stream
      logDebug("Доступ к микрофону получен")

      // Проверяем аудио треки
      const audioTracks = stream.getAudioTracks()
      if (audioTracks.length === 0) {
        throw new Error("Не удалось получить аудио треки с микрофона")
      }

      logDebug(`Получено аудио треков: ${audioTracks.length}`)
      logDebug(`Состояние первого трека: ${audioTracks[0].readyState}, включен: ${audioTracks[0].enabled}`)

      // Создаем AudioContext для анализа звука и обработки PCM
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 24000, // Устанавливаем частоту дискретизации 24kHz
      })
      audioContextRef.current = audioContext
      logDebug(`AudioContext создан, состояние: ${audioContext.state}, sampleRate: ${audioContext.sampleRate}`)

      // Если контекст в состоянии suspended, пытаемся его запустить
      if (audioContext.state === "suspended") {
        try {
          await audioContext.resume()
          logDebug(`AudioContext запущен, новое состояние: ${audioContext.state}`)
        } catch (resumeError) {
          logDebug(`Ошибка при запуске AudioContext: ${resumeError}`)
        }
      }

      // Создаем анализатор
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      analyserRef.current = analyser

      // Подключаем микрофон к анализатору
      const source = audioContext.createMediaStreamSource(stream)
      sourceRef.current = source
      source.connect(analyser)
      logDebug("Источник аудио подключен к анализатору")

      // Создаем ScriptProcessorNode для обработки аудио данных в реальном времени
      const processor = audioContext.createScriptProcessor(4096, 1, 1)
      processorRef.current = processor

      // Подключаем анализатор к процессору
      analyser.connect(processor)
      processor.connect(audioContext.destination)

      // Обработчик для получения аудио данных
      processor.onaudioprocess = (e) => {
        const inputBuffer = e.inputBuffer
        const inputData = inputBuffer.getChannelData(0)

        // Копируем данные, чтобы они не изменились
        const audioData = new Float32Array(inputData.length)
        audioData.set(inputData)

        // Вычисляем уровень звука для визуализации
        let sum = 0
        for (let i = 0; i < audioData.length; i++) {
          sum += audioData[i] * audioData[i]
        }
        const rms = Math.sqrt(sum / audioData.length)
        audioLevelRef.current = rms * 100

        // Отправляем аудио данные через колбэк
        options.onAudioData?.(audioData, audioContext.sampleRate)
      }

      // Определяем поддерживаемый формат аудио
      let mimeType = "audio/webm"

      // Проверяем поддержку форматов
      if (MediaRecorder.isTypeSupported("audio/webm;codecs=pcm")) {
        mimeType = "audio/webm;codecs=pcm" // PCM16 в контейнере webm
        logDebug("Используем audio/webm;codecs=pcm (PCM16)")
      } else if (MediaRecorder.isTypeSupported("audio/webm")) {
        mimeType = "audio/webm"
        logDebug("Используем audio/webm")
      } else {
        logDebug("Используем стандартный формат аудио")
      }

      // Очищаем предыдущие чанки
      chunksRef.current = []
      lastChunkTimeRef.current = Date.now()

      // Создаем MediaRecorder с настройками для качественной записи
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 256000, // Увеличиваем битрейт для лучшего качества
      })
      mediaRecorderRef.current = mediaRecorder
      logDebug(`MediaRecorder создан, состояние: ${mediaRecorder.state}, mimeType: ${mimeType}`)

      // Обработчик данных - оптимизирован для быстрой отправки
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          logDebug(`Получен аудио чанк размером ${event.data.size} байт`)
          chunksRef.current.push(event.data)

          // Отправляем аудио, если накопилось достаточно данных или прошло достаточно времени
          const now = Date.now()
          const timeSinceLastChunk = now - lastChunkTimeRef.current

          // Отправляем чаще - после каждого чанка, если он достаточного размера
          if (event.data.size > 500) {
            const audioBlob = new Blob([event.data], { type: mimeType })
            logDebug(`Отправляем одиночный аудио чанк размером ${audioBlob.size} байт`)
            options.onAudioAvailable?.(audioBlob)
            lastChunkTimeRef.current = now
          }
          // Или если накопилось несколько чанков
          else if (chunksRef.current.length >= 1 || timeSinceLastChunk > 500) {
            const audioBlob = new Blob(chunksRef.current, { type: mimeType })

            // Только если размер блоба достаточный, отправляем его
            if (audioBlob.size > 100) {
              logDebug(`Отправляем аудио блоб размером ${audioBlob.size} байт`)
              options.onAudioAvailable?.(audioBlob)
              lastChunkTimeRef.current = now
              chunksRef.current = [] // Очищаем после отправки
            }
          }
        }
      }

      // Обработчик остановки
      mediaRecorder.onstop = () => {
        logDebug("MediaRecorder остановлен")
        if (chunksRef.current.length > 0) {
          const totalSize = chunksRef.current.reduce((size, chunk) => size + chunk.size, 0)
          logDebug(`Собрано ${chunksRef.current.length} чанков общим размером ${totalSize} байт`)

          const audioBlob = new Blob(chunksRef.current, { type: mimeType })
          logDebug(`Создан аудио Blob размером ${audioBlob.size} байт`)

          // Только если размер блоба достаточный, отправляем его
          if (audioBlob.size > 100) {
            options.onAudioAvailable?.(audioBlob)
          } else {
            logDebug("Аудио блоб слишком маленький, игнорируем")
          }

          // Очищаем чанки
          chunksRef.current = []
        } else {
          logDebug("Нет данных для отправки")
        }
      }

      // Обработчик ошибок
      mediaRecorder.onerror = (event) => {
        logDebug(`Ошибка MediaRecorder: ${event}`)
        options.onError?.(new Error(`Ошибка записи: ${event}`))
      }

      // Начинаем запись с более коротким интервалом
      mediaRecorder.start(chunkDuration) // Используем более короткий интервал
      logDebug(`MediaRecorder запущен с интервалом ${chunkDuration}мс`)

      // Set recording state before starting the animation frame
      setIsRecording(true)

      // Define analyzeMicLevel function that updates the ref instead of state directly
      const analyzeMicLevel = () => {
        if (!analyserRef.current) {
          return
        }

        try {
          const analyser = analyserRef.current
          const dataArray = new Uint8Array(analyser.frequencyBinCount)
          analyser.getByteFrequencyData(dataArray)

          let sum = 0
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i]
          }
          const average = sum / dataArray.length

          // Update the ref instead of state directly
          audioLevelRef.current = average

          // Continue the animation loop only if we're still recording
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            animationFrameRef.current = requestAnimationFrame(analyzeMicLevel)
          }
        } catch (error) {
          logDebug(`Error in analyzeMicLevel: ${error}`)
          // Don't continue the animation loop on error
        }
      }

      // Start the animation loop
      analyzeMicLevel()
      logDebug("Анализ уровня звука запущен")
    } catch (error) {
      logDebug(`Ошибка при запуске записи: ${error}`)
      cleanupResources()
      options.onError?.(error instanceof Error ? error : new Error(String(error)))
    }
  }, [checkPermission, logDebug, options, isRecording, cleanupResources, chunkDuration])

  // Остановка записи
  const stopRecording = useCallback(() => {
    logDebug("Остановка записи с микрофона...")
    cleanupResources()
  }, [cleanupResources, logDebug])

  // Очистка ресурсов при размонтировании
  useEffect(() => {
    return () => {
      cleanupResources()
    }
  }, [cleanupResources])

  // Проверяем разрешение при монтировании
  useEffect(() => {
    checkPermission()
  }, [checkPermission])

  return {
    isRecording,
    audioLevel,
    permissionStatus,
    startRecording,
    stopRecording,
    checkPermission,
    debugInfo,
  }
}
