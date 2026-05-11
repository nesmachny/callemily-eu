import { NextResponse } from "next/server"
import OpenAI from "openai"
import { writeFile } from "fs/promises"
import { join } from "path"
import { tmpdir } from "os"
import { randomUUID } from "crypto"
import { getServerEnv } from "@/lib/env-utils"

// Ленивая инициализация OpenAI API (чтобы билд проходил без ключа)
let _openai: OpenAI | null = null
function getOpenAI() {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: getServerEnv("OPENAI_API_KEY") })
  }
  return _openai
}

// Кэш для хранения аудио чанков для дебаггинга
const DEBUG_CACHE: { [key: string]: Buffer[] } = {}

export async function POST(request: Request) {
  try {
    console.log("Получен запрос на потоковую транскрипцию")

    // Проверяем API ключ
    if (!getServerEnv("OPENAI_API_KEY")) {
      console.error("API ключ OpenAI не найден")
      return NextResponse.json({ error: "API ключ OpenAI не настроен" }, { status: 500 })
    }

    const formData = await request.formData()
    const audioChunk = formData.get("audio") as File
    const sessionId = (formData.get("sessionId") as string) || randomUUID()

    if (!audioChunk) {
      console.error("Аудиофайл не предоставлен")
      return NextResponse.json({ error: "Аудиофайл не предоставлен" }, { status: 400 })
    }

    console.log(
      `Получен аудио чанк: ${audioChunk.name}, тип: ${audioChunk.type}, размер: ${audioChunk.size} байт, sessionId: ${sessionId}`,
    )

    // Проверяем размер аудио чанка
    if (audioChunk.size < 10) {
      console.log("Аудио чанк слишком маленький, возможно тишина")
      return NextResponse.json({ text: "", status: "empty" })
    }

    // Преобразуем File в Buffer для OpenAI API
    const buffer = Buffer.from(await audioChunk.arrayBuffer())
    console.log(`Создан буфер размером ${buffer.length} байт`)

    // Для отладки сохраняем чанк в кэш
    if (!DEBUG_CACHE[sessionId]) {
      DEBUG_CACHE[sessionId] = []
    }
    DEBUG_CACHE[sessionId].push(buffer)

    // Если накопилось слишком много чанков, сохраняем их на диск и очищаем кэш
    if (DEBUG_CACHE[sessionId].length >= 10) {
      try {
        const combinedBuffer = Buffer.concat(DEBUG_CACHE[sessionId])
        const tempFilePath = join(tmpdir(), `audio-session-${sessionId}.webm`)
        await writeFile(tempFilePath, combinedBuffer)
        console.log(`Аудио сессия сохранена для отладки: ${tempFilePath}`)
        DEBUG_CACHE[sessionId] = []
      } catch (error) {
        console.error("Ошибка при сохранении файла для отладки:", error)
      }
    }

    // Создаем временный файл для OpenAI API
    const file = new File([buffer], "audio-chunk.webm", { type: audioChunk.type })
    console.log(`Создан File объект для OpenAI API: ${file.name}, тип: ${file.type}, размер: ${file.size} байт`)

    try {
      // Отправляем на распознавание в OpenAI
      console.log("Отправляем запрос в OpenAI API...")
      const transcription = await getOpenAI().audio.transcriptions.create({
        file: file,
        model: "gpt-4o-mini-transcribe",
        language: "ru",
        response_format: "text",
        noise_reduction: "near_field",
      })

      console.log(`Получена транскрипция: "${transcription}"`)

      // Если транскрипция пустая, возвращаем специальный статус
      if (!transcription || transcription.trim() === "") {
        return NextResponse.json({ text: "", status: "empty" })
      }

      return NextResponse.json({ text: transcription, status: "success", sessionId })
    } catch (openaiError: any) {
      console.error("Ошибка OpenAI API:", openaiError)

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
    console.error("Error in stream-audio API:", error)
    return NextResponse.json(
      { error: "Произошла ошибка при распознавании речи", details: String(error) },
      { status: 500 },
    )
  }
}
