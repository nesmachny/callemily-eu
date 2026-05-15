import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Unbounded, Onest } from "next/font/google"
import { Suspense } from "react"
import Script from "next/script"
import { headers } from "next/headers"

const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-unbounded",
  display: "swap",
})

const onest = Onest({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-onest",
  display: "swap",
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://callemily.eu"

export const metadata: Metadata = {
  title: {
    default: "CallEmily Voice Assistant for Restaurants and Clinics",
    template: "%s | CallEmily",
  },
  description: "CallEmily voice assistant for restaurants, clinics and car dealerships. Answers calls 24/7, books reservations and increases bookings by 20–30%.",
  keywords: [
    "voice AI assistant",
    "restaurant automation",
    "table reservation",
    "AI for restaurants",
    "CallEmily",
    "voice bot",
  ],
  authors: [{ name: "CallEmily Team" }],
  creator: "CallEmily",
  publisher: "CallEmily",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
    languages: {
      "en": "/",
      "pt": "/",
    },
  },
  openGraph: {
    title: "CallEmily Voice Assistant for Restaurants and Clinics",
    description: "CallEmily voice assistant for restaurants, clinics and car dealerships. Answers calls 24/7, books reservations and increases bookings by 20–30%.",
    url: siteUrl,
    siteName: "CallEmily",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CallEmily Voice Assistant for Restaurants and Clinics",
    description: "CallEmily voice assistant for restaurants, clinics and car dealerships. Answers calls 24/7, books reservations and increases bookings by 20–30%.",
    creator: "@callemily",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "mask-icon",
        url: "/favicon.svg",
        color: "#4A90E2",
      },
    ],
  },
  manifest: `${siteUrl}/site.webmanifest`,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const locale = headersList.get("x-locale") || "en"
  return (
    <html lang={locale} className={`${unbounded.variable} ${onest.variable}`} style={{ fontFamily: 'var(--font-onest), ui-sans-serif, system-ui, sans-serif' }} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#E85D2C" />
      </head>
      <body>
        <Suspense>
          {children}
        </Suspense>
        {/* EuroMetrics Analytics */}
        <Script
          defer
          src="https://app.eurometrics.eu/em.js"
          data-website-id="a3b47208-2dce-4234-8144-8fd92c1be705"
          strategy="afterInteractive"
        />
</body>
    </html>
  )
}
