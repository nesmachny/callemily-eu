import type { Metadata } from "next"
import type React from "react"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://callemily.eu"
  return {
    title: "Демонстрация работы CallEmily",
    description: "Позвоните на номер +7 812 309 2369 и протестируйте голосового помощника CallEmily для бронирования столиков в демо ресторане.",
    alternates: {
      canonical: `${siteUrl}/${locale}/demo`,
      languages: { ru: `${siteUrl}/ru/demo`, kk: `${siteUrl}/kk/demo`, uz: `${siteUrl}/uz/demo`, "x-default": `${siteUrl}/ru/demo` },
    },
    openGraph: { url: `${siteUrl}/${locale}/demo` },
  }
}

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
