// public/audio-player-processor.js
// Cache Buster: 1717100000000
console.log(`%%%%% AudioPlayerProcessor WORKLET SCRIPT LOADED - Timestamp: 1717100000000 %%%%%`)

class AudioQueue {
  chunks = []
  readIndex = 0
  readOffset = 0
  totalLength = 0

  constructor() {
    // console.log("AudioQueue: Constructor");
  }

  clear() {
    // console.log("AudioQueue: Clear");
    this.chunks = []
    this.totalLength = 0
    this.readIndex = 0
    this.readOffset = 0
  }

  enqueue(chunk) {
    if (!chunk || chunk.length === 0) return
    // console.log("AudioQueue: Enqueue chunk length:", chunk.length);
    this.chunks.push(chunk)
    this.totalLength += chunk.length
  }

  dequeue(count) {
    if (count <= 0) {
      // console.warn('AudioQueue: dequeue called with non-positive count:', count);
      return new Float32Array(0)
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

    // console.log("AudioQueue: Dequeue requested:", count, "dequeued:", offset);
    if (offset < count) {
      return result.subarray(0, offset)
    }
    return result
  }

  get length() {
    return this.totalLength
  }
}

class AudioPlayerProcessor extends AudioWorkletProcessor {
  queue
  state
  lastEmittedTime
  currentTimeVal
  isDisconnected = false
  processorId = Math.random().toString(36).substring(2, 7)
  sampleRateHz = globalThis.sampleRate || 24000

  constructor(options) {
    super(options)
    console.log(
      `%%%%% AudioPlayerProcessor [${this.processorId}] CONSTRUCTOR LOADED - Timestamp: 1717100000000. Sample Rate: ${this.sampleRateHz} %%%%%`,
      options,
    )
    this.queue = new AudioQueue()
    this.state = "idle"
    this.lastEmittedTime = 0
    this.currentTimeVal = 0

    this.port.onmessage = (event) => {
      if (this.isDisconnected) return

      try {
        const data = event.data

        if (data.type === "disconnect") {
          console.log(`AudioPlayerProcessor [${this.processorId}]: Received disconnect message.`)
          this.isDisconnected = true
          // Optionally, you can call this.port.close() here if the spec allows,
          // but typically main thread manages port lifecycle.
          // For safety, just stop processing and posting messages.
          return
        }

        if (data.audioData) {
          if (this.queue.length === 0 && this.state !== "playing") {
            this._safePostMessage({ state: "playing", processorId: this.processorId })
          }
          this.queue.enqueue(data.audioData)
        }

        if (data.play && this.state === "paused") {
          if (this.queue.length === 0) {
            this.state = "idle"
            this._safePostMessage({ state: "idle", processorId: this.processorId })
          } else {
            this.state = "playing"
            this._safePostMessage({ state: "playing", processorId: this.processorId })
          }
        }

        if (data.pause && this.state !== "paused") {
          this.state = "paused"
          this._safePostMessage({ state: "paused", processorId: this.processorId })
        }

        if (data.clear) {
          this.queue.clear()
          this.currentTimeVal = 0
          this.state = "idle"
          this._safePostMessage({ state: "idle", currentTime: 0, processorId: this.processorId })
        }
      } catch (error) {
        console.error(
          `AudioPlayerProcessor [${this.processorId}]: Error in onmessage logic:`,
          error,
          "Data:",
          event.data,
        )
        this.isDisconnected = true
      }
    }

    this.port.onmessageerror = (event) => {
      console.error(`AudioPlayerProcessor [${this.processorId}]: onmessageerror - event:`, event)
      this.isDisconnected = true
    }
  }

  _safePostMessage(message) {
    try {
      if (!this.port || this.isDisconnected) {
        // console.warn( // Keep this commented unless actively debugging to reduce console noise
        //   `AudioPlayerProcessor [${this.processorId}]: Port not available or disconnected. Message not sent:`,
        //   message,
        // );
        return
      }
      this.port.postMessage(message)
    } catch (e) {
      console.error(
        `AudioPlayerProcessor [${this.processorId}]: !!! _safePostMessage CAUGHT ERROR !!!`,
        "Error:",
        e,
        "Message:",
        message,
      )
      this.isDisconnected = true
    }
  }

  process(inputs, outputs, parameters) {
    if (this.isDisconnected) {
      // Ensure output buffers are zeroed out if we stop processing mid-way
      // though returning false should stop further calls.
      const outputChannel = outputs[0]?.[0]
      if (outputChannel) {
        outputChannel.fill(0)
      }
      return false // Signal to stop processing
    }

    try {
      const outputChannel = outputs[0]?.[0]
      if (!outputChannel) {
        return !this.isDisconnected // Continue if not disconnected, but no output channel
      }

      if (this.state === "paused") {
        outputChannel.fill(0)
        return true // Continue processing (stay paused)
      }

      if (this.queue.length > 0) {
        const dataToDequeue = Math.min(this.queue.length, outputChannel.length)
        if (dataToDequeue <= 0) {
          outputChannel.fill(0)
          return true // Continue processing (queue might fill later)
        }
        const data = this.queue.dequeue(dataToDequeue)

        if (data.length > 0) {
          outputChannel.set(data)
        }

        // Fill remaining part of the buffer with silence if dequeued data is less
        if (data.length < outputChannel.length) {
          outputChannel.fill(0, data.length)
        }

        this.currentTimeVal += data.length / this.sampleRateHz

        if (this.state === "idle") {
          this.state = "playing"
          this._safePostMessage({ state: "playing", currentTime: this.currentTimeVal, processorId: this.processorId })
        } else if (this.queue.length === 0) {
          // Became empty after dequeuing
          this.state = "idle"
          this._safePostMessage({ state: "idle", currentTime: 0, processorId: this.processorId })
          this.currentTimeVal = 0
        } else if (this.currentTimeVal - this.lastEmittedTime > 0.5) {
          this.lastEmittedTime = this.currentTimeVal
          this._safePostMessage({ currentTime: this.currentTimeVal, processorId: this.processorId })
        }
      } else {
        outputChannel.fill(0) // Queue is empty, output silence
      }
      return !this.isDisconnected // Continue processing if not disconnected
    } catch (error) {
      console.error(`AudioPlayerProcessor [${this.processorId}]: Unhandled error in process method:`, error)
      this.isDisconnected = true
      return false // Signal to stop processing on error
    }
  }
}

try {
  registerProcessor("audio-player", AudioPlayerProcessor)
  console.log("AudioWorkletGlobalScope: Processor 'audio-player' registered successfully.")
} catch (e) {
  console.error("AudioWorkletGlobalScope: Failed to register processor 'audio-player'.", e)
}
