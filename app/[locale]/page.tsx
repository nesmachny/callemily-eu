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
import type { Metadata } from "next"

const ROICalculator = dynamic(() => import("@/components/roi-calculator"))
const DemoSection = dynamic(() => import("@/components/demo-section"))
const FAQSectionV2 = dynamic(() => import("@/components/faq-section-v2"))
const CTASection = dynamic(() => import("@/components/cta-section"))
const Footer = dynamic(() => import("@/components/footer"))

const faqItems = [
  { question: "Гости поймут, что говорят с роботом?", answer: "Голос Эмилии очень близок к человеческому — большинство гостей не замечают. Но мы по умолчанию настраиваем честное представление: «Здравствуйте, это голосовой помощник ресторана». Это формирует доверие и не разочаровывает." },
  { question: "Как происходит интеграция с iiko / R-Keeper?", answer: "Подключаем через официальные API. Бронь в Эмилии = бронь в системе. Стол автоматически блокируется, при отмене — освобождается. Настройка занимает 1–2 рабочих дня." },
  { question: "Что, если столиков нет?", answer: "Эмилия предлагает альтернативные время или дату, ставит в лист ожидания, или передаёт менеджеру. Она никогда не говорит «нет» и не кладёт трубку." },
  { question: "А если гость хочет поговорить с человеком?", answer: "Эмилия мгновенно переводит звонок на администратора с кратким брифом по предыдущему диалогу. Никаких «начните сначала»." },
  { question: "Сколько звонков она держит одновременно?", answer: "Технически — без ограничений. На практике — берём с запасом ×10 от вашего трафика." },
  { question: "Можно ли попробовать бесплатно?", answer: "Да, 14 дней триала. Без банковской карты на старте. За это время сами увидите, сколько звонков теряли." },
]

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://callemily.ru"
  const url = `${siteUrl}/${locale}`
  return {
    alternates: {
      canonical: url,
      languages: { ru: `${siteUrl}/ru`, kk: `${siteUrl}/kk`, uz: `${siteUrl}/uz`, "x-default": `${siteUrl}/ru` },
    },
    openGraph: { url },
  }
}

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "CallEmily",
  url: "https://callemily.ru",
  logo: "https://callemily.ru/favicon.svg",
  telephone: "+78005058594",
  contactPoint: { "@type": "ContactPoint", telephone: "+78005058594", contactType: "customer service", availableLanguage: "Russian" },
}

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "CallEmily",
  url: "https://callemily.ru",
  description: "Голосовой ИИ-ассистент для ресторанов, клиник и автосалонов — автоматизирует звонки и бронирования 24/7",
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const cases = await getCases()

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <TrustStrip />
        <ProblemsSection />
        <ROICalculator />
        <FeaturesSection />
        <HowItWorksSection />
        <DemoSection />
        <CasesSection cases={cases} />
        <ComparisonSection />
        <FAQSectionV2 />
        <CTASection />
      </main>
      <Footer />
      <FAQSchema items={faqItems} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
    </>
  )
}
