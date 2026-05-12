import Header from "@/components/header"

export default async function HeaderServer({ transparent }: { transparent?: boolean }) {
  return <Header transparent={transparent} />
}
