import type React from "react"

interface SemanticContainerProps {
  children: React.ReactNode
  as?: "section" | "article" | "aside" | "main" | "div"
  id?: string
  className?: string
  ariaLabel?: string
  ariaLabelledby?: string
  role?: string
}

export default function SemanticContainer({
  children,
  as = "section",
  id,
  className,
  ariaLabel,
  ariaLabelledby,
  role,
}: SemanticContainerProps) {
  const Component = as

  return (
    <Component id={id} className={className} aria-label={ariaLabel} aria-labelledby={ariaLabelledby} role={role}>
      {children}
    </Component>
  )
}
