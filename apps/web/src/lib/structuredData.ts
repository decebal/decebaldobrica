import { config } from '@/lib/personalConfig'

export const PERSON_ID = `${config.website}/#person`
export const WEBSITE_ID = `${config.website}/#website`
export const WOLVEN_ID = 'https://wolventech.com/#organization'

export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: config.name,
    url: config.website,
    image: `${config.website}/images/avatar.jpg`,
    jobTitle: config.professional.currentRole,
    description: config.metaDescription,
    sameAs: [config.socialLinks.github, config.socialLinks.linkedin, config.socialLinks.twitter],
    worksFor: {
      '@type': 'Organization',
      '@id': WOLVEN_ID,
      name: config.professional.currentCompany,
      url: config.wolvenTechUrl,
    },
    workLocation: {
      '@type': 'Place',
      name: 'London and remote UK',
    },
    knowsAbout: [
      'Rust systems engineering',
      'Event sourcing',
      'AI agent memory',
      'Agentic AI architecture',
      'Technical leadership',
      'Founding engineer and zero-to-one delivery',
    ],
  }
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: `${config.name} — Rust systems and agentic AI`,
    url: config.website,
    inLanguage: 'en',
    publisher: { '@id': PERSON_ID },
  }
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${config.website}${item.path}`,
    })),
  }
}

export function serviceSchema(input: {
  name: string
  description: string
  path: string
  areaServed?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input.name,
    description: input.description,
    url: `${config.website}${input.path}`,
    provider: { '@id': PERSON_ID },
    areaServed: input.areaServed ?? 'Worldwide',
    serviceType: input.name,
  }
}

export function articleSchema(input: {
  title: string
  description: string
  path: string
  datePublished?: string
  image?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    url: `${config.website}${input.path}`,
    datePublished: input.datePublished,
    author: { '@id': PERSON_ID },
    publisher: { '@id': PERSON_ID },
    image: input.image
      ? `${config.website}${input.image}`
      : `${config.website}/opengraph-image.png`,
    inLanguage: 'en',
  }
}

export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}
