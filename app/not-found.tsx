import Link from "next/link"
import Header from "@/components/header-server"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex flex-grow items-center justify-center bg-gray-50 px-4 py-16">
        <div className="text-center">
          <h1 className="mb-4 text-6xl font-bold text-[#4A90E2] font-montserrat">404</h1>
          <h2 className="mb-6 text-2xl font-bold text-[#333333] font-montserrat">Страница не найдена</h2>
          <p className="mb-8 text-[#666666] font-sans">
            Извините, запрашиваемая страница не существует или была перемещена.
          </p>
          <Link
            href="/"
            className="inline-block rounded-xl bg-[#4A90E2] px-6 py-3 font-bold text-white hover:bg-[#00C4B4] transition-transform hover:scale-105 font-montserrat"
          >
            Вернуться на главную
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#333333] py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white font-sans">© 2023 CallEmily. Все права защищены.</p>
        </div>
      </footer>
    </div>
  )
}
