import { NextResponse } from "next/server"
import OpenAI from "openai"
import { getServerEnv } from "@/lib/env-utils"

// Ленивая инициализация OpenAI API (чтобы билд проходил без ключа)
let _openai: OpenAI | null = null
function getOpenAI() {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: getServerEnv("OPENAI_API_KEY") })
  }
  return _openai
}

export async function POST(request: Request) {
  // Устанавливаем таймаут для запроса
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 секунд таймаут

  try {
    console.log("Получен запрос на потоковую транскрипцию")

    // Проверяем API ключ
    if (!getServerEnv("OPENAI_API_KEY")) {
      console.error("API ключ OpenAI не найден")
      clearTimeout(timeoutId)
      return NextResponse.json({ error: "API ключ OpenAI не настроен" }, { status: 500 })
    }

    const formData = await request.formData()
    const audioChunk = formData.get("audio") as File

    if (!audioChunk) {
      console.error("Аудиофайл не предоставлен")
      clearTimeout(timeoutId)
      return NextResponse.json({ error: "Аудиофайл не предоставлен" }, { status: 400 })
    }

    console.log(`Получен аудио чанк: ${audioChunk.name}, тип: ${audioChunk.type}, размер: ${audioChunk.size} байт`)

    // Проверяем размер аудио чанка
    if (audioChunk.size < 10) {
      console.log("Аудио чанк слишком маленький, возможно тишина")
      clearTimeout(timeoutId)
      return NextResponse.json({ text: "", status: "empty" })
    }

    // Преобразуем File в Buffer для OpenAI API
    const buffer = Buffer.from(await audioChunk.arrayBuffer())
    console.log(`Создан буфер размером ${buffer.length} байт`)

    // Создаем временный файл для OpenAI API с явным указанием расширения .webm
    // Важно: используем простой MIME тип без указания кодека
    const file = new File([buffer], "audio-chunk.webm", { type: "audio/webm" })
    console.log(`Создан File объект для OpenAI API: ${file.name}, тип: ${file.type}, размер: ${file.size} байт`)

    try {
      // Отправляем на распознавание в OpenAI
      console.log("Отправляем запрос в OpenAI API...")
      const transcription = await getOpenAI().audio.transcriptions.create(
        {
          file: file,
          model: "whisper-1", // Используем whisper-1, так как он стабильно работает
          language: "ru",
          response_format: "text",
          // Добавляем параметры для улучшения качества транскрипции
          temperature: 0.0, // Низкая температура для более точной транскрипции
          prompt: "Это разговор с рестораном о бронировании столика.", // Контекстный промпт
        },
        { signal: controller.signal },
      )

      console.log(`Получена транскрипция: "${transcription}"`)
      clearTimeout(timeoutId)

      // Если транскрипция пустая, возвращаем специальный статус
      if (!transcription || transcription.trim() === "") {
        return NextResponse.json({ text: "", status: "empty" })
      }

      return NextResponse.json({ text: transcription, status: "success" })
    } catch (openaiError: any) {
      console.error("Ошибка OpenAI API:", openaiError)
      clearTimeout(timeoutId)

      // Проверяем тип ошибки и возвращаем соответствующий ответ
      if (openaiError.status === 401) {
        return NextResponse.json({ error: "Неверный API ключ OpenAI" }, { status: 401 })
      } else if (openaiError.status === 429) {
        return NextResponse.json({ error: "Превышен лимит запросов к OpenAI API" }, { status: 429 })
      } else {
        return NextResponse.json(
          {
            error: "Ошибка при распознавании речи через OpenAI API",
            details: openaiError.message || String(openaiError),
          },
          { status: 500 },
        )
      }
    }
  } catch (error: any) {
    clearTimeout(timeoutId)
    console.error("Error in stream-transcribe API:", error)

    // Проверяем, была ли ошибка вызвана таймаутом
    if (error.name === "AbortError") {
      return NextResponse.json({ error: "Превышено время ожидания ответа" }, { status: 408 })
    }

    return NextResponse.json(
      { error: "Произошла ошибка при распознавании речи", details: String(error) },
      { status: 500 },
    )
  }
}
