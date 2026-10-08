import { describe, expect, it } from 'vitest'
import { type Product, productCountWord, productHref, products } from './index'

function bySlug(slug: string): Product {
  const product = products.find((p) => p.slug === slug)
  if (!product) throw new Error(`no product with slug ${slug}`)
  return product
}

describe('products', () => {
  it('lists thirteen products with unique slugs and art cells', () => {
    expect(products).toHaveLength(13)
    expect(new Set(products.map((p) => p.slug)).size).toBe(13)
    expect(new Set(products.map((p) => p.art.cell)).size).toBe(13)
    expect(productCountWord).toBe('thirteen')
  })

  it('links every product, proof and worksheet over https', () => {
    for (const product of products) {
      expect(product.href).toMatch(/^https:\/\//)
      expect(product.proof.href).toMatch(/^https:\/\//)
      if (product.worksheet) expect(product.worksheet.href).toMatch(/^https:\/\//)
    }
  })

  it('builds the same decebaldobrica.com product URL as before the shared catalog', () => {
    expect(productHref(bySlug('allsource'), 'product', 'decebaldobrica.com')).toBe(
      'https://www.all-source.xyz/?utm_source=decebaldobrica.com&utm_medium=portfolio&utm_campaign=product_directory&utm_content=allsource_product&bet=allsource'
    )
  })

  it('builds the same wolventech.com proof URL as before the shared catalog', () => {
    expect(productHref(bySlug('chargewindow'), 'proof', 'wolventech.com')).toBe(
      'https://chargewindow.com/guides/ev-charging-fees?utm_source=wolventech.com&utm_medium=portfolio&utm_campaign=product_directory&utm_content=chargewindow_proof&bet=chargewindow'
    )
  })

  it('includes Job Breakdown and Saved Ledger without worksheets', () => {
    expect(bySlug('jobbreakdown').name).toBe('Job Breakdown')
    expect(bySlug('saved-ledger').name).toBe('Saved Ledger')
    expect(bySlug('jobbreakdown').worksheet).toBeUndefined()
    expect(bySlug('saved-ledger').worksheet).toBeUndefined()
  })
})
