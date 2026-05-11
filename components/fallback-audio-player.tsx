"use client"

import { useState } from "react"
import { Download } from "lucide-react"

interface FallbackAudioPlayerProps {
  audioUrl: string
}

export default function FallbackAudioPlayer({ audioUrl }: FallbackAudioPlayerProps) {
  const [error, setError] = useState(false)

  const handleError = () => {
    setError(true)
  }

  const downloadAudio = () => {
    const link = document.createElement("a")
    link.href = audioUrl
    link.download = "CallEmily_dialog.mp3"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white p-4 rounded-lg shadow-md">
        {!error ? (
          <>
            <audio controls className="w-full" onError={handleError} controlsList="nodownload">
              <source src={audioUrl} type="audio/mpeg" />
              Ваш браузер не поддерживает аудио элемент.
            </audio>
            <p className="text-center text-sm text-gray-500 mt-2">Пример диалога с голосовым помощником CallEmily</p>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-red-500 mb-4">Не удалось загрузить аудио. Пожалуйста, скачайте файл напрямую.</p>
            <button
              onClick={downloadAudio}
              className="flex items-center justify-center mx-auto rounded-full bg-[#A3CFFA] px-4 py-2 text-white hover:bg-[#4A90E2] transition-all"
            >
              <Download size={18} className="mr-2" />
              Скачать аудио
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
