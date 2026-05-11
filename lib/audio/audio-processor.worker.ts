/**
 * Web Worker для обработки аудио в фоновом потоке
 * Адаптировано из реализации OpenAI realtime Voice
 */

import { AudioQueue } from "./audio-queue"

// Константы
const CHUNK_SIZE = 8192 // Размер чанка для отправки (как в OpenAI)
const SILENCE_THRESHOLD = 0.01 // Порог для определения тишины
const MIN_SPEECH_SAMPLES = 4000 // Минимальное количество сэмплов для считывания речи

// Очереди для разных типов данных
let processingQueue: AudioQueue<Float32Array> | null = null
let outputQueue: AudioQueue<Int16Array> | null = null
let speechDetected = false
let silentSamplesCount = 0

// Инициализация
self.onmessage = (event: MessageEvent) => {
  const { type, data } = event.data

  switch (type) {
    case "init":
      // Инициализация очередей
      processingQueue = new AudioQueue<Float32Array>(Float32Array)
      outputQueue = new AudioQueue<Int16Array>(Int16Array)
      self.postMessage({ type: "initialized" })
      break

    case "process":
      // Обработка аудио данных
      if (processingQueue) {
        const audioData = new Float32Array(data.buffer)
        processAudioData(audioData)
      }
      break

    case "clear":
      // Очистка очередей
      if (processingQueue) processingQueue.clear()
      if (outputQueue) outputQueue.clear()
      speechDetected = false
      silentSamplesCount = 0
      self.postMessage({ type: "cleared" })
      break

    case "getState":
      // Отправка текущего состояния
      self.postMessage({
        type: "state",
        speechDetected,
        silentSamplesCount,
        queueLength: processingQueue?.length || 0,
      })
      break
  }
}

/**
 * Обработка аудио данных
 */
function processAudioData(audioData: Float32Array): void {
  if (!processingQueue || !outputQueue) return

  // Добавляем данные в очередь обработки
  processingQueue.enqueue(audioData)

  // Анализируем аудио на наличие речи
  const isSilent = detectSilence(audioData)

  if (isSilent) {
    silentSamplesCount += audioData.length

    // Если была обнаружена речь и наступила тишина
    if (speechDetected && silentSamplesCount > 24000) {
      // ~1 секунда тишины при 24кГц
      // Извлекаем все данные из очереди
      if (processingQueue.length > 0) {
        const allData = processingQueue.dequeue(processingQueue.length)
        const processedData = floatToInt16(allData)

        // Отправляем данные обратно в основной поток
        self.postMessage(
          {
            type: "speechEnd",
            data: processedData.buffer,
            length: processedData.length,
          },
          [processedData.buffer],
        )

        // Сбрасываем состояние
        speechDetected = false
        silentSamplesCount = 0
      }
    }
  } else {
    // Если обнаружена речь
    speechDetected = true
    silentSamplesCount = 0

    // Если накопилось достаточно данных, отправляем чанк
    if (processingQueue.length >= CHUNK_SIZE) {
      const chunk = processingQueue.dequeue(CHUNK_SIZE)
      const processedChunk = floatToInt16(chunk)

      self.postMessage(
        {
          type: "chunk",
          data: processedChunk.buffer,
          length: processedChunk.length,
        },
        [processedChunk.buffer],
      )
    }
  }
}

/**
 * Определение тишины в аудио данных
 */
function detectSilence(audioData: Float32Array): boolean {
  let sum = 0
  for (let i = 0; i < audioData.length; i++) {
    sum += Math.abs(audioData[i])
  }
  const average = sum / audioData.length
  return average < SILENCE_THRESHOLD
}

/**
 * Конвертация Float32Array в Int16Array
 */
function floatToInt16(float32Array: Float32Array): Int16Array {
  const int16Array = new Int16Array(float32Array.length)
  for (let i = 0; i < float32Array.length; i++) {
    const sample = Math.max(-1, Math.min(1, float32Array[i]))
    int16Array[i] = sample < 0 ? sample * 32768 : sample * 32767
  }
  return int16Array
}
