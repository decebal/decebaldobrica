import type { ReactNode } from 'react'

/**
 * Recursively extract the plain text from a React node tree.
 *
 * Used to recover raw code from a fenced block after rehype-highlight has
 * turned the body into nested token elements (where `String(children)` would
 * yield "[object Object]"). Lives in a server-safe module so it can be called
 * from both server components (the blog renderer) and client components.
 */
export function extractText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node)
  }

  if (Array.isArray(node)) {
    return node.map(extractText).join('')
  }

  if (node && typeof node === 'object' && 'props' in node) {
    return extractText((node.props as { children?: ReactNode }).children)
  }

  return ''
}
