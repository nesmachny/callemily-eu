// Этот файл поможет найти проблемные места в коде

// Функция для безопасного доступа к переменным окружения на сервере
export function getServerOnlyEnv(key: string): string | undefined {
  // Эта функция должна вызываться только на сервере
  if (typeof window !== "undefined") {
    console.error(`Попытка доступа к серверной переменной окружения ${key} на клиенте!`)
    return undefined
  }

  return process.env[key]
}

// Функция для доступа к публичным переменным окружения (безопасно на клиенте)
export function getPublicEnv(key: string): string | undefined {
  if (!key.startsWith("NEXT_PUBLIC_")) {
    console.error(`Попытка доступа к непубличной переменной ${key} через getPublicEnv!`)
    return undefined
  }

  return process.env[key]
}
