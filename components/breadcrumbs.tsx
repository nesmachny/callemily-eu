"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumbs({ items = [], className = "" }: BreadcrumbsProps) {
  const pathname = usePathname()

  // Автоматически генерируем хлебные крошки на основе пути
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    // Всегда начинаем с главной страницы
    const defaultItems: BreadcrumbItem[] = [{ label: "Главная", href: "/" }]

    // Если предоставлены пользовательские элементы, используем их
    if (items.length > 0) {
      return [...defaultItems, ...items]
    }

    // Иначе генерируем на основе пути
    if (pathname === "/") {
      return defaultItems
    }

    // Обрабатываем известные пути
    if (pathname === "/price") {
      return [...defaultItems, { label: "Тарифы", href: "/price" }]
    }

    // Для неизвестных путей просто используем последний сегмент пути
    const segments = pathname.split("/").filter(Boolean)
    if (segments.length > 0) {
      const lastSegment = segments[segments.length - 1]
      return [...defaultItems, { label: lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1), href: pathname }]
    }

    return defaultItems
  }

  const breadcrumbs = generateBreadcrumbs()

  // Создаем схему для хлебных крошек
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${process.env.NEXT_PUBLIC_SITE_URL}${item.href === "/" ? "" : item.href}`,
    })),
  }

  return (
    <>
      <nav aria-label="Хлебные крошки" className={`py-2 ${className}`}>
        <ol className="flex flex-wrap items-center text-sm">
          {breadcrumbs.map((item, index) => (
            <li key={item.href} className="flex items-center">
              {index > 0 && <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-gray-600" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="text-[#4A90E2] hover:underline">
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  )
}
