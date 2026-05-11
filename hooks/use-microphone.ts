"use client"

import { useState, useRef, useEffect, useCallback } from "react"

interface UseMicrophoneOptions {
  onAudioAvailable?: (blob: Blob) => void
  onError?: (error: Error) => void
}

export function useMicrophone(options: UseMicrophoneOptions = {}) {
  const [isRecording, setIsRecording] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [permissionStatus, setPermissionStatus] = useState<PermissionState | "unknown">("unknown")

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const chunksRef = useRef<Blob[]>([])

  // Проверка разрешения на доступ к микрофону
  const checkPermission = useCallback(async () => {
    try {
      if (!navigator.permissions || !navigator.permissions.query) {
        console.log("Permissions API не поддерживается")
        return "unknown"
      }

      const result = await navigator.permissions.query({ name: "microphone" as PermissionName })
      console.log(`Статус разрешения микрофона: ${result.state}`)
      setPermissionStatus(result.state)
      return result.state
    } catch (error) {
      console.error("Ошибка при проверке разрешения:", error)
      return "unknown"
    }
  }, [])

  // Анализ уровня звука
  const analyzeAudioLevel = useCallback(() => {
    if (!analyserRef.current || !isRecording) return

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

    // Продолжаем анализ в следующем кадре
    animationFrameRef.current = requestAnimationFrame(analyzeAudioLevel)
  }, [isRecording])

  // Начало записи
  const startRecording = useCallback(async () => {
    try {
      console.log("Запуск записи с микрофона...")

      // Проверяем поддержку API
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Ваш браузер не поддерживает API для доступа к микрофону")
      }

      // Проверяем разрешение
      const permission = await checkPermission()
      if (permission === "denied") {
        throw new Error("Доступ к микрофону запрещен. Пожалуйста, разрешите доступ в настройках браузера.")
      }

      // Запрашиваем доступ к микрофону
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })

      mediaStreamRef.current = stream
      console.log("Доступ к микрофону получен")

      // Создаем AudioContext для анализа звука
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      audioContextRef.current = audioContext

      // Создаем анализатор
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      analyserRef.current = analyser

      // Подключаем микрофон к анализатору
      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)

      // Создаем MediaRecorder
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      // Очищаем предыдущие чанки
      chunksRef.current = []

      // Обработчик данных
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      // Обработчик остановки
      mediaRecorder.onstop = () => {
        if (chunksRef.current.length > 0) {
          const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" })
          options.onAudioAvailable?.(audioBlob)
          chunksRef.current = []
        }
      }

      // Начинаем запись
      mediaRecorder.start(1000) // Получаем данные каждую секунду
      setIsRecording(true)

      // Запускаем анализ уровня звука
      animationFrameRef.current = requestAnimationFrame(analyzeAudioLevel)

      console.log("Запись с микрофона запущена")
    } catch (error) {
      console.error("Ошибка при запуске записи:", error)
      options.onError?.(error instanceof Error ? error : new Error(String(error)))
    }
  }, [analyzeAudioLevel, checkPermission, options])

  // Остановка записи
  const stopRecording = useCallback(() => {
    console.log("Остановка записи с микрофона...")

    // Останавливаем анализ звука
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    // Останавливаем MediaRecorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
    }

    // Останавливаем медиа потоки
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop())
      mediaStreamRef.current = null
    }

    // Закрываем AudioContext
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(console.error)
      audioContextRef.current = null
    }

    setIsRecording(false)
    setAudioLevel(0)
    console.log("Запись с микрофона остановлена")
  }, [])

  // Очистка ресурсов при размонтировании
  useEffect(() => {
    return () => {
      stopRecording()
    }
  }, [stopRecording])

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
  }
}
