import type { MetadataRoute } from "next"
import { cms } from "@/lib/emdash"

const LOCALES = ["en", "pt"]
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://callemily.eu"

interface PostItem {
  slug: string | null
  id: string
  publishedAt: string | null
}

async function getPublishedPosts(): Promise<PostItem[]> {
  if (!cms) return []
  try {
    const result = await cms.list("posts", { status: "published" })
    return (result.items as PostItem[]) || []
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    { path: "", freq: "weekly" as const, pri: 1.0 },
    { path: "/price", freq: "monthly" as const, pri: 0.9 },
    { path: "/blog", freq: "weekly" as const, pri: 0.8 },
    { path: "/about", freq: "monthly" as const, pri: 0.7 },
    { path: "/roicalc", freq: "monthly" as const, pri: 0.7 },
    { path: "/privacy", freq: "monthly" as const, pri: 0.3 },
  ]

  const staticEntries = LOCALES.flatMap((locale) =>
    staticPages.map(({ path, freq, pri }) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified: new Date().toISOString(),
      changeFrequency: freq,
      priority: pri,
    }))
  )

  const posts = await getPublishedPosts()
  const postEntries = LOCALES.flatMap((locale) =>
    posts.map((post) => ({
      url: `${siteUrl}/${locale}/blog/${post.slug ?? post.id}`,
      lastModified: post.publishedAt || new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))
  )

  return [...staticEntries, ...postEntries]
}
