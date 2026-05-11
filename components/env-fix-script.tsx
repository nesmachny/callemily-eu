"use client"

import Script from "next/script"
import { useEffect } from "react"

export default function EnvFixScript() {
  // Выполняем фикс сразу при монтировании компонента
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Список серверных переменных, которые не должны быть доступны на клиенте
      const serverOnlyVars = [
        "NPM_RC",
        "NPM_TOKEN",
        "NODE_ENV",
        "VERCEL",
        "VERCEL_ENV",
        "VERCEL_TARGET_ENV",
        "VERCEL_URL",
        "VERCEL_BRANCH_URL",
        "VERCEL_REGION",
        "VERCEL_DEPLOYMENT_ID",
        "VERCEL_PROJECT_ID",
        "VERCEL_SKEW_PROTECTION_ENABLED",
        "RESTAURANT_API_KEY",
        "OPENAI_API_KEY",
        "CRM_TYPE",
        "AMOCRM_API_KEY",
        "AMOCRM_API_URL",
      ]

      // Перехватываем доступ к проблемным переменным
      const descriptors: Record<string, PropertyDescriptor> = {}

      serverOnlyVars.forEach((varName) => {
        descriptors[varName] = {
          get() {
            return undefined
          },
          configurable: true,
        }
      })

      Object.defineProperties(process.env, descriptors)
    }
  }, [])

  // Добавляем inline-скрипт, который выполнится до загрузки React
  return (
    <Script
      id="env-fix"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          // Перехватываем доступ к серверным переменным
          if (typeof window !== 'undefined' && typeof process !== 'undefined' && process.env) {
            const serverOnlyVars = [
              'NPM_RC',
              'NPM_TOKEN', 
              'NODE_ENV',
              'VERCEL',
              'VERCEL_ENV',
              'VERCEL_TARGET_ENV',
              'VERCEL_URL',
              'VERCEL_BRANCH_URL',
              'VERCEL_REGION',
              'VERCEL_DEPLOYMENT_ID',
              'VERCEL_PROJECT_ID',
              'VERCEL_SKEW_PROTECTION_ENABLED',
              'RESTAURANT_API_KEY',
              'OPENAI_API_KEY',
              'CRM_TYPE',
              'AMOCRM_API_KEY',
              'AMOCRM_API_URL'
            ];
            
            const descriptors = {};
            serverOnlyVars.forEach(varName => {
              descriptors[varName] = {
                get() {
                  return undefined;
                },
                configurable: true
              };
            });
            
            Object.defineProperties(process.env, descriptors);
          }
        `,
      }}
    />
  )
}
