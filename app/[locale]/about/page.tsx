import type { Metadata } from "next"
import { cms } from "@/lib/emdash"
import PortableText from "@/components/portable-text"

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
  const data = await getAboutPage()
  return {
    title: data?.title ? `${data.title} | CallEmily` : "О нас | CallEmily",
    description: "Узнайте больше о компании WiFly, наших сервисах и миссии по предоставлению передовых ИТ-решений для бизнеса.",
    alternates: {
      canonical: `${siteUrl}/${locale}/about`,
      languages: { ru: `${siteUrl}/ru/about`, kk: `${siteUrl}/kk/about`, uz: `${siteUrl}/uz/about`, "x-default": `${siteUrl}/ru/about` },
    },
    openGraph: { url: `${siteUrl}/${locale}/about` },
  }
}

const services = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--ce-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/>
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="var(--ce-primary)"/>
      </svg>
    ),
    title: "Wi-Fi маркетинг",
    description: "Автоматический сбор клиентских данных через гостевой Wi-Fi, включая номера телефонов, email, MAC-адреса, данные из социальных сетей и другие параметры. Это помогает бизнесу выстраивать персонализированные коммуникации и увеличивать лояльность клиентов.",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--ce-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/>
      </svg>
    ),
    title: "MAC-радар",
    description: "Уникальный инструмент, который анализирует проходимость и частоту посещений, распознавая, кто просто прошел мимо, а кто остался надолго. Это позволяет сегментировать аудиторию и оптимизировать маркетинговые стратегии.",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--ce-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    title: "SMS-радар",
    description: "Эффективный инструмент для рассылки персонализированных предложений и акций, который помогает привлекать новых клиентов и поддерживать связь с текущими.",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--ce-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
        <path d="M2 20h20"/>
      </svg>
    ),
    title: "Аналитика и ретаргетинг",
    description: "Мы предоставляем инструменты для глубокого анализа клиентских данных, их визуализации и интеграции с CRM/ERP-системами, чтобы вы могли принимать обоснованные решения и запускать точечные рекламные кампании.",
  },
]

const benefits = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--ce-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
    title: "Технологическое лидерство",
    description: "Мы разрабатываем и поддерживаем надежную облачную инфраструктуру, обеспечивая стабильность и безопасность наших сервисов.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--ce-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l7 3v5c0 4.5-3 8.5-7 10C8 18.5 5 14.5 5 10V5l7-3z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
    title: "Техническая поддержка",
    description: "Наша команда всегда готова помочь с настройкой оборудования, доступом к личному кабинету и решением любых вопросов.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--ce-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: "Гибкость и масштабируемость",
    description: "Наши решения подходят для бизнеса любого размера — от небольших кафе до крупных торговых центров.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--ce-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: "Сообщество и партнёрство",
    description: "Мы активно участвуем в ИТ-сообществе и открыты к новым проектам и сотрудничеству. Станьте нашим партнером и начните зарабатывать с первого месяца!",
  },
]

