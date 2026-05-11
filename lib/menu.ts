import { EMDASH_URL } from "./emdash"

export interface MenuItem {
  id: string
  label: string
  url: string
  target: string | null
  sort_order: number
  parent_id: string | null
}

export async function getMenu(name: string): Promise<MenuItem[]> {
  if (!EMDASH_URL) return []
  try {
    const res = await fetch(`${EMDASH_URL}/_emdash/api/menus/${name}`, {
      headers: { Authorization: `Bearer ${process.env.EMDASH_API_TOKEN ?? ""}` },
      next: { revalidate: 60, tags: [`menu-${name}`] },
    })
    if (!res.ok) return []
    const json = await res.json()
    const items: MenuItem[] = (json.data?.items ?? [])
      .filter((i: { parent_id: string | null }) => !i.parent_id)
      .sort((a: MenuItem, b: MenuItem) => a.sort_order - b.sort_order)
      .map((i: { id: string; label: string; custom_url: string | null; target: string | null; sort_order: number; parent_id: string | null }) => ({
        id: i.id,
        label: i.label,
        url: i.custom_url ?? "/",
        target: i.target,
        sort_order: i.sort_order,
        parent_id: i.parent_id,
      }))
    return items
  } catch {
    return []
  }
}
