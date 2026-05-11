import dynamic from "next/dynamic"
import Header from "@/components/header-server"
import HeroSection from "@/components/hero-section"
import TrustStrip from "@/components/trust-strip"
import ProblemsSection from "@/components/problems-section"
import FeaturesSection from "@/components/features-section"
import HowItWorksSection from "@/components/how-it-works-section"
import CasesSection from "@/components/cases-section"
import ComparisonSection from "@/components/comparison-section"
import FAQSchema from "@/components/faq-schema"
import { getCases } from "@/lib/cases"
import { t } from "@/lib/translations"
import type { Metadata } from "next"

const ROICalculator = dynamic(() => import("@/components/roi-calculator"))
const DemoSection = dynamic(() => import("@/components/demo-section"))
const FAQSectionV2 = dynamic(() => import("@/components/faq-section-v2"))
const CTASection = dynamic(() => import("@/components/cta-section"))
const Footer = dynamic(() => import("@/components/footer"))

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://callemily.eu"
  const url = `${siteUrl}/${locale}`
  return {
    alternates: {
      canonical: url,
      languages: { en: `${siteUrl}/en`, pt: `${siteUrl}/pt`, "x-default": `${siteUrl}/en` },
    },
    openGraph: { url },
  }
}

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "CallEmily",
  url: "https://callemily.eu",
  logo: "https://callemily.eu/favicon.svg",
  email: "hello@callemily.eu",
  contactPoint: { "@type": "ContactPoint", contactType: "customer service", availableLanguage: ["English", "Portuguese"] },
}

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "CallEmily",
  url: "https://callemily.eu",
  description: "AI voice assistant for restaurants, clinics and car dealerships — automates calls and bookings 24/7",
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const cases = await getCases(locale)
  const tr = t(locale)
  const faqItems = tr.faq.items.map(item => ({ question: item.q, answer: item.a }))

  return (
    <>
      <Header />
      <main>
        <HeroSection locale={locale} />
        {/* <TrustStrip locale={locale} /> */}
        <ProblemsSection locale={locale} />
        <ROICalculator />
        <FeaturesSection locale={locale} />
        <HowItWorksSection locale={locale} />
        <DemoSection locale={locale} />
        <CasesSection cases={cases} locale={locale} />
        <ComparisonSection locale={locale} />
        <FAQSectionV2 locale={locale} />
        <CTASection />
      </main>
      <Footer locale={locale} />
      <FAQSchema items={faqItems} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
    </>
  )
}
