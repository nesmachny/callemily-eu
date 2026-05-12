import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { cms } from "@/lib/emdash"
import { LOCALES } from "@/lib/i18n"
import PortableText from "@/components/portable-text"
import { t } from "@/lib/translations"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://callemily.eu"

interface PostData {
  title?: string
  excerpt?: string
  content?: unknown[]
  featuredImage?: { url?: string; alt?: string } | null
}

async function getPost(slug: string) {
  if (!cms) return null
  try {
    const result = await cms.list("posts", { status: "published" })
    const post = result.items.find(
      (p: { slug: string | null; id: string }) => p.slug === slug || p.id === slug
    )
    return post ?? null
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const tr = t(locale).blog
  const post = await getPost(slug)
  if (!post) return { title: tr.notFoundTitle }
  const data = post.data as PostData
  return {
    title: `${data.title ?? tr.articleFallback} | CallEmily`,
    description: data.excerpt ?? undefined,
    alternates: { canonical: `${siteUrl}/${locale}/blog/${slug}` },
    openGraph: {
      title: data.title,
      description: data.excerpt,
      images: data.featuredImage?.url ? [{ url: data.featuredImage.url }] : undefined,
    },
  }
}

export async function generateStaticParams() {
  if (!cms) return LOCALES.map(locale => ({ locale, slug: "placeholder" }))
  try {
    const result = await cms.list("posts", { status: "published" })
    return LOCALES.flatMap(locale =>
      result.items.map((p: { slug: string | null; id: string }) => ({
        locale,
        slug: p.slug ?? p.id,
      }))
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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const tr = t(locale).blog
  const post = await getPost(slug)
  if (!post) notFound()

  const data = post.data as PostData

  return (
    <article>
      {/* Hero */}
      <div style={{ background: "var(--ce-surface)", borderBottom: "1px solid var(--ce-border)", padding: "64px 0 48px" }}>
        <div className="ce-wrap" style={{ maxWidth: 760 }}>
          <Link
            href={`/${locale}/blog`}
            style={{ fontSize: 13, color: "var(--ce-muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 28 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
            {tr.allArticles}
          </Link>
          {post.publishedAt && (
            <div style={{ fontSize: 13, color: "var(--ce-muted)", marginBottom: 16 }}>{formatDate(post.publishedAt, locale)}</div>
          )}
          <h1 className="ce-h-display" style={{ fontSize: "clamp(28px, 4vw, 48px)", margin: "0 0 20px", lineHeight: 1.2 }}>
            {data.title ?? tr.untitled}
          </h1>
          {data.excerpt && (
            <p style={{ fontSize: 19, color: "var(--ce-text-2)", lineHeight: 1.65, margin: 0 }}>{data.excerpt}</p>
          )}
        </div>
      </div>

      {/* Featured image */}
      {data.featuredImage?.url && (
        <div style={{ background: "var(--ce-surface)" }}>
          <div className="ce-wrap" style={{ maxWidth: 900, padding: "0 var(--ce-wrap-px)" }}>
            <img
              src={data.featuredImage.url}
              alt={data.featuredImage.alt ?? ""}
              style={{ width: "100%", maxHeight: 480, objectFit: "cover", borderRadius: 20, display: "block" }}
            />
          </div>
        </div>
      )}

      {/* Body */}
      <div className="ce-section">
        <div className="ce-wrap" style={{ maxWidth: 760 }}>
          {data.content ? (
            <PortableText value={data.content} />
          ) : (
            <p style={{ color: "var(--ce-muted)" }}>{tr.emptyContent}</p>
          )}
        </div>
      </div>
    </article>
  )
}
