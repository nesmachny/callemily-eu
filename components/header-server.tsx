import Header from "@/components/header"
import { getMenu } from "@/lib/menu"

export default async function HeaderServer({ transparent, locale }: { transparent?: boolean; locale?: string }) {
  const navItems = await getMenu("primary", locale)
  return <Header transparent={transparent} navItems={navItems} />
}
