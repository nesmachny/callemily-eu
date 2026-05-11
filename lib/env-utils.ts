/**
 * Утилиты для безопасной работы с переменными окружения
 */

// Проверяет, выполняется ли код на сервере
export const isServer = typeof window === "undefined"

// Безопасно получает переменную окружения только на сервере
export function getServerEnv(key: string): string | undefined {
  if (!isServer) {
    return undefined
  }

  return process.env[key]
}

// Безопасно получает публичную переменную окружения
export function getPublicEnv(key: string): string | undefined {
  if (!key.startsWith("NEXT_PUBLIC_")) {
    return undefined
  }

  return process.env[key]
}
