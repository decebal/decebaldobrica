import catalogData from '../catalog.json'

export type Proof = {
  label: string
  href: string
}

export type Worksheet = {
  label: string
  href: string
}

export type Art = {
  cell: number
  alt: string
}

export type Product = {
  slug: string
  bet: string
  name: string
  href: string
  category: string
  description: string
  audience: string
  outcome: string
  proof: Proof
  worksheet?: Worksheet
  access: string
  cta: string
  art: Art
}

export const products: Product[] = catalogData.products

const countWords = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
  'twenty',
]

export const productCountWord = countWords[products.length] ?? String(products.length)

export function productHref(
  product: Product,
  surface: 'product' | 'proof',
  source: 'decebaldobrica.com' | 'wolventech.com'
): string {
  const url = new URL(surface === 'product' ? product.href : product.proof.href)
  url.searchParams.set('utm_source', source)
  url.searchParams.set('utm_medium', 'portfolio')
  url.searchParams.set('utm_campaign', 'product_directory')
  url.searchParams.set('utm_content', `${product.slug}_${surface}`)
  url.searchParams.set('bet', product.slug)
  return url.toString()
}
