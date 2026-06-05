import Header from "@/components/header"
import { getMenu } from "@/lib/menu"

export default async function HeaderServer({ transparent }: { transparent?: boolean }) {
  const navItems = await getMenu("primary")
  return <Header transparent={transparent} navItems={navItems} />
}
