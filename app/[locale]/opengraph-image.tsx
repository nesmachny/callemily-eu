import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const content: Record<string, { title: string; subtitle: string; alt: string }> = {
  en: {
    title: 'AI Voice Assistant for Restaurants & Clinics',
    subtitle: 'Automate reservations and bookings. Answers calls 24/7, boosts conversions by 20–30%.',
    alt: 'CallEmily — AI voice assistant for restaurants and clinics',
  },
  pt: {
    title: 'Assistente de Voz IA para Restaurantes e Clínicas',
    subtitle: 'Automatize reservas e agendamentos. Atende chamadas 24/7, aumenta conversões em 20–30%.',
    alt: 'CallEmily — assistente de voz IA para restaurantes e clínicas',
  },
}

export async function generateAltText({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return (content[locale] || content.en).alt
}

export default async function OGImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = content[locale] || content.en

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #E85D2C 0%, #c94a1f 100%)',
          padding: '60px 80px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '36px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '16px',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px',
          }}>
            📞
          </div>
          <span style={{ fontSize: '28px', fontWeight: 700, color: '#fff' }}>CallEmily</span>
        </div>
        <h1 style={{ fontSize: '54px', fontWeight: 800, color: '#fff', lineHeight: 1.15, margin: '0 0 20px', maxWidth: 900 }}>
          {t.title}
        </h1>
        <p style={{ fontSize: '22px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.4, margin: 0, maxWidth: 800 }}>
          {t.subtitle}
        </p>
        <div style={{ display: 'flex', gap: 32, marginTop: 48 }}>
          {[['14 days', 'free trial'], ['24/7', 'always on'], ['2–4 mo', 'avg ROI']].map(([v, l]) => (
            <div key={v} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>{v}</span>
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
