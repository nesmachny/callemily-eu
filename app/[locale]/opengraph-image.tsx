import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const content: Record<string, { title: string; subtitle: string; alt: string }> = {
  ru: {
    title: 'Голосовой помощник для ресторанов',
    subtitle: 'Автоматизируйте бронирование столиков и увеличивайте бронирования на 20–30%',
    alt: 'CallEmily — голосовой ИИ для ресторанов',
  },
  kk: {
    title: 'Мейрамханаларға арналған дауыстық көмекші',
    subtitle: 'Үстел брондауды автоматтандырыңыз және брондауларды 20-30% арттырыңыз',
    alt: 'CallEmily — мейрамханаларға арналған дауыстық ЖИ',
  },
  uz: {
    title: 'Restoranlar uchun ovozli yordamchi',
    subtitle: 'Stol bronlashni avtomatlashtiryp, bronlashlarni 20-30% oshiring',
    alt: 'CallEmily — restoranlar uchun ovozli AI',
  },
}

export async function generateAltText({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return (content[locale] || content.ru).alt
}

export default async function OGImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = content[locale] || content.ru

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
          {[['14 дней', 'триал бесплатно'], ['24/7', 'без перерывов'], ['2–4 мес', 'средний ROI']].map(([v, l]) => (
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
