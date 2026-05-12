import type { Metadata } from "next"
import Link from "next/link"
import { cms } from "@/lib/emdash"
import { LOCALES } from "@/lib/i18n"
import { t } from "@/lib/translations"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://callemily.eu"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const tr = t(locale).blog
  return {
    title: tr.metaTitle,
    description: tr.metaDescription,
    alternates: {
      canonical: `${siteUrl}/${locale}/blog`,
      languages: { en: `${siteUrl}/en/blog`, pt: `${siteUrl}/pt/blog`, "x-default": `${siteUrl}/en/blog` },
    },
    openGraph: { url: `${siteUrl}/${locale}/blog` },
  }
}

export function generateStaticParams() {
  return LOCALES.map(locale => ({ locale }))
}

interface Post {
  id: string
  slug: string | null
  publishedAt: string | null
  data: {
    title?: string
    excerpt?: string
    featuredImage?: { url?: string; alt?: string } | null
  }
}

async function getPosts(): Promise<Post[]> {
  if (!cms) return []
  try {
    const result = await cms.list("posts", { status: "published" })
    return (result.items as Post[]).sort((a, b) =>
      new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime()
    )
  } catch {
    return []
  }
}

function formatDate(iso: string | null, locale: string) {
  if (!iso) return ""
  const dateLocale = t(locale).blog.dateLocale
  return new Date(iso).toLocaleDateString(dateLocale, { day: "numeric", month: "long", year: "numeric" })
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const tr = t(locale).blog
  const posts = await getPosts()

  return (
    <section className="ce-section">
      <div className="ce-wrap">
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span className="ce-eyebrow" style={{ marginBottom: 12 }}>{tr.eyebrow}</span>
          <h1 className="ce-h-display" style={{ fontSize: "clamp(32px, 4vw, 52px)", margin: 0 }}>
            {tr.h1}
          </h1>
          <p style={{ fontSize: 18, color: "var(--ce-text-2)", marginTop: 16, maxWidth: 560, margin: "16px auto 0" }}>
            {tr.sub}
          </p>
        </div>

        {posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--ce-muted)" }}>
            <p style={{ fontSize: 16 }}>{tr.empty}</p>
          </div>
        ) : (
          <div className="ce-blog-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
            {posts.map(post => (
              <Link
                key={post.id}
                href={`/${locale}/blog/${post.slug ?? post.id}`}
                style={{ textDecoration: "none", display: "flex", flexDirection: "column" }}
                className="ce-blog-card"
              >
                {post.data.featuredImage?.url && (
                  <div style={{ aspectRatio: "16/9", overflow: "hidden", borderRadius: "16px 16px 0 0", background: "var(--ce-surface)" }}>
                    <img
                      src={post.data.featuredImage.url}
                      alt={post.data.featuredImage.alt ?? ""}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                )}
                <div style={{
                  flex: 1, background: "var(--ce-surface)", border: "1px solid var(--ce-border)",
                  borderTop: post.data.featuredImage?.url ? "none" : undefined,
                  borderRadius: post.data.featuredImage?.url ? "0 0 16px 16px" : 16,
                  padding: "24px",
                }}>
                  {post.publishedAt && (
                    <div style={{ fontSize: 12, color: "var(--ce-muted)", marginBottom: 10 }}>
                      {formatDate(post.publishedAt, locale)}
                    </div>
                  )}
                  <h2 style={{
                    fontFamily: "var(--font-unbounded), sans-serif", fontWeight: 700,
                    fontSize: 17, color: "var(--ce-text)", margin: "0 0 10px", lineHeight: 1.4,
                  }}>
                    {post.data.title ?? tr.untitled}
                  </h2>
                  {post.data.excerpt && (
                    <p style={{ fontSize: 14, color: "var(--ce-text-2)", lineHeight: 1.6, margin: "0 0 16px" }}>
                      {post.data.excerpt}
                    </p>
                  )}
                  <span style={{ fontSize: 13, color: "var(--ce-primary)", fontWeight: 600 }}>
                    {tr.readMore}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <style>{`
        @media (max-width: 860px) { .ce-blog-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 560px) { .ce-blog-grid { grid-template-columns: 1fr !important; } }
        .ce-blog-card:hover > div:last-child { border-color: var(--ce-primary) !important; }
      `}</style>
    </section>
  )
}
