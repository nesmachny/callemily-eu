import type { ReactNode } from "react"

interface PTBlock {
  _type: string
  _key?: string
  style?: string
  children?: PTSpan[]
  level?: number
  listItem?: string
  markDefs?: { _key: string; _type: string; href?: string }[]
  asset?: { url?: string; _ref?: string }
  alt?: string
  caption?: string
  url?: string
  language?: string
  code?: string
}

interface PTSpan {
  _type: "span"
  _key?: string
  text: string
  marks?: string[]
}

function renderSpan(span: PTSpan, markDefs: PTBlock["markDefs"] = []): ReactNode {
  let node: ReactNode = span.text
  if (!span.marks?.length) return node

  for (const mark of span.marks) {
    if (mark === "strong") node = <strong key={mark}>{node}</strong>
    else if (mark === "em") node = <em key={mark}>{node}</em>
    else if (mark === "code") node = <code key={mark} style={{ background: "var(--ce-surface)", padding: "2px 6px", borderRadius: 4, fontSize: "0.9em", fontFamily: "monospace" }}>{node}</code>
    else if (mark === "underline") node = <u key={mark}>{node}</u>
    else {
      const def = markDefs?.find(d => d._key === mark)
      if (def?._type === "link" && def.href) {
        node = <a key={mark} href={def.href} target={def.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" style={{ color: "var(--ce-primary)", textDecoration: "underline" }}>{node}</a>
      }
    }
  }
  return node
}

function renderBlock(block: PTBlock, idx: number): ReactNode {
  if (block._type === "image") {
    return (
      <figure key={block._key ?? idx} style={{ margin: "32px 0" }}>
        {block.asset?.url && (
          <img src={block.asset.url} alt={block.alt ?? ""} style={{ width: "100%", borderRadius: 12 }} />
        )}
        {block.caption && (
          <figcaption style={{ fontSize: 13, color: "var(--ce-muted)", textAlign: "center", marginTop: 8 }}>{block.caption}</figcaption>
        )}
      </figure>
    )
  }

  if (block._type === "code") {
    return (
      <pre key={block._key ?? idx} style={{ background: "var(--ce-text)", color: "#fff", padding: "20px 24px", borderRadius: 12, overflowX: "auto", fontSize: 14, lineHeight: 1.6, margin: "28px 0" }}>
        <code>{block.code}</code>
      </pre>
    )
  }

  if (block._type !== "block") return null

  const children = block.children?.map((span, i) => (
    <span key={span._key ?? i}>{renderSpan(span, block.markDefs)}</span>
  ))

  const baseStyle: React.CSSProperties = { lineHeight: 1.75, margin: "0 0 20px", color: "var(--ce-text)" }

  if (block.listItem === "bullet") {
    return <li key={block._key ?? idx} style={{ ...baseStyle, marginBottom: 8 }}>{children}</li>
  }
  if (block.listItem === "number") {
    return <li key={block._key ?? idx} style={{ ...baseStyle, marginBottom: 8 }}>{children}</li>
  }

  switch (block.style) {
    case "h1": return <h1 key={block._key ?? idx} style={{ ...baseStyle, fontFamily: "var(--font-unbounded), sans-serif", fontWeight: 700, fontSize: "clamp(24px, 3vw, 36px)", margin: "40px 0 16px" }}>{children}</h1>
    case "h2": return <h2 key={block._key ?? idx} style={{ ...baseStyle, fontFamily: "var(--font-unbounded), sans-serif", fontWeight: 700, fontSize: "clamp(20px, 2.5vw, 28px)", margin: "36px 0 14px" }}>{children}</h2>
    case "h3": return <h3 key={block._key ?? idx} style={{ ...baseStyle, fontFamily: "var(--font-unbounded), sans-serif", fontWeight: 600, fontSize: "clamp(17px, 2vw, 22px)", margin: "28px 0 12px" }}>{children}</h3>
    case "blockquote": return <blockquote key={block._key ?? idx} style={{ borderLeft: "3px solid var(--ce-primary)", paddingLeft: 20, margin: "28px 0", color: "var(--ce-text-2)", fontStyle: "italic", fontSize: 17 }}>{children}</blockquote>
    default: return <p key={block._key ?? idx} style={{ ...baseStyle, fontSize: 17 }}>{children}</p>
  }
}

export default function PortableText({ value }: { value: unknown[] }) {
  const blocks = value as PTBlock[]
  const result: ReactNode[] = []
  let i = 0

  while (i < blocks.length) {
    const block = blocks[i]

    if (block.listItem === "bullet") {
      const items: ReactNode[] = []
      while (i < blocks.length && blocks[i].listItem === "bullet") {
        items.push(renderBlock(blocks[i], i))
        i++
      }
      result.push(<ul key={`ul-${i}`} style={{ paddingLeft: 24, margin: "0 0 20px" }}>{items}</ul>)
      continue
    }

    if (block.listItem === "number") {
      const items: ReactNode[] = []
      while (i < blocks.length && blocks[i].listItem === "number") {
        items.push(renderBlock(blocks[i], i))
        i++
      }
      result.push(<ol key={`ol-${i}`} style={{ paddingLeft: 24, margin: "0 0 20px" }}>{items}</ol>)
      continue
    }

    result.push(renderBlock(block, i))
    i++
  }

  return <div style={{ fontSize: 17, lineHeight: 1.75 }}>{result}</div>
}
