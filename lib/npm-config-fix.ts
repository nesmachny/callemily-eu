/**
 * Исправление проблемы с доступом к NPM_RC и NPM_TOKEN на клиенте
 */

// Проверяем, выполняется ли код на клиенте
if (typeof window !== "undefined") {
  // Создаем пустые заглушки для переменных npm, чтобы избежать ошибок
  // Это предотвратит ошибки при попытке доступа к этим переменным на клиенте
  Object.defineProperties(process.env, {
    NPM_RC: {
      get() {
        console.warn("Попытка доступа к NPM_RC на клиенте предотвращена")
        return undefined
      },
      configurable: true,
    },
    NPM_TOKEN: {
      get() {
        console.warn("Попытка доступа к NPM_TOKEN на клиенте предотвращена")
        return undefined
      },
      configurable: true,
    },
  })
}

// Экспортируем пустую функцию, чтобы можно было импортировать этот файл
export function setupNpmConfigFix() {
  // Функция уже выполнила свою работу при импорте
}
