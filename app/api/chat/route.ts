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
    const { messages } = await request.json()

    // Проверяем API ключ
    if (!getServerEnv("OPENAI_API_KEY")) {
      console.error("API ключ OpenAI не найден")
      return NextResponse.json({ error: "API ключ OpenAI не настроен" }, { status: 500 })
    }

    console.log("Отправляем запрос в OpenAI API...")

    // Добавляем системное сообщение для контекста
    const fullMessages = [
      {
        role: "system",
        content: `Ты - голосовой помощник CallEmily для ресторана "Вкусный уголок". 
        Твоя задача - помогать клиентам с бронированием столиков, отвечать на вопросы о меню, часах работы и специальных предложениях.
        
        Информация о ресторане:
        - Название: "Вкусный уголок"
        - Адрес: ул. Пушкина, д. 10, Москва
        - Часы работы: Пн-Чт: 12:00-23:00, Пт-Сб: 12:00-01:00, Вс: 12:00-22:00
        - Кухня: Европейская, Русская, Итальянская
        - Средний чек: 2000 рублей на человека
        - Особенности: Летняя веранда, детская комната, живая музыка по пятницам и субботам
        
        Правила бронирования:
        - Бронирование доступно за 2 недели вперед
        - Для групп более 8 человек требуется предоплата 20%
        - Столик держится 15 минут после забронированного времени
        
        Отвечай вежливо, кратко и по существу. Если не знаешь ответа, предложи связаться с менеджером ресторана.`,
      },
      ...messages,
    ]

    try {
      // Проверяем, поддерживается ли модель gpt-4o-realtime-preview
      // Если нет, используем gpt-4o или gpt-3.5-turbo
      let model = "gpt-3.5-turbo"
      try {
        const models = await getOpenAI().models.list()
        const availableModels = models.data.map((m) => m.id)

        if (availableModels.includes("gpt-4o-realtime-preview")) {
          model = "gpt-4o-realtime-preview"
        } else if (availableModels.includes("gpt-4o")) {
          model = "gpt-4o"
        }
        console.log(`Используем модель: ${model}`)
      } catch (error) {
        console.warn("Не удалось получить список моделей:", error)
      }

      // Отправляем запрос к OpenAI API
      const completion = await getOpenAI().chat.completions.create({
        model: model,
        messages: fullMessages,
        temperature: 0.9,
        max_tokens: 4096,
      })

      const responseText = completion.choices[0]?.message?.content || ""
      console.log(`Получен ответ от OpenAI API: "${responseText.substring(0, 50)}..."`)

      return NextResponse.json({ text: responseText })
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
            error: "Ошибка при генерации ответа через OpenAI API",
            details: openaiError.message || String(openaiError),
          },
          { status: 500 },
        )
      }
    }
  } catch (error: any) {
    console.error("Error in chat API:", error)
    return NextResponse.json(
      {
        error: "Произошла ошибка при обработке запроса",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
