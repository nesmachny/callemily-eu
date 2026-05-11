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

const FALLBACK_EN: CaseItem[] = [
  {
    slug: "case-o-lugar",
    name: "O Lugar Restaurant",
    quote: "We used to lose a third of evening calls — the receptionist couldn't keep up. Now Emily handles everything and we see the revenue impact directly.",
    stat: "+27%", statLabel: "more bookings",
    tag: "Restaurant · Lisbon",
    author: "Ana Sousa, Operations Director",
    photo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "case-luz-saude",
    name: "Luz Saúde Clinic",
    quote: "Connected to our MIS in two days. We cut the call centre in half and appointment quality went up — patients are no longer left on hold.",
    stat: "−42%", statLabel: "missed calls",
    tag: "Clinic network · Porto",
    author: "Miguel Ferreira, IT Director",
    photo: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "case-bmw-select",
    name: "BMW Select",
    quote: "Calls after 9 PM used to disappear. Now hot test-drive leads land in the CRM around the clock — no missed opportunities.",
    stat: "€2.8M", statLabel: "additional revenue / quarter",
    tag: "Car Dealership · Madrid",
    author: "Carlos Ruiz, Sales Director",
    photo: "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=800&q=80",
  },
]

const FALLBACK_PT: CaseItem[] = [
  {
    slug: "case-o-lugar",
    name: "Restaurante O Lugar",
    quote: "Perdíamos um terço das chamadas ao fim da tarde — o rececionista não conseguia acompanhar. Agora a Emily trata de tudo e vemos o impacto direto na faturação.",
    stat: "+27%", statLabel: "mais reservas",
    tag: "Restaurante · Lisboa",
    author: "Ana Sousa, Directora de Operações",
    photo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "case-luz-saude",
    name: "Clínica Luz Saúde",
    quote: "Ligámos ao nosso sistema em dois dias. Reduzimos o call centre a metade e a qualidade das marcações subiu — os pacientes deixaram de ficar em espera.",
    stat: "−42%", statLabel: "chamadas perdidas",
    tag: "Rede de clínicas · Porto",
    author: "Miguel Ferreira, Director de TI",
    photo: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "case-bmw-select",
    name: "BMW Select",
    quote: "Chamadas depois das 21h iam para o nada. Agora os leads quentes para test drives chegam ao CRM a qualquer hora — sem oportunidades perdidas.",
    stat: "€2,8M", statLabel: "receita adicional / trimestre",
    tag: "Concessionária · Madrid",
    author: "Carlos Ruiz, Director de Vendas",
    photo: "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=800&q=80",
  },
]

export async function getCases(locale = "en"): Promise<CaseItem[]> {
  const fallback = locale === "pt" ? FALLBACK_PT : FALLBACK_EN
  if (!cms) return fallback
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
    return cases.length ? cases : fallback
  } catch {
    return fallback
  }
}
