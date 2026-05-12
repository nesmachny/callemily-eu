import Link from "next/link"
import { headers } from "next/headers"
import SiteHeader from "@/components/header-server"
import SiteFooter from "@/components/footer"

export default async function NotFound() {
  const headersList = await headers()
  const locale = headersList.get("x-locale") || "en"
  const isPt = locale === "pt"

  return (
    <div style={{ background: "var(--ce-bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <SiteHeader />
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 24px", textAlign: "center" }}>
        <span style={{ fontFamily: "var(--font-unbounded), sans-serif", fontWeight: 700, fontSize: "clamp(80px, 15vw, 140px)", color: "var(--ce-primary)", lineHeight: 1, marginBottom: 24 }}>
          404
        </span>
        <h1 style={{ fontFamily: "var(--font-unbounded), sans-serif", fontWeight: 700, fontSize: "clamp(22px, 3vw, 32px)", color: "var(--ce-text)", margin: "0 0 16px" }}>
          {isPt ? "Página não encontrada" : "Page not found"}
        </h1>
        <p style={{ fontSize: 17, color: "var(--ce-muted)", maxWidth: 440, margin: "0 auto 40px", lineHeight: 1.65 }}>
          {isPt
            ? "A página que procura não existe ou foi movida."
            : "The page you're looking for doesn't exist or has been moved."}
        </p>
        <Link
          href={`/${locale}`}
          style={{
            display: "inline-flex", alignItems: "center",
            background: "var(--ce-primary)", color: "#fff",
            borderRadius: 12, padding: "14px 32px",
            fontFamily: "var(--font-unbounded), sans-serif",
            fontWeight: 600, fontSize: 15, textDecoration: "none",
          }}
        >
          {isPt ? "Voltar ao início" : "Back to home"}
        </Link>
      </main>
      <SiteFooter locale={locale} />
    </div>
  )
}
