"use client"

import { useEffect, useRef, useState } from "react"
import { Play, Pause } from "lucide-react"

interface AudioPlayerProps {
  onError?: () => void
}

export default function AudioPlayer({ onError }: AudioPlayerProps) {
  const waveformRef = useRef<HTMLDivElement>(null)
  const wavesurferRef = useRef<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const audioUrl = "/audio/callemily-dialog.mp3"

  useEffect(() => {
    let isMounted = true
    let wavesurfer: any = null

    // Only import WaveSurfer on the client side
    const initWaveSurfer = async () => {
      try {
        if (!waveformRef.current || wavesurferRef.current) return

        const WaveSurfer = (await import("wavesurfer.js")).default

        wavesurfer = WaveSurfer.create({
          container: waveformRef.current,
          waveColor: "#A3CFFA",
          progressColor: "#4A90E2",
          height: 80,
          barWidth: 2,
          barGap: 3,
          barRadius: 3,
          responsive: true,
          normalize: true,
        })

        wavesurferRef.current = wavesurfer

        // Set up event listeners
        wavesurfer.on("ready", () => {
          if (isMounted) {
            setIsLoaded(true)
            setError(null)
          }
        })

        wavesurfer.on("play", () => {
          if (isMounted) setIsPlaying(true)
        })

        wavesurfer.on("pause", () => {
          if (isMounted) setIsPlaying(false)
        })

        wavesurfer.on("finish", () => {
          if (isMounted) setIsPlaying(false)
        })

        wavesurfer.on("error", (err: any) => {
          console.error("WaveSurfer error:", err)
          if (isMounted) {
            setError("Не удалось загрузить аудио. Пожалуйста, попробуйте позже.")
            onError?.() // Call the onError callback if provided
          }
        })

        // Load audio after setting up event listeners
        wavesurfer.load(audioUrl)
      } catch (error) {
        console.error("Failed to load WaveSurfer:", error)
        if (isMounted) {
          setError("Не удалось инициализировать аудиоплеер")
          onError?.() // Call the onError callback if provided
        }
      }
    }

    initWaveSurfer()

    // Cleanup function
    return () => {
      isMounted = false

      // Properly destroy wavesurfer instance
      if (wavesurferRef.current) {
        try {
          // First remove all event listeners to prevent port disconnection issues
          if (typeof wavesurferRef.current.unAll === "function") {
            wavesurferRef.current.unAll()
          }

          // Check if destroy method exists before calling it
          if (typeof wavesurferRef.current.destroy === "function") {
            wavesurferRef.current.destroy()
          }

          wavesurferRef.current = null
        } catch (e) {
          console.error("Error destroying wavesurfer:", e)
        }
      }
    }
  }, [audioUrl, onError])

  const togglePlayPause = () => {
    if (wavesurferRef.current) {
      try {
        wavesurferRef.current.playPause()
      } catch (error) {
        console.error("Error toggling play/pause:", error)
        setError("Произошла ошибка при воспроизведении аудио")
      }
    }
  }

  return (
    <div className="w-full">
      <div className="flex flex-col items-center">
        <div
          ref={waveformRef}
          className="w-full max-w-3xl rounded-lg bg-white p-4 shadow-md"
          style={{ minHeight: "100px" }}
        />

        {error && <div className="mt-4 text-red-500 text-center">{error}</div>}

        <button
          onClick={togglePlayPause}
          disabled={!isLoaded}
          className="mt-4 flex items-center justify-center rounded-full bg-[#A3CFFA] p-4 text-white hover:bg-[#4A90E2] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={isPlaying ? "Pause audio" : "Play audio"}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        <p className="mt-2 text-sm text-gray-500">
          {isLoaded ? "Нажмите для воспроизведения демо-звонка" : "Загрузка аудио..."}
        </p>
      </div>
    </div>
  )
}
