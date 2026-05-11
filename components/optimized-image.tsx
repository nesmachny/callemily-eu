"use client"

import Image from "next/image"
import { useState } from "react"

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  sizes?: string
  quality?: number
  loading?: "eager" | "lazy"
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  sizes = "100vw",
  quality = 75,
  loading = "lazy",
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className={`overflow-hidden ${className}`}>
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-500 ${isLoading ? "opacity-0" : "opacity-100"}`}
        onLoadingComplete={() => setIsLoading(false)}
        priority={priority}
        sizes={sizes}
        quality={quality}
        loading={loading}
      />
    </div>
  )
}
