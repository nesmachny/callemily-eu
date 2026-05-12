import type { Metadata } from "next"
import PricePageClient from "./PricePageClient"
import { getMenu } from "@/lib/menu"
import { t } from "@/lib/translations"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const meta = t(locale).meta
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://callemily.eu"
  return {
    title: meta.priceTitle,
    description: meta.priceDescription,
    alternates: {
      canonical: `${siteUrl}/${locale}/price`,
      languages: { en: `${siteUrl}/en/price`, pt: `${siteUrl}/pt/price`, "x-default": `${siteUrl}/en/price` },
    },
    openGraph: { url: `${siteUrl}/${locale}/price` },
  }
}

export default async function PricePage() {
  const navItems = await getMenu("primary")
  return <PricePageClient navItems={navItems} />
}
