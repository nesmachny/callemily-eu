/**
 * AudioWorkletProcessor для воспроизведения аудио
 * Адаптировано из реализации OpenAI realtime Voice
 */

// Класс очереди для аудио данных
class AudioQueue {
  chunks: Float32Array[] = []
  readIndex = 0
  readOffset = 0
  totalLength = 0

  clear() {
    this.chunks = []
    this.totalLength = 0
    this.readIndex = 0
    this.readOffset = 0
  }

  enqueue(chunk: Float32Array) {
    if (chunk.length === 0) return
    this.chunks.push(chunk)
    this.totalLength += chunk.length
  }

  dequeue(count: number): Float32Array {
    if (count <= 0) {
      throw new Error("Invalid argument: 'count' must be a positive integer")
    }

    const result = new Float32Array(count)
    let offset = 0

    while (offset < count && this.readIndex < this.chunks.length) {
      const chunk = this.chunks[this.readIndex]
      const remaining = chunk.length - this.readOffset
      const toCopy = Math.min(remaining, count - offset)

      result.set(chunk.subarray(this.readOffset, this.readOffset + toCopy), offset)
      this.readOffset += toCopy
      offset += toCopy

      if (this.readOffset >= chunk.length) {
        this.readIndex += 1
        this.readOffset = 0
      }
    }

    this.totalLength -= offset

    if (this.readIndex > 0) {
      this.chunks.splice(0, this.readIndex)
      this.readIndex = 0
    }

    return result
  }

  get length() {
    return this.totalLength
  }
}

// AudioWorkletProcessor для воспроизведения аудио
class AudioPlayerProcessor extends AudioWorkletProcessor {
  queue: AudioQueue
  state: "idle" | "playing" | "paused"
  lastEmittedTime: number
  currentTime: number

  constructor() {
    super()
    this.queue = new AudioQueue()
    this.state = "idle"
    this.lastEmittedTime = 0
    this.currentTime = 0

    this.port.onmessage = (event) => {
      const data = event.data

      // Обработка аудио данных
      if (data.audioData) {
        if (this.queue.length === 0) {
          this.port.postMessage({ state: "playing" })
        }
        this.queue.enqueue(data.audioData)
      }

      // Управление воспроизведением
      if (data.play && this.state === "paused") {
        if (this.queue.length === 0) {
          this.state = "idle"
          this.port.postMessage({ state: "idle" })
        } else {
          this.state = "playing"
          this.port.postMessage({ state: "playing" })
        }
      }

      if (data.pause && this.state !== "paused") {
        this.state = "paused"
        this.port.postMessage({ state: "paused" })
      }

      if (data.clear && this.queue.length > 0) {
        this.queue.clear()
        this.currentTime = 0
        this.state = "idle"
        this.port.postMessage({ state: "idle", currentTime: 0 })
      }
    }
  }

  process(inputs: Float32Array[][], outputs: Float32Array[][]) {
    const output = outputs[0][0]

    if (this.state === "paused") {
      return true
    }

    if (this.queue.length > 0) {
      const data = this.queue.dequeue(output.length)
      output.set(data)

      this.currentTime += data.length / 24000 // Предполагаем частоту дискретизации 24 кГц

      if (this.state === "idle") {
        this.state = "playing"
        this.port.postMessage({ state: "playing", currentTime: this.currentTime })
      } else if (this.queue.length === 0) {
        this.state = "idle"
        this.port.postMessage({ state: "idle", currentTime: 0 })
        this.currentTime = 0
      } else if (this.currentTime - this.lastEmittedTime > 0.5) {
        this.lastEmittedTime = this.currentTime
        this.port.postMessage({ currentTime: this.currentTime })
      }
    }

    return true
  }
}

registerProcessor("audio-player", AudioPlayerProcessor)
