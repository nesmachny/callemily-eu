import type { Metadata } from "next"
import Header from "@/components/header-server"
import Footer from "@/components/footer"
import RestaurantLayout from "@/components/restaurant-layout"
import RealtimeBookingDashboard from "@/components/realtime-booking-dashboard"
import LiveTranscriptView from "@/components/live-transcript-view" // Импортируем новый компонент
import { Phone, Info } from "lucide-react"

export const metadata: Metadata = {
  title: "Демо CallEmily - Интерактивная демонстрация",
  description:
    "Посмотрите, как CallEmily управляет бронированиями в реальном времени. Интерактивная схема ресторана и статусы столов.",
  openGraph: {
    title: "Интерактивное Демо CallEmily",
    description: "Исследуйте возможности CallEmily: схема ресторана, выбор даты и времени, статусы бронирований.",
    url: "/demo",
  },
  alternates: {
    canonical: "/demo",
  },
}

export default function DemoPage() {
  return (
    <>
      <Header transparent={false} />
      <main className="container mx-auto py-24 px-4 sm:py-28 md:py-32">
        {/* Вводная секция с описанием демо */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 font-montserrat text-slate-800">
            Демонстрация работы CallEmily
          </h1>

          {/* Номер телефона для тестирования */}
          <div className="mb-8">
            <p className="text-lg text-gray-600 mb-4">Позвоните на номер:</p>
            <div className="flex items-center justify-center gap-3 text-2xl md:text-3xl font-semibold text-blue-500">
              <Phone className="w-8 h-8" />
              <a href="tel:+78123092369" className="hover:text-blue-600 transition-colors">
                +7 812 309 2369
              </a>
            </div>
          </div>

          {/* Инструкции по тестированию */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left max-w-4xl mx-auto">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-800 mb-3">Как тестировать:</h3>
                <p className="text-blue-700 mb-4">
                  Закажите столик в демо ресторане через звонок. Попробуйте различные сценарии:
                </p>
                <ul className="space-y-2 text-blue-700">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    Назовите неправильный номер телефона или имя.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    Спросите о возможных вариантах размещения (например, у окна, в тихом месте).
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    Уточните часы работы или адрес ресторана.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    Попробуйте отменить или изменить существующую бронь (демо-сценарий).
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Описание функциональности */}
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Ниже вы можете наблюдать за обновлением статуса столов в реальном времени. Бронирования, сделанные через
            звонок, появятся в расписании.
          </p>
        </div>

        {/* Блок визуализации диалога */}
        <LiveTranscriptView />

        <RestaurantLayout />
        <RealtimeBookingDashboard />
      </main>
      <Footer locale="en" />
    </>
  )
}
