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
  try {
    console.log("Получен запрос на транскрипцию")

    // Проверяем API ключ
    if (!getServerEnv("OPENAI_API_KEY")) {
      console.error("API ключ OpenAI не найден")
      return NextResponse.json({ error: "API ключ OpenAI не настроен" }, { status: 500 })
    }

    const formData = await request.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      console.error("Аудиофайл не предоставлен")
      return NextResponse.json({ error: "Аудиофайл не предоставлен" }, { status: 400 })
    }

    console.log(`Получен аудиофайл: ${audioFile.name}, тип: ${audioFile.type}, размер: ${audioFile.size} байт`)

    // Преобразуем File в Blob для OpenAI API
    const buffer = Buffer.from(await audioFile.arrayBuffer())
    console.log(`Создан буфер размером ${buffer.length} байт`)

    // Создаем временный файл для OpenAI API с явным указанием расширения .webm
    const file = new File([buffer], "audio.webm", { type: "audio/webm" })
    console.log(`Создан File объект для OpenAI API: ${file.name}, тип: ${file.type}, размер: ${file.size} байт`)

    // Отправляем на распознавание в OpenAI с указанной моделью транскрипции
    console.log("Отправляем запрос в OpenAI API...")
    try {
      const transcription = await getOpenAI().audio.transcriptions.create({
        file: file,
        model: "whisper-1", // Используем whisper-1, так как он стабильно работает
        language: "ru",
        response_format: "text",
      })

      console.log(`Получена транскрипция: "${transcription}"`)
      return NextResponse.json({ text: transcription })
    } catch (openaiError: any) {
      console.error("Ошибка OpenAI API при транскрипции:", openaiError)
      return NextResponse.json(
        {
          error: "Ошибка при распознавании речи через OpenAI API",
          details: openaiError.message || String(openaiError),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in transcribe API:", error)
    return NextResponse.json(
      { error: "Произошла ошибка при распознавании речи", details: String(error) },
      { status: 500 },
    )
  }
}
