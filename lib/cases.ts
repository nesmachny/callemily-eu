import { cms } from "@/lib/emdash"

export interface CaseItem {
  slug: string
  name: string
  quote: string
  stat: string
  statLabel: string
  tag: string
  author: string
  photo: string
}

function parseMeta(content: unknown[]): Record<string, string> {
  const meta: Record<string, string> = {}
  for (const block of content as { _type?: string; children?: { text?: string }[] }[]) {
    const text = block.children?.[0]?.text ?? ""
    if (text.startsWith("stat:")) {
      text.split("|").forEach(pair => {
        const [k, ...rest] = pair.split(":")
        meta[k] = rest.join(":")
      })
    }
  }
  return meta
}

const FALLBACK: CaseItem[] = [
  {
    slug: "case-vkusny-ugolok",
    name: "«Вкусный уголок»",
    quote: "Раньше теряли треть звонков вечером — администратор не успевал. Сейчас Эмилия закрывает все звонки, и мы видим прирост по выручке.",
    stat: "+27%", statLabel: "бронирований",
    tag: "Ресторан · Москва",
    author: "Анна Лесина, операционный директор",
    photo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "case-klinika-1",
    name: "«Клиника №1»",
    quote: "Подключили за два дня к нашей МИС. Колл-центр сократили вдвое, качество записи выросло — пациенты не висят на линии.",
    stat: "−42%", statLabel: "пропущенных вызовов",
    tag: "Сеть клиник · СПб",
    author: "Михаил Орлов, IT-директор",
    photo: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "case-hyundai-vostok",
    name: "Hyundai «Восток»",
    quote: "Звонки после 21:00 — раньше уходили в никуда. Теперь горячие лиды на тест-драйв падают в CMS в любое время.",
    stat: "₽3,2М", statLabel: "доп. выручки за квартал",
    tag: "Автосалон · Казань",
    author: "Тимур Гимадиев, руководитель отдела продаж",
    photo: "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=800&q=80",
  },
]

export async function getCases(): Promise<CaseItem[]> {
  if (!cms) return FALLBACK
  try {
    const result = await cms.list("posts", { status: "published" })
    const cases = result.items
      .filter((p: { slug: string | null }) => p.slug?.startsWith("case-"))
      .map((p: { slug: string; data: { title?: string; excerpt?: string; content?: unknown[] } }) => {
        const meta = parseMeta(p.data.content ?? [])
        return {
          slug: p.slug,
          name: p.data.title ?? "",
          quote: p.data.excerpt ?? "",
          stat: meta.stat ?? "",
          statLabel: meta.statLabel ?? "",
          tag: meta.tag ?? "",
          author: meta.author ?? "",
          photo: meta.photo ?? "",
        }
      })
    return cases.length ? cases : FALLBACK
  } catch {
    return FALLBACK
  }
}
