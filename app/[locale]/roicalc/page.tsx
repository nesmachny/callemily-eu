import Header from "@/components/header-server"
import Footer from "@/components/footer"
import RoiCalculator from "@/components/roi-calculator"
import { t } from "@/lib/translations"
import { LOCALES } from "@/lib/i18n"
import type { Metadata } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://callemily.eu"

export function generateStaticParams() {
  return LOCALES.map(locale => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const meta = t(locale).meta
  const url = `${siteUrl}/${locale}/roicalc`
  return {
    title: meta.roicalcTitle,
    description: meta.roicalcDescription,
    alternates: {
      canonical: url,
      languages: { en: `${siteUrl}/en/roicalc`, pt: `${siteUrl}/pt/roicalc`, "x-default": `${siteUrl}/en/roicalc` },
    },
    openGraph: {
      title: meta.roicalcOgTitle,
      description: meta.roicalcOgDescription,
      url,
      type: "website",
    },
  }
}

export default async function RoiCalcPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const meta = t(locale).meta
  return (
    <>
      <Header transparent={false} />
      <main className="container mx-auto py-24 px-4 sm:py-28 md:py-32">
        <div className="flex flex-col items-center">
          <h1 className="mb-8 text-3xl font-bold text-[#333333] md:text-4xl font-montserrat text-center">
            {meta.roicalcH1}
          </h1>
          <RoiCalculator />
        </div>
      </main>
      <Footer locale={locale} />
    </>
  )
}
