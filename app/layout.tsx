import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Unbounded, Onest } from "next/font/google"
import CookieConsent from "@/components/cookie-consent"
import AnalyticsProvider from "@/components/analytics/analytics-provider"
import "./cookie-consent.css"
import { Suspense } from "react"
import EnvFixScript from "@/components/env-fix-script"
import Script from "next/script"
import { headers } from "next/headers"
import TrackingScripts from "@/components/tracking-scripts"

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
    default: "CallEmily — AI Voice Assistant for Restaurants & Clinics",
    template: "%s | CallEmily",
  },
  description: "Automate table reservations and appointment booking with CallEmily. AI voice assistant answers calls 24/7 and integrates with your CRM.",
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
    title: "CallEmily — AI Voice Assistant for Restaurants & Clinics",
    description: "Automate table reservations and appointment booking with CallEmily. AI voice assistant answers calls 24/7 and integrates with your CRM.",
    url: siteUrl,
    siteName: "CallEmily",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CallEmily — AI Voice Assistant for Restaurants & Clinics",
    description: "Automate table reservations and appointment booking with CallEmily. AI voice assistant answers calls 24/7.",
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
      { url: "./favicon.ico", sizes: "any" },
      { url: "./favicon.svg", type: "image/svg+xml" },
      { url: "./favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "./favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "./favicon-96x96.png", type: "image/png", sizes: "96x96" },
    ],
    shortcut: "./favicon.ico",
    apple: "./apple-touch-icon.png",
    other: [
      {
        rel: "mask-icon",
        url: "./favicon.svg",
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
        {/* Preconnect to critical external origins */}
        <link rel="dns-prefetch" href="https://mc.yandex.ru" />
        <link rel="dns-prefetch" href="https://app.web-metrics.ru" />
      </head>
      <body>
        <EnvFixScript />
        <Suspense>
          {children}
          <CookieConsent />
          <AnalyticsProvider />
          <TrackingScripts />
        </Suspense>
        {/* EuroMetrics Analytics */}
        <Script
          src="https://app.eurometrics.eu/script.js"
          data-website-id="56985db8-a52a-4f95-b5f5-b75248508d3f"
          strategy="afterInteractive"
        />
</body>
    </html>
  )
}
