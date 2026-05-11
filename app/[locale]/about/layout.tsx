import type { ReactNode } from "react"
import Header from "@/components/header-server"
import Footer from "@/components/footer"

export default function AboutLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  )
}
