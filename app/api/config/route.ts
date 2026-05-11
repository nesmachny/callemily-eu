// Серверный API маршрут для безопасного предоставления конфигурации
import { getServerOnlyEnv } from "@/lib/env-check"

export async function GET() {
  // Получаем переменные на сервере
  const npmConfig = getServerOnlyEnv("NPM_RC")

  // Возвращаем только безопасные данные, которые можно показать клиенту
  return Response.json({
    hasNpmConfig: !!npmConfig,
    // Другие безопасные данные...
  })
}
