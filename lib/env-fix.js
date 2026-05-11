// Этот файл должен быть загружен как можно раньше
// Он перехватывает доступ к проблемным переменным окружения

// Сохраняем оригинальный process.env
const originalEnv = { ...process.env }

// Создаем прокси для process.env
process.env = new Proxy(process.env, {
  get(target, prop) {
    // Перехватываем доступ к проблемным переменным
    if (typeof window !== "undefined" && (prop === "NPM_RC" || prop === "NPM_TOKEN")) {
      console.warn(`Попытка доступа к ${String(prop)} на клиенте предотвращена`)
      return undefined
    }

    // Для всех остальных переменных возвращаем оригинальное значение
    return originalEnv[prop]
  },
  set(target, prop, value) {
    originalEnv[prop] = value
    return true
  },
})