export default async function AboutPage() {
  const cmsData = await getAboutPage()

  const heroTitle = cmsData?.title ?? "Добро пожаловать в WiFly"
  const cmsContent = cmsData?.content ?? null

  return (
    <div style={{ background: "var(--ce-bg)" }}>

      {/* Hero — title from CMS */}
      <section className="ce-section" style={{ textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -160, right: -100, width: 440, height: 440, background: "radial-gradient(circle, var(--ce-primary-soft) 0%, transparent 65%)", filter: "blur(20px)", opacity: 0.7, pointerEvents: "none" }} />
        <div className="ce-wrap" style={{ position: "relative" }}>
          <span className="ce-eyebrow" style={{ marginBottom: 20 }}>О нас</span>
          <h1 className="ce-h-display" style={{ fontSize: "clamp(36px, 5vw, 60px)", margin: "0 auto 24px", maxWidth: 700 }}>
            {heroTitle}
          </h1>
          {/* Intro paragraph + mission from CMS Portable Text */}
          {cmsContent ? (
            <div style={{ fontSize: 18, color: "var(--ce-text-2)", maxWidth: 680, margin: "0 auto", lineHeight: 1.7, textAlign: "left" }}>
              <PortableText value={cmsContent} />
            </div>
          ) : (
            <p style={{ fontSize: 18, color: "var(--ce-text-2)", maxWidth: 680, margin: "0 auto", lineHeight: 1.7 }}>
              Ведущая ИТ-компания, специализирующаяся на облачных сервисах и разработке инновационных программных продуктов для бизнеса. Мы создаём и поддерживаем высокотехнологичные решения, которые помогают клиентам в России и за её пределами эффективно собирать, обрабатывать и использовать данные для развития бизнеса.
            </p>
          )}
        </div>
      </section>

      {/* Services */}
      <section className="ce-section">
        <div className="ce-wrap">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="ce-eyebrow" style={{ marginBottom: 12 }}>Продукты</span>
            <h2 className="ce-h-display" style={{ fontSize: "clamp(28px, 4vw, 44px)", margin: 0 }}>Что мы делаем</h2>
          </div>
          <div className="ce-about-services" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {services.map((s) => (
              <div key={s.title} className="ce-card" style={{ padding: 28, display: "flex", gap: 20 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "var(--ce-primary-soft)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {s.icon}
                </div>
                <div>
                  <h3 style={{ fontFamily: "var(--font-unbounded), sans-serif", fontWeight: 600, fontSize: 15, color: "var(--ce-text)", margin: "0 0 8px" }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: "var(--ce-text-2)", lineHeight: 1.65, margin: 0 }}>{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="ce-section">
        <div className="ce-wrap">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="ce-eyebrow" style={{ marginBottom: 12 }}>Экосистема</span>
            <h2 className="ce-h-display" style={{ fontSize: "clamp(28px, 4vw, 44px)", margin: 0 }}>Наши проекты</h2>
          </div>
          {/* WiFly.ru — flagship */}
          <a
            href="https://wifly.ru"
            target="_blank"
            rel="noopener noreferrer"
            className="ce-project-card ce-project-flagship"
            style={{
              display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 40,
              background: "linear-gradient(135deg, #0057cc 0%, #0080FF 100%)",
              borderRadius: 24, padding: "40px 48px", marginBottom: 16,
              textDecoration: "none", color: "#fff",
              position: "relative", overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", right: -80, top: -80, width: 300, height: 300, border: "1px solid rgba(255,255,255,.12)", borderRadius: "50%", pointerEvents: "none" }} />
            <div style={{ position: "absolute", right: -30, top: -30, width: 180, height: 180, border: "1px solid rgba(255,255,255,.18)", borderRadius: "50%", pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,.7)", marginBottom: 10 }}>Флагманский продукт · Wi-Fi маркетинг</div>
              <h3 style={{ fontFamily: "var(--font-unbounded), sans-serif", fontWeight: 700, fontSize: "clamp(22px, 2.5vw, 30px)", color: "#fff", margin: "0 0 12px" }}>WiFly.ru</h3>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,.85)", lineHeight: 1.65, margin: "0 0 24px", maxWidth: 560 }}>
                Платформа Wi-Fi маркетинга для офлайн-бизнеса. Собирает клиентские данные через гостевой Wi-Fi, MAC-радар и SMS-радар — помогает превращать посетителей в лояльных клиентов.
              </p>
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                {[{ v: "2 000+", l: "клиентов" }, { v: "с 2009", l: "на рынке" }, { v: "3 000+", l: "точек Wi-Fi" }].map((s, i) => (
                  <div key={i}>
                    <div style={{ fontFamily: "var(--font-unbounded), sans-serif", fontWeight: 700, fontSize: 20, color: "#fff" }}>{s.v}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,.65)", marginTop: 2 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
              <div style={{ width: 72, height: 72, borderRadius: 20, background: "rgba(255,255,255,.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/>
                  <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="#fff"/>
                </svg>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,.8)", fontWeight: 500 }}>
                Открыть сайт
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </div>
            </div>
          </a>

          {/* Secondary projects */}
          <div className="ce-about-projects" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {[
              { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/></svg>, name: "TutWiFi.ru", tag: "Wi-Fi карта", desc: "Бесплатная интерактивная карта точек доступа Wi-Fi по России и СНГ. Более 3 000 верифицированных точек: кафе, ТЦ, отели, аэропорты.", href: "https://tutwifi.ru", color: "#2563EB" },
              { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, name: "WiFiSpeed.is", tag: "Тест скорости", desc: "Бесплатный тест скорости интернета. Измеряет скачивание, выгрузку, пинг и джиттер — без регистрации, через 12 серверов по всему миру.", href: "https://wifispeed.is/ru", color: "#059669" },
              { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, name: "ClientPulse.ru", tag: "CDP платформа", desc: "Платформа клиентских данных для роста продаж. Объединяет данные из онлайна и офлайна в единый профиль клиента для персонализированного маркетинга.", href: "https://clientpulse.ru", color: "#7C3AED" },
              { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>, name: "CallEmily.ru", tag: "Голосовой ИИ", desc: "Голосовой AI-ассистент для ресторанов, клиник и автосалонов. Принимает звонки 24/7, бронирует и записывает, передаёт данные в CRM.", href: "https://callemily.eu", color: "#E85D2C" },
            ].map((p, i) => (
              <a key={i} href={p.href} target="_blank" rel="noopener noreferrer"
                style={{ display: "block", background: "var(--ce-surface)", border: "1px solid var(--ce-border)", borderRadius: 20, padding: 24, textDecoration: "none", transition: "box-shadow .2s, border-color .2s" }}
                className="ce-project-card"
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${p.color}18`, display: "flex", alignItems: "center", justifyContent: "center", color: p.color }}>{p.icon}</div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ce-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: p.color, marginBottom: 4 }}>{p.tag}</div>
                <h3 style={{ fontFamily: "var(--font-unbounded), sans-serif", fontWeight: 700, fontSize: 15, color: "var(--ce-text)", margin: "0 0 8px" }}>{p.name}</h3>
                <p style={{ fontSize: 13, color: "var(--ce-text-2)", lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="ce-section" style={{ background: "var(--ce-surface)", borderTop: "1px solid var(--ce-border)", borderBottom: "1px solid var(--ce-border)" }}>
        <div className="ce-wrap">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="ce-eyebrow" style={{ marginBottom: 12 }}>Преимущества</span>
            <h2 className="ce-h-display" style={{ fontSize: "clamp(28px, 4vw, 44px)", margin: 0 }}>Почему выбирают WiFly</h2>
          </div>
          <div className="ce-about-benefits" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {benefits.map((b) => (
              <div key={b.title} style={{ background: "var(--ce-bg)", border: "1px solid var(--ce-border)", borderRadius: 20, padding: 24, textAlign: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--ce-primary-soft)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>{b.icon}</div>
                <h3 style={{ fontFamily: "var(--font-unbounded), sans-serif", fontWeight: 600, fontSize: 13, color: "var(--ce-text)", margin: "0 0 8px", lineHeight: 1.4 }}>{b.title}</h3>
                <p style={{ fontSize: 13, color: "var(--ce-text-2)", lineHeight: 1.6, margin: 0 }}>{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="ce-section">
        <div className="ce-wrap">
          <div style={{ background: "var(--ce-text)", borderRadius: 32, padding: "56px 48px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -80, right: -80, width: 320, height: 320, background: "radial-gradient(circle, rgba(232,93,44,.3) 0%, transparent 65%)", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <span className="ce-eyebrow" style={{ color: "rgba(255,255,255,.5)", marginBottom: 20 }}>Результаты</span>
              <h2 style={{ fontFamily: "var(--font-unbounded), sans-serif", fontWeight: 700, fontSize: "clamp(26px, 4vw, 40px)", color: "#fff", margin: "0 0 20px", lineHeight: 1.15 }}>Наши достижения</h2>
              <p style={{ fontSize: 17, color: "rgba(255,255,255,.7)", maxWidth: 620, margin: "0 auto", lineHeight: 1.7 }}>
                WiFly оцифровывает клиентские данные для более чем 2000 брендов, помогая им выстраивать эффективные коммуникации и увеличивать продажи. Мы гордимся тем, что наши решения делают бизнес наших клиентов более успешным и конкурентоспособным.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="ce-section" style={{ background: "var(--ce-surface)", borderTop: "1px solid var(--ce-border)" }}>
        <div className="ce-wrap" style={{ textAlign: "center" }}>
          <span className="ce-eyebrow" style={{ marginBottom: 16 }}>Контакты</span>
          <h2 className="ce-h-display" style={{ fontSize: "clamp(28px, 4vw, 44px)", margin: "0 0 16px" }}>Свяжитесь с нами</h2>
          <p style={{ fontSize: 17, color: "var(--ce-text-2)", maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.65 }}>
            Хотите узнать больше о наших сервисах или подключиться к экосистеме WiFly? Свяжитесь с нами удобным способом:
          </p>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
            <a href="tel:88005058594" style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 16, color: "var(--ce-primary)", textDecoration: "none", fontWeight: 500 }}>
              <span style={{ width: 36, height: 36, borderRadius: 10, background: "var(--ce-primary-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ce-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </span>
              8 800 505 85 94
            </a>
            <a href="mailto:welcome@wifly.ru" style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 16, color: "var(--ce-primary)", textDecoration: "none", fontWeight: 500 }}>
              <span style={{ width: 36, height: 36, borderRadius: 10, background: "var(--ce-primary-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ce-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </span>
              welcome@wifly.ru
            </a>
            <a href="https://wifly.ru" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 16, color: "var(--ce-primary)", textDecoration: "none", fontWeight: 500 }}>
              <span style={{ width: 36, height: 36, borderRadius: 10, background: "var(--ce-primary-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ce-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </span>
              wifly.ru
            </a>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 860px) {
          .ce-about-services { grid-template-columns: 1fr !important; }
          .ce-about-benefits { grid-template-columns: repeat(2, 1fr) !important; }
          .ce-about-projects { grid-template-columns: repeat(2, 1fr) !important; }
          .ce-project-flagship { grid-template-columns: 1fr !important; padding: 32px 28px !important; }
        }
        @media (max-width: 520px) {
          .ce-about-benefits { grid-template-columns: 1fr !important; }
          .ce-about-projects { grid-template-columns: 1fr !important; }
        }
        .ce-project-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,.08); border-color: var(--ce-border-strong) !important; }
        .ce-project-flagship:hover { opacity: .95; }
      `}</style>
    </div>
  )
}
