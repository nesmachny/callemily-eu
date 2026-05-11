"use client"

// Клиентский компонент
import { getPublicEnv } from "@/lib/env-check"

export default function ExampleClient() {
  // Безопасно, так как проверяется префикс NEXT_PUBLIC_
  const publicValue = getPublicEnv("NEXT_PUBLIC_API_URL")

  return <div>Using public value: {publicValue}</div>
}
