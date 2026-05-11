import Header from "@/components/header-server"
import Footer from "@/components/footer"
import RoiCalculator from "@/components/roi-calculator"
import type { Metadata } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://callemily.ru"

export const metadata: Metadata = {
  title: "Калькулятор ROI | CallEmily",
  description:
    "Рассчитайте потенциальную упущенную выгоду вашего ресторана из-за пропущенных звонков и оцените пользу от автоматизации.",
  alternates: { canonical: `${siteUrl}/roicalc` },
  openGraph: {
    title: "Калькулятор ROI для Ресторанов | CallEmily",
    description: "Узнайте, сколько вы можете терять ежемесячно из-за пропущенных бронирований по телефону.",
    url: `${siteUrl}/roicalc`,
    type: "website",
  },
}

export default function RoiCalcPage() {
  return (
    <>
      <Header transparent={false} />
      <main className="container mx-auto py-24 px-4 sm:py-28 md:py-32">
        <div className="flex flex-col items-center">
          <h1 className="mb-8 text-3xl font-bold text-[#333333] md:text-4xl font-montserrat text-center">
            Калькулятор ROI для вашего ресторана
          </h1>
          <RoiCalculator />
        </div>
      </main>
      <Footer />
    </>
  )
}
