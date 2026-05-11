/**
 * Эффективная очередь для буферизации аудио данных
 * Адаптировано из реализации OpenAI realtime Voice
 */
export class AudioQueue<T extends Float32Array | Int16Array> {
  private chunks: T[] = []
  private readIndex = 0
  private readOffset = 0
  private totalLength = 0
  private TypedArrayConstructor: new (
    length: number,
  ) => T

  constructor(typedArrayConstructor: new (length: number) => T) {
    this.TypedArrayConstructor = typedArrayConstructor
  }

  /**
   * Очистить очередь
   */
  clear(): void {
    this.chunks = []
    this.totalLength = 0
    this.readIndex = 0
    this.readOffset = 0
  }

  /**
   * Добавить данные в очередь
   */
  enqueue(chunk: T): void {
    if (chunk.length === 0) return
    this.chunks.push(chunk)
    this.totalLength += chunk.length
  }

  /**
   * Извлечь данные из очереди
   */
  dequeue(count: number): T {
    if (count <= 0) {
      throw new Error("Invalid argument: 'count' must be a positive integer")
    }

    const result = new this.TypedArrayConstructor(count)
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

    // Очищаем обработанные чанки для освобождения памяти
    if (this.readIndex > 0) {
      this.chunks.splice(0, this.readIndex)
      this.readIndex = 0
    }

    return result
  }

  /**
   * Получить текущую длину очереди
   */
  get length(): number {
    return this.totalLength
  }
}
