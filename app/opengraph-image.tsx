import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const alt = 'CallEmily - Голосовой помощник для ресторанов'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          padding: '60px 80px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: '#A3CFFA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
            }}
          >
            📞
          </div>
          <span style={{ fontSize: '32px', fontWeight: 700, color: '#A3CFFA' }}>
            CallEmily
          </span>
        </div>
        <h1
          style={{
            fontSize: '56px',
            fontWeight: 800,
            color: 'white',
            lineHeight: 1.2,
            marginBottom: '16px',
          }}
        >
          Голосовой помощник для ресторанов
        </h1>
        <p
          style={{
            fontSize: '24px',
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.4,
          }}
        >
          Автоматизируйте бронирование столиков и увеличивайте бронирования на 20–30%
        </p>
      </div>
    ),
    { ...size }
  )
}
