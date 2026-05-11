"use client"

import { useState, useEffect, useRef } from "react"

interface Message {
  speaker: "Emily" | "Гость"
  text: string
  id: string
}

const mockTranscript: Omit<Message, "id">[] = [
  { speaker: "Emily", text: "Здравствуйте! Ресторан 'Вкусный дворик', я Эмили, слушаю вас." },
  { speaker: "Гость", text: "Здравствуйте! Хотел бы забронировать столик на вечер." },
  { speaker: "Emily", text: "Конечно! На какое имя оформить бронирование?" },
  { speaker: "Гость", text: "На Алексея." },
  { speaker: "Emily", text: "Спасибо, Алексей. Мне нужен ваш контактный номер телефона для подтверждения брони." },
  { speaker: "Гость", text: "Мой номер +7 900 123-45-67." },
  { speaker: "Emily", text: "Записала. На какую дату и время вы бы хотели забронировать столик?" },
  { speaker: "Гость", text: "На сегодня, примерно на 7 вечера." },
  { speaker: "Emily", text: "Сколько будет гостей?" },
  { speaker: "Гость", text: "Нас будет двое." },
  {
    speaker: "Emily",
    text: "Минутку, проверяю наличие свободных столиков на сегодня на 19:00...",
  },
  {
    speaker: "Emily",
    text: "Хорошая новость! У нас есть свободный столик на двоих на сегодня в 19:00. Хотите его забронировать?",
  },
  { speaker: "Гость", text: "Да, пожалуйста." },
  {
    speaker: "Emily",
    text: "Отлично! Я забронировала столик на имя Алексей на сегодня, 19:00, на двоих гостей. Ваш код бронирования: BR17235802.",
  },
  { speaker: "Emily", text: "За 2 часа до визита я отправлю вам SMS с подтверждением." },
  { speaker: "Гость", text: "Спасибо большое, Эмили!" },
  { speaker: "Emily", text: "Есть ли у вас особые пожелания или вопросы по бронированию?" },
  { speaker: "Гость", text: "Нет, всё понятно. Спасибо за помощь!" },
  { speaker: "Emily", text: "Всегда рада помочь! Ждем вас сегодня в 19:00. Хорошего дня!" },
  { speaker: "Гость", text: "И вам хорошего дня! До свидания." },
  { speaker: "Emily", text: "До свидания." },
  { speaker: "Emily", text: "Звонок завершен." },
]

export default function LiveTranscriptView() {
  const [transcript, setTranscript] = useState<Message[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const [autoScroll, setAutoScroll] = useState(true)

  // Отслеживаем, когда пользователь прокручивает диалог
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      // Если пользователь прокрутил вверх (не в самом низу), отключаем автопрокрутку
      const isScrolledToBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 50
      setAutoScroll(isScrolledToBottom)
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [])

  // Прокручиваем только контейнер диалога, а не всю страницу
  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [transcript, autoScroll])

  useEffect(() => {
    let currentIndex = 0
    const intervalId = setInterval(() => {
      if (currentIndex < mockTranscript.length) {
        setTranscript((prev) => {
          return [...prev, { ...mockTranscript[currentIndex], id: `msg-${Date.now()}-${currentIndex}` }]
        })
        currentIndex++
      } else {
        // Опционально: можно очистить интервал или перезапустить демонстрацию
        clearInterval(intervalId)
      }
    }, 2500) // Интервал добавления новых сообщений

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold text-center mb-6 font-montserrat text-slate-700">
        Пример диалога с CallEmily
      </h2>
      <div
        ref={containerRef}
        className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-72 overflow-y-auto shadow-inner"
      >
        {transcript.length === 0 && <p className="text-gray-400 text-center py-10">Ожидание начала диалога...</p>}
        {transcript.map((message) => (
          <div
            key={message.id}
            className={`mb-3 text-sm ${message.speaker === "Emily" ? "text-blue-600" : "text-green-700"}`}
          >
            <span className="font-semibold">{message.speaker}:</span> {message.text}
          </div>
        ))}
      </div>
    </div>
  )
}
