import { revalidateTag, revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

const LOCALES = ["ru", "kk", "uz"]

// Webhook receiver for EmDash on-demand ISR
// Configure in EmDash admin → Plugins → Webhook Notifier
// Webhook URL: https://callemily.ru/api/revalidate
// Secret: same as REVALIDATION_SECRET in .env
export async function POST(request: NextRequest) {
  const auth = request.headers.get("authorization")
  if (!process.env.REVALIDATION_SECRET || auth !== `Bearer ${process.env.REVALIDATION_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { collection, metadata } = body

  revalidateTag(collection)
  if (metadata?.slug) revalidateTag(`${collection}:${metadata.slug}`)

  for (const locale of LOCALES) {
    revalidatePath(`/${locale}`)
    revalidatePath(`/${locale}/blog`)
    if (metadata?.slug) revalidatePath(`/${locale}/blog/${metadata.slug}`)
  }

  return NextResponse.json({ revalidated: true, collection, slug: metadata?.slug })
}
