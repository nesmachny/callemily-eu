import type { ReactNode } from "react"
import Header from "@/components/header-server"
import Footer from "@/components/footer"

export default async function BlogLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header locale={locale} />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer locale={locale} />
    </div>
  )
}
