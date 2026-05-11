// Серверный код (API маршрут)
import { getServerOnlyEnv } from "@/lib/env-check"

export async function GET() {
  // Безопасно, так как это серверный код
  const npmToken = getServerOnlyEnv("NPM_TOKEN")

  // Используйте npmToken для серверных операций
  // ...

  return Response.json({ success: true })
}
