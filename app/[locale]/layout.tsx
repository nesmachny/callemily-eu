import { notFound } from "next/navigation"
import { isValidLocale, LOCALES } from "@/lib/i18n"
import type React from "react"

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
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
