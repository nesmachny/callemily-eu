import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const alt = 'CallEmily — AI voice assistant for restaurants and clinics'
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
          AI voice assistant for restaurants
        </h1>
        <p
          style={{
            fontSize: '24px',
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.4,
          }}
        >
          Automate bookings and capture 20–30% more inbound calls
        </p>
      </div>
    ),
    { ...size }
  )
}
