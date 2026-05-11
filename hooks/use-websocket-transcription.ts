"use client"

import { useState, useRef, useEffect, useCallback } from "react"

interface UseWebSocketTranscriptionOptions {
  onTranscription?: (text: string, isComplete: boolean) => void
  onError?: (error: Error) => void
  onStatusChange?: (status: "connecting" | "connected" | "disconnected" | "error") => void
}

// Константы для работы с аудио
const TARGET_SR = 24000 // 24 кГц
const PCM_SCALE = 32767 // Масштаб для 16-бит PCM
const CHUNK_SAMPLES = 3072 // ~128 мс при 24 кГц

export function useWebSocketTranscription(options: UseWebSocketTranscriptionOptions = {}) {
  const [status, setStatus] = useState<"connecting" | "connected" | "disconnected" | "error">("disconnected")
  const socketRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const currentTranscriptRef = useRef<string[]>([])
  const isConnectedRef = useRef<boolean>(false)

  // Функция для преобразования Float32Array в 16-бит PCM
  const float32ToPCM16 = useCallback((float32Array: Float32Array): ArrayBuffer => {
    const pcm16 = new Int16Array(float32Array.length)
    for (let i = 0; i < float32Array.length; i++) {
      // Ограничиваем значения между -1.0 и 1.0
      const sample = Math.max(-1.0, Math.min(1.0, float32Array[i]))
      // Преобразуем в 16-бит PCM (little-endian)
      pcm16[i] = Math.round(sample * PCM_SCALE)
    }
    return pcm16.buffer
  }, [])

  // Функция для кодирования аудио в base64
  const base64EncodeAudio = useCallback(
    (float32Array: Float32Array): string => {
      try {
        const pcmBuffer = float32ToPCM16(float32Array)
        // Преобразуем ArrayBuffer в строку base64
        return btoa(String.fromCharCode(...new Uint8Array(pcmBuffer)))
      } catch (error) {
        console.error("Error encoding audio to base64:", error)
        return ""
      }
    },
    [float32ToPCM16],
  )

  // Функция для ресемплирования аудио до 24 кГц
  const resampleAudio = useCallback(
    async (audioData: Float32Array, originalSampleRate: number): Promise<Float32Array> => {
      if (originalSampleRate === TARGET_SR) {
        return audioData
      }

      try {
        // Простой линейный ресемплер (для более сложных случаев лучше использовать библиотеку)
        const ratio = TARGET_SR / originalSampleRate
        const outputLength = Math.floor(audioData.length * ratio)
        const result = new Float32Array(outputLength)

        for (let i = 0; i < outputLength; i++) {
          const srcIdx = i / ratio
          const srcIdxFloor = Math.floor(srcIdx)
          const srcIdxCeil = Math.min(srcIdxFloor + 1, audioData.length - 1)
          const frac = srcIdx - srcIdxFloor

          // Линейная интерполяция
          result[i] = audioData[srcIdxFloor] * (1 - frac) + audioData[srcIdxCeil] * frac
        }

        return result
      } catch (error) {
        console.error("Error resampling audio:", error)
        return new Float32Array(0)
      }
    },
    [],
  )

  // Функция для установки соединения
  const connect = useCallback(() => {
    try {
      // Закрываем предыдущее соединение, если оно существует
      if (socketRef.current) {
        try {
          if (socketRef.current.readyState !== WebSocket.CLOSED) {
            socketRef.current.close()
          }
        } catch (error) {
          console.error("Error closing previous WebSocket:", error)
        }
        socketRef.current = null
      }

      setStatus("connecting")
      options.onStatusChange?.("connecting")
      isConnectedRef.current = false

      // Создаем новое WebSocket соединение
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
      const wsUrl = `${protocol}//${window.location.host}/api/ws-transcribe`

      try {
        const socket = new WebSocket(wsUrl)
        socketRef.current = socket

        // Сбрасываем текущую транскрипцию
        currentTranscriptRef.current = []

        // Обработчик открытия соединения
        socket.onopen = () => {
          console.log("WebSocket соединение установлено")
          setStatus("connected")
          options.onStatusChange?.("connected")
          isConnectedRef.current = true
        }

        // Обработчик сообщений
        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)

            if (data.type === "conversation.item.input_audio_transcription.delta" && data.delta) {
              // Добавляем дельту к текущей транскрипции
              currentTranscriptRef.current.push(data.delta)
              // Вызываем колбэк с текущей транскрипцией
              options.onTranscription?.(data.delta, false)
            } else if (data.type === "conversation.item.input_audio_transcription.completed") {
              // Транскрипция завершена, отправляем полный текст
              const fullTranscript = currentTranscriptRef.current.join("")
              options.onTranscription?.(fullTranscript, true)
              // Сбрасываем текущую транскрипцию
              currentTranscriptRef.current = []
            } else if (data.type === "error") {
              console.error("Ошибка от сервера:", data.error, data.details)
              options.onError?.(new Error(data.error))
            }
          } catch (error) {
            console.error("Ошибка при обработке сообщения:", error)
          }
        }

        // Обработчик закрытия соединения
        socket.onclose = (event) => {
          console.log(`WebSocket соединение закрыто: ${event.code} ${event.reason}`)
          setStatus("disconnected")
          options.onStatusChange?.("disconnected")
          isConnectedRef.current = false

          // Если есть незавершенная транскрипция, отправляем ее
          if (currentTranscriptRef.current.length > 0) {
            const fullTranscript = currentTranscriptRef.current.join("")
            options.onTranscription?.(fullTranscript, true)
            currentTranscriptRef.current = []
          }

          // Автоматическое переподключение через 3 секунды
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current)
          }
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log("Попытка переподключения...")
            connect()
          }, 3000)
        }

        // Обработчик ошибок
        socket.onerror = (error) => {
          console.error("Ошибка WebSocket:", error)
          setStatus("error")
          options.onStatusChange?.("error")
          options.onError?.(new Error("Ошибка WebSocket соединения"))
          isConnectedRef.current = false
        }
      } catch (socketError) {
        console.error("Error creating WebSocket:", socketError)
        setStatus("error")
        options.onStatusChange?.("error")
        options.onError?.(new Error("Failed to create WebSocket connection"))
      }
    } catch (error) {
      console.error("Ошибка при установке WebSocket соединения:", error)
      setStatus("error")
      options.onStatusChange?.("error")
      options.onError?.(error instanceof Error ? error : new Error(String(error)))
    }
  }, [options])

  // Функция для отправки аудио данных
  const sendAudio = useCallback(
    async (audioData: Float32Array, sampleRate = 44100) => {
      if (!socketRef.current || !isConnectedRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
        console.warn("WebSocket соединение не установлено")
        return false
      }

      try {
        // Ресемплируем аудио до 24 кГц, если необходимо
        const resampledAudio = await resampleAudio(audioData, sampleRate)

        if (resampledAudio.length === 0) {
          return false
        }

        // Разбиваем на чанки по CHUNK_SAMPLES
        for (let i = 0; i < resampledAudio.length; i += CHUNK_SAMPLES) {
          if (!isConnectedRef.current || socketRef.current?.readyState !== WebSocket.OPEN) {
            console.warn("WebSocket connection lost during audio sending")
            return false
          }

          const chunk = resampledAudio.slice(i, i + CHUNK_SAMPLES)
          const base64Audio = base64EncodeAudio(chunk)

          if (!base64Audio) continue

          try {
            // Отправляем чанк
            socketRef.current?.send(
              JSON.stringify({
                type: "input_audio_buffer.append",
                audio: base64Audio,
              }),
            )

            // Добавляем небольшую задержку для имитации реального времени
            await new Promise((resolve) => setTimeout(resolve, 25)) // 25 мс задержка
          } catch (sendError) {
            console.error("Error sending audio chunk:", sendError)
            isConnectedRef.current = false
            return false
          }
        }

        // Сигнализируем о завершении аудио потока
        if (isConnectedRef.current && socketRef.current?.readyState === WebSocket.OPEN) {
          try {
            socketRef.current?.send(
              JSON.stringify({
                type: "input_audio_buffer.end",
              }),
            )
          } catch (sendError) {
            console.error("Error sending audio end signal:", sendError)
            isConnectedRef.current = false
            return false
          }
        }

        return true
      } catch (error) {
        console.error("Ошибка при отправке аудио:", error)
        options.onError?.(error instanceof Error ? error : new Error(String(error)))
        return false
      }
    },
    [options, resampleAudio, base64EncodeAudio],
  )

  // Функция для отправки аудио из Blob
  const sendAudioBlob = useCallback(
    async (audioBlob: Blob) => {
      try {
        // Преобразуем Blob в ArrayBuffer
        const arrayBuffer = await audioBlob.arrayBuffer()

        // Преобразуем ArrayBuffer в Float32Array
        // Предполагаем, что аудио в формате 16-бит PCM
        const int16Array = new Int16Array(arrayBuffer)
        const float32Array = new Float32Array(int16Array.length)

        // Нормализуем значения до диапазона [-1, 1]
        for (let i = 0; i < int16Array.length; i++) {
          float32Array[i] = int16Array[i] / 32768.0
        }

        // Отправляем аудио данные
        return await sendAudio(float32Array, 44100) // Предполагаем частоту дискретизации 44.1 кГц
      } catch (error) {
        console.error("Ошибка при обработке аудио Blob:", error)
        options.onError?.(error instanceof Error ? error : new Error(String(error)))
        return false
      }
    },
    [sendAudio, options],
  )

  // Функция для закрытия соединения
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      try {
        socketRef.current.onclose = null // Remove the onclose handler to prevent reconnection
        socketRef.current.onerror = null // Remove the onerror handler
        socketRef.current.onmessage = null // Remove the onmessage handler

        if (socketRef.current.readyState !== WebSocket.CLOSED) {
          socketRef.current.close()
        }
      } catch (error) {
        console.error("Error closing WebSocket:", error)
      }
      socketRef.current = null
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    isConnectedRef.current = false
    setStatus("disconnected")
    options.onStatusChange?.("disconnected")
  }, [options])

  // Очистка ресурсов при размонтировании
  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  return {
    status,
    connect,
    disconnect,
    sendAudio,
    sendAudioBlob,
  }
}
