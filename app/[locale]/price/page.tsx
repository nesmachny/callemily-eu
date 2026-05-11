import type { Metadata } from "next"
import PricePageClient from "./PricePageClient"
import { getMenu } from "@/lib/menu"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://callemily.ru"
  return {
    title: "Тарифы CallEmily — Голосовой ИИ для ресторанов",
    description: "Гибкие тарифы CallEmily для автоматизации бронирований. Экономьте с первого дня! Попробуйте бесплатно 14 дней.",
    alternates: {
      canonical: `${siteUrl}/${locale}/price`,
      languages: { ru: `${siteUrl}/ru/price`, kk: `${siteUrl}/kk/price`, uz: `${siteUrl}/uz/price`, "x-default": `${siteUrl}/ru/price` },
    },
    openGraph: { url: `${siteUrl}/${locale}/price` },
  }
}

export default async function PricePage() {
  const navItems = await getMenu("primary")
  return <PricePageClient navItems={navItems} />
}
