import type { MetadataRoute } from "next"

const LOCALES = ["ru", "kk", "uz"]

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://callemily.ru"
  const pages = [
    { path: "", freq: "weekly" as const, pri: 1.0 },
    { path: "/price", freq: "monthly" as const, pri: 0.9 },
    { path: "/blog", freq: "weekly" as const, pri: 0.8 },
    { path: "/demo", freq: "monthly" as const, pri: 0.8 },
    { path: "/about", freq: "monthly" as const, pri: 0.7 },
    { path: "/roicalc", freq: "monthly" as const, pri: 0.7 },
    { path: "/privacy", freq: "monthly" as const, pri: 0.3 },
  ]

  return LOCALES.flatMap((locale) =>
    pages.map(({ path, freq, pri }) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified: new Date().toISOString(),
      changeFrequency: freq,
      priority: pri,
    }))
  )
}
