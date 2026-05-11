"use client"

import { useState } from "react"
import AudioPlayer from "./audio-player"
import FallbackAudioPlayer from "./fallback-audio-player"

export default function DemoAudioSection() {
  const [hasError, setHasError] = useState(false)
  const audioUrl = "/audio/callemily-dialog.mp3"

  if (hasError) {
    return (
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-2 font-montserrat">
              Послушайте, как работает CallEmily
            </h2>
            <p className="text-lg text-[#666666] font-sans">
              Пример реального диалога с голосовым помощником по бронированию столика
            </p>
          </div>
          <div className="w-full max-w-3xl mx-auto">
            <FallbackAudioPlayer audioUrl={audioUrl} />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-2 font-montserrat">
            Послушайте, как работает CallEmily
          </h2>
          <p className="text-lg text-[#666666] font-sans">
            Пример реального диалога с голосовым помощником по бронированию столика
          </p>
        </div>
        <div className="wavesurfer-wrap w-full max-w-3xl mx-auto">
          <AudioPlayer onError={() => setHasError(true)} />
          <p className="text-center text-sm text-gray-500 mt-4">Пример диалога с голосовым помощником CallEmily</p>
        </div>
      </div>
    </section>
  )
}
