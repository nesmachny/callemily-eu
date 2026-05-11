"use client"

import { usePathname } from "next/navigation"

export default function SchemaMarkup({ url }: { url: string }) {
  const pathname = usePathname()
  const currentUrl = `${url}${pathname}`

  // Базовая информация об организации
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CallEmily",
    url: url,
    logo: `${url}/logo.png`,
    description: "CallEmily - голосовой ИИ-помощник для автоматизации бронирования столиков в ресторанах",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "8 800 505 8594",
      contactType: "customer service",
      email: "go@onecdp.ru",
    },
    sameAs: [
      "https://www.linkedin.com/company/callemily",
      "https://www.facebook.com/callemily",
      "https://www.instagram.com/callemily",
    ],
  }

  // Схема для главной страницы
  const homePageSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: url,
    name: "CallEmily - Голосовой помощник для ресторанов",
    description: "Автоматизируйте бронирование столиков с CallEmily и увеличивайте бронирования на 20–30%",
    potentialAction: {
      "@type": "SearchAction",
      target: `${url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }

  // Схема для страницы с ценами
  const pricePageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: `${url}/price`,
    name: "Тарифы CallEmily — Голосовой ИИ для ресторанов",
    description:
      "Гибкие тарифы CallEmily для автоматизации бронирований. Экономьте с первого дня! Попробуйте бесплатно 14 дней.",
    mainEntity: {
      "@type": "Product",
      name: "CallEmily",
      description: "Голосовой ИИ-помощник для автоматизации бронирования столиков в ресторанах",
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "RUB",
        lowPrice: "15000",
        highPrice: "45000",
        offerCount: 3,
      },
    },
  }

  // Выбираем схему в зависимости от текущей страницы
  const getPageSchema = () => {
    if (pathname === "/") {
      return homePageSchema
    } else if (pathname === "/price") {
      return pricePageSchema
    }
    return null
  }

  const pageSchema = getPageSchema()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      {pageSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      )}
    </>
  )
}
