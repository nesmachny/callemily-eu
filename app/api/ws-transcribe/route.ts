import type { NextRequest } from "next/server"
import OpenAI from "openai"
import { WebSocketPair } from "next/server"
import { getServerEnv } from "@/lib/env-utils"

// Ленивая инициализация OpenAI API (чтобы билд проходил без ключа)
let _openai: OpenAI | null = null
function getOpenAI() {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: getServerEnv("OPENAI_API_KEY") })
  }
  return _openai
}

// Polyfill для Deno.upgradeWebSocket в среде Vercel
const Deno = {
  upgradeWebSocket: (request: NextRequest) => {
    const upgradeHeader = request.headers.get("upgrade")
    if (upgradeHeader !== "websocket") {
      return { response: new Response("Expected websocket!", { status: 400 }) }
    }

    const [client, server] = Object.values(new WebSocketPair())

    // Immediately wrap in try/catch to prevent unhandled promise rejection
    try {
      // Use a self-executing async function to handle the accept
      ;(async () => {
        try {
          // @ts-ignore: Deno types don't match web standard
          await server.accept()
        } catch (err) {
          console.error("server.accept error:", err)
        }
      })()
    } catch (error) {
      console.error("Error in WebSocket setup:", error)
    }

    const response = new Response(null, {
      status: 101,
      webSocket: client,
    })

    return { socket: server, response }
  },
}

export async function GET(request: NextRequest) {
  // Проверяем, что запрос поддерживает WebSocket
  if (!request.headers.get("upgrade")?.includes("websocket")) {
    return new Response("Требуется WebSocket соединение", { status: 426 })
  }

  try {
    // Создаем WebSocket соединение
    const { socket, response } = await new Promise<{ socket: WebSocket; response: Response }>((resolve) => {
      const result = Deno.upgradeWebSocket(request)
      resolve(result)
    })

    // Track socket state
    let isSocketConnected = true

    // Обработчик открытия соединения
    socket.onopen = () => {
      console.log("WebSocket соединение установлено")
      if (isSocketConnected) {
        try {
          socket.send(JSON.stringify({ type: "connected", message: "Соединение установлено" }))

          // Отправляем конфигурацию сессии
          socket.send(
            JSON.stringify({
              type: "transcription_session.update",
              session: {
                input_audio_format: "pcm16",
                turn_detection: { type: "server_vad", threshold: 0.5 },
                input_audio_transcription: { model: "whisper-1" },
              },
            }),
          )
        } catch (error) {
          console.error("Error sending initial messages:", error)
        }
      }
    }

    // Обработчик сообщений
    socket.onmessage = async (event) => {
      if (!isSocketConnected) return

      try {
        // Парсим данные
        const data = JSON.parse(event.data)

        if (data.type === "input_audio_buffer.append") {
          // Декодируем base64 аудио
          const audioBuffer = Buffer.from(data.audio, "base64")

          try {
            // Отправляем на распознавание в OpenAI через REST API
            // (так как WebSocket API требует дополнительной авторизации)
            const file = new File([audioBuffer], "audio-chunk.webm", { type: "audio/webm" })

            const transcription = await getOpenAI().audio.transcriptions.create({
              file: file,
              model: "whisper-1",
              language: "ru",
              response_format: "text",
              temperature: 0.0,
              prompt: "Это разговор с рестораном о бронировании столика.",
            })

            // Отправляем результат обратно клиенту
            if (isSocketConnected) {
              try {
                socket.send(
                  JSON.stringify({
                    type: "conversation.item.input_audio_transcription.delta",
                    delta: transcription,
                  }),
                )

                // Если транскрипция завершена (содержит знаки препинания в конце)
                if (/[.!?;:]$/.test(transcription.trim())) {
                  socket.send(
                    JSON.stringify({
                      type: "conversation.item.input_audio_transcription.completed",
                    }),
                  )
                }
              } catch (sendError) {
                console.error("Error sending transcription:", sendError)
                isSocketConnected = false
              }
            }
          } catch (openaiError) {
            console.error("Ошибка OpenAI API:", openaiError)
            if (isSocketConnected) {
              try {
                socket.send(
                  JSON.stringify({
                    type: "error",
                    error: "Ошибка при распознавании речи",
                    details: String(openaiError),
                  }),
                )
              } catch (sendError) {
                console.error("Error sending error message:", sendError)
                isSocketConnected = false
              }
            }
          }
        } else if (data.type === "input_audio_buffer.end") {
          // Клиент сигнализирует о завершении аудио потока
          if (isSocketConnected) {
            try {
              socket.send(
                JSON.stringify({
                  type: "conversation.item.input_audio_transcription.completed",
                }),
              )
            } catch (sendError) {
              console.error("Error sending completion message:", sendError)
              isSocketConnected = false
            }
          }
        }
      } catch (error) {
        console.error("Ошибка обработки сообщения:", error)
        if (isSocketConnected) {
          try {
            socket.send(JSON.stringify({ type: "error", error: "Ошибка обработки сообщения" }))
          } catch (sendError) {
            console.error("Error sending error message:", sendError)
            isSocketConnected = false
          }
        }
      }
    }

    // Обработчик закрытия соединения
    socket.onclose = () => {
      console.log("WebSocket соединение закрыто")
      isSocketConnected = false
    }

    // Обработчик ошибок
    socket.onerror = (error) => {
      console.error("Ошибка WebSocket:", error)
      isSocketConnected = false
    }

    return response
  } catch (error) {
    console.error("Ошибка при установке WebSocket соединения:", error)
    return new Response("Ошибка при установке WebSocket соединения", { status: 500 })
  }
}
