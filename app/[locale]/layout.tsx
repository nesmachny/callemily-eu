import { notFound } from "next/navigation"
import { isValidLocale, LOCALES } from "@/lib/i18n"
import type { Metadata } from "next"
import type React from "react"

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://callemily.eu"
  return {
    alternates: {
      languages: {
        en: `${siteUrl}/en`,
        pt: `${siteUrl}/pt`,
        "x-default": `${siteUrl}/en`,
      },
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  return <>{children}</>
}
