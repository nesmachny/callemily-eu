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
  console.log("Получен запрос на синтез речи")

  try {
    // Проверяем API ключ
    if (!getServerEnv("OPENAI_API_KEY")) {
      console.error("API ключ OpenAI не найден")
      return NextResponse.json({ error: "API ключ OpenAI не настроен" }, { status: 500 })
    }

    // Получаем данные запроса
    const requestData = await request.json()
    const { text, voice } = requestData

    console.log(`Запрос на синтез речи: текст (${text?.length || 0} символов), голос: ${voice || "shimmer"}`)

    if (!text) {
      console.error("Текст не предоставлен")
      return NextResponse.json({ error: "Текст не предоставлен" }, { status: 400 })
    }

    // Проверяем допустимые голоса
    const validVoices = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"]
    const selectedVoice = validVoices.includes(voice) ? voice : "shimmer"

    console.log(`Используем голос: ${selectedVoice}`)
    console.log(`Отправляем запрос в OpenAI TTS API...`)

    try {
      // Используем OpenAI TTS API для генерации аудио
      const mp3 = await getOpenAI().audio.speech.create({
        model: "tts-1",
        voice: selectedVoice,
        input: text,
        speed: 1.0, // Нормальная скорость речи
      })

      console.log("Получен ответ от OpenAI TTS API")

      // Получаем аудио как ArrayBuffer
      const buffer = await mp3.arrayBuffer()
      console.log(`Получен аудио буфер размером ${buffer.byteLength} байт`)

      // Проверяем, что буфер не пустой
      if (buffer.byteLength === 0) {
        console.error("Получен пустой аудио буфер от OpenAI TTS API")
        return NextResponse.json({ error: "Получен пустой аудио буфер" }, { status: 500 })
      }

      // Добавляем подробные заголовки для корректной работы во всех браузерах
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "audio/mpeg",
          "Content-Length": buffer.byteLength.toString(),
          "Content-Disposition": 'inline; filename="speech.mp3"',
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
          "Accept-Ranges": "bytes",
          "X-Content-Type-Options": "nosniff",
          "Cross-Origin-Resource-Policy": "cross-origin",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token",
        },
      })
    } catch (openaiError: any) {
      console.error("Ошибка OpenAI TTS API:", openaiError)

      // Подробная обработка ошибок
      if (openaiError.status === 401) {
        return NextResponse.json({ error: "Неверный API ключ OpenAI" }, { status: 401 })
      } else if (openaiError.status === 429) {
        return NextResponse.json({ error: "Превышен лимит запросов к OpenAI API" }, { status: 429 })
      } else {
        return NextResponse.json(
          {
            error: "Ошибка при генерации речи через OpenAI API",
            details: openaiError.message || String(openaiError),
          },
          { status: 500 },
        )
      }
    }
  } catch (error: any) {
    console.error("Общая ошибка в speech API:", error)
    return NextResponse.json(
      {
        error: "Произошла ошибка при генерации речи",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
