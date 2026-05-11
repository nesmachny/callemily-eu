import type { Metadata } from "next"
import { cms } from "@/lib/emdash"
import PortableText from "@/components/portable-text"
import { t } from "@/lib/translations"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://callemily.eu"

interface AboutData {
  title?: string
  content?: unknown[]
}

async function getAboutPage(): Promise<AboutData | null> {
  if (!cms) return null
  try {
    const result = await cms.list("pages", { status: "published" })
    const page = result.items.find(
      (p: { slug: string | null }) => p.slug === "about"
    )
    return (page?.data as AboutData) ?? null
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const tr = t(locale).about
  return {
    title: `${tr.contactH2 === "Get in touch" ? "About" : "Sobre nós"} | CallEmily`,
    description: tr.heroSubFallback,
    alternates: {
      canonical: `${siteUrl}/${locale}/about`,
      languages: {
        en: `${siteUrl}/en/about`,
        pt: `${siteUrl}/pt/about`,
        "x-default": `${siteUrl}/en/about`,
      },
    },
    openGraph: { url: `${siteUrl}/${locale}/about` },
  }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const tr = t(locale).about
  const cmsData = await getAboutPage()

  const heroTitle = cmsData?.title ?? tr.heroFallback
  const cmsContent = cmsData?.content ?? null

  return (
    <div style={{ background: "var(--ce-bg)" }}>

      {/* Hero */}
      <section className="ce-section" style={{ textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -160, right: -100, width: 440, height: 440, background: "radial-gradient(circle, var(--ce-primary-soft) 0%, transparent 65%)", filter: "blur(20px)", opacity: 0.7, pointerEvents: "none" }} />
        <div className="ce-wrap" style={{ position: "relative" }}>
          <span className="ce-eyebrow" style={{ marginBottom: 20 }}>{tr.eyebrow}</span>
          <h1 className="ce-h-display" style={{ fontSize: "clamp(36px, 5vw, 60px)", margin: "0 auto 24px", maxWidth: 700 }}>
            {heroTitle}
          </h1>
          {cmsContent ? (
            <div style={{ fontSize: 18, color: "var(--ce-text-2)", maxWidth: 680, margin: "0 auto", lineHeight: 1.7, textAlign: "left" }}>
              <PortableText value={cmsContent} />
            </div>
          ) : (
            <p style={{ fontSize: 18, color: "var(--ce-text-2)", maxWidth: 680, margin: "0 auto", lineHeight: 1.7 }}>
              {tr.heroSubFallback}
            </p>
          )}
        </div>
      </section>

      {/* Capabilities */}
      <section className="ce-section">
        <div className="ce-wrap">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="ce-eyebrow" style={{ marginBottom: 12 }}>{tr.servicesEyebrow}</span>
            <h2 className="ce-h-display" style={{ fontSize: "clamp(28px, 4vw, 44px)", margin: 0 }}>{tr.servicesH2}</h2>
          </div>
          <div className="ce-about-services" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {[
              { icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--ce-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg> },
              { icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--ce-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
              { icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--ce-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> },
              { icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--ce-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><path d="M2 20h20"/></svg> },
            ].map((s, i) => (
              <div key={i} className="ce-card" style={{ padding: 28, display: "flex", gap: 20 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "var(--ce-primary-soft)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {s.icon}
                </div>
                <div>
                  <h3 style={{ fontFamily: "var(--font-unbounded), sans-serif", fontWeight: 600, fontSize: 15, color: "var(--ce-text)", margin: "0 0 8px" }}>{tr.services[i].title}</h3>
                  <p style={{ fontSize: 14, color: "var(--ce-text-2)", lineHeight: 1.65, margin: 0 }}>{tr.services[i].description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="ce-section" style={{ background: "var(--ce-surface)", borderTop: "1px solid var(--ce-border)", borderBottom: "1px solid var(--ce-border)" }}>
        <div className="ce-wrap">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="ce-eyebrow" style={{ marginBottom: 12 }}>{tr.benefitsEyebrow}</span>
            <h2 className="ce-h-display" style={{ fontSize: "clamp(28px, 4vw, 44px)", margin: 0 }}>{tr.benefitsH2}</h2>
          </div>
          <div className="ce-about-benefits" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {[
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--ce-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> },
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--ce-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l7 3v5c0 4.5-3 8.5-7 10C8 18.5 5 14.5 5 10V5l7-3z"/><polyline points="9 12 11 14 15 10"/></svg> },
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--ce-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--ce-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> },
            ].map((b, i) => (
              <div key={i} style={{ background: "var(--ce-bg)", border: "1px solid var(--ce-border)", borderRadius: 20, padding: 24, textAlign: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--ce-primary-soft)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>{b.icon}</div>
                <h3 style={{ fontFamily: "var(--font-unbounded), sans-serif", fontWeight: 600, fontSize: 13, color: "var(--ce-text)", margin: "0 0 8px", lineHeight: 1.4 }}>{tr.benefits[i].title}</h3>
                <p style={{ fontSize: 13, color: "var(--ce-text-2)", lineHeight: 1.6, margin: 0 }}>{tr.benefits[i].description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements / Stats */}
      <section className="ce-section">
        <div className="ce-wrap">
          <div style={{ background: "var(--ce-text)", borderRadius: 32, padding: "56px 48px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -80, right: -80, width: 320, height: 320, background: "radial-gradient(circle, rgba(232,93,44,.3) 0%, transparent 65%)", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <span className="ce-eyebrow" style={{ color: "rgba(255,255,255,.5)", marginBottom: 20 }}>{tr.achievementsEyebrow}</span>
              <h2 style={{ fontFamily: "var(--font-unbounded), sans-serif", fontWeight: 700, fontSize: "clamp(26px, 4vw, 40px)", color: "#fff", margin: "0 0 20px", lineHeight: 1.15 }}>{tr.achievementsH2}</h2>
              <p style={{ fontSize: 17, color: "rgba(255,255,255,.7)", maxWidth: 620, margin: "0 0 40px", lineHeight: 1.7 }}>
                {tr.achievementsSub}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }}>
                {tr.stats.map((s, i) => (
                  <div key={i}>
                    <div style={{ fontFamily: "var(--font-unbounded), sans-serif", fontWeight: 700, fontSize: "clamp(22px, 2.5vw, 32px)", color: "#fff" }}>{s.v}</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,.55)", marginTop: 4 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="ce-section" style={{ background: "var(--ce-surface)", borderTop: "1px solid var(--ce-border)" }}>
        <div className="ce-wrap" style={{ textAlign: "center" }}>
          <span className="ce-eyebrow" style={{ marginBottom: 16 }}>{tr.contactEyebrow}</span>
          <h2 className="ce-h-display" style={{ fontSize: "clamp(28px, 4vw, 44px)", margin: "0 0 16px" }}>{tr.contactH2}</h2>
          <p style={{ fontSize: 17, color: "var(--ce-text-2)", maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.65 }}>
            {tr.contactSub}
          </p>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
            <a href={tr.contactPhoneHref} style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 16, color: "var(--ce-primary)", textDecoration: "none", fontWeight: 500 }}>
              <span style={{ width: 36, height: 36, borderRadius: 10, background: "var(--ce-primary-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ce-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </span>
              {tr.contactPhone}
            </a>
            <a href={`mailto:${tr.contactEmail}`} style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 16, color: "var(--ce-primary)", textDecoration: "none", fontWeight: 500 }}>
              <span style={{ width: 36, height: 36, borderRadius: 10, background: "var(--ce-primary-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ce-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </span>
              {tr.contactEmail}
            </a>
            <a href={`https://${tr.contactWebLabel}`} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 16, color: "var(--ce-primary)", textDecoration: "none", fontWeight: 500 }}>
              <span style={{ width: 36, height: 36, borderRadius: 10, background: "var(--ce-primary-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ce-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </span>
              {tr.contactWebLabel}
            </a>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 860px) {
          .ce-about-services { grid-template-columns: 1fr !important; }
          .ce-about-benefits { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 520px) {
          .ce-about-benefits { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
