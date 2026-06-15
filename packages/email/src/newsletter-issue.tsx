import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Markdown,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

export interface NewsletterIssueEmailProps {
  /** Post title — rendered as the email's headline. */
  title: string
  /** Inbox preview snippet (excerpt). */
  preview: string
  /** Post body as Markdown. Links should already be absolute URLs. */
  markdown: string
  /** Absolute URL to the full post on the web. */
  postUrl: string
  /** Small eyebrow above the title, e.g. a series name. */
  kicker?: string
  /** Absolute unsubscribe URL. */
  unsubscribeUrl?: string
}

export function NewsletterIssueEmail({
  title,
  preview,
  markdown,
  postUrl,
  kicker = 'New post',
  unsubscribeUrl = 'https://decebaldobrica.com/newsletter/unsubscribe',
}: NewsletterIssueEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Branded header */}
          <Section style={header}>
            <Text style={logo}>DECEBAL DOBRICA</Text>
            <Text style={headerTagline}>Rust · Event Sourcing · Engineering Leadership</Text>
          </Section>

          {/* Title block */}
          <Section style={titleBlock}>
            <Text style={eyebrow}>{kicker.toUpperCase()}</Text>
            <Heading style={h1}>{title}</Heading>
          </Section>

          {/* Body — real Markdown: links, lists, headings, code all render */}
          <Section style={bodySection}>
            <Markdown markdownContainerStyles={markdownContainer} markdownCustomStyles={mdStyles}>
              {markdown}
            </Markdown>
          </Section>

          {/* Primary CTA */}
          <Section style={ctaContainer}>
            <Button style={button} href={postUrl}>
              Read the full post →
            </Button>
            <Text style={ctaSub}>
              Or paste this into your browser:{' '}
              <Link href={postUrl} style={ctaLink}>
                {postUrl.replace(/^https?:\/\//, '')}
              </Link>
            </Text>
          </Section>

          {/* Reply prompt — the series invites reader requests */}
          <Section style={replySection}>
            <Hr style={hr} />
            <Text style={replyText}>
              Hit reply and tell me what you want covered — reader requests shape the backlog.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footerBanner}>
            <Link href="https://decebaldobrica.com" style={footerLink}>
              <Text style={footerBrandText}>decebaldobrica.com</Text>
            </Link>
            <Text style={footerSocial}>
              <Link href="https://github.com/decebal" style={socialLink}>
                GitHub
              </Link>{' '}
              ·{' '}
              <Link href="https://www.linkedin.com/in/decebaldobrica/" style={socialLink}>
                LinkedIn
              </Link>{' '}
              ·{' '}
              <Link href="https://x.com/ddonprogramming" style={socialLink}>
                Twitter
              </Link>
            </Text>
            <Text style={footerUnsubscribe}>
              You're receiving this because you subscribed at decebaldobrica.com.{' '}
              <Link href={unsubscribeUrl} style={unsubscribeLink}>
                Unsubscribe
              </Link>
              .
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default NewsletterIssueEmail

// ---- styles ----
const TEAL = '#03c9a9'
const INK = '#111827'

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  marginBottom: '64px',
  maxWidth: '600px',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
}

const header = {
  background: `linear-gradient(135deg, ${TEAL} 0%, #059669 100%)`,
  padding: '28px 48px',
  textAlign: 'center' as const,
}

const logo = {
  color: '#ffffff',
  fontSize: '22px',
  fontWeight: 'bold',
  letterSpacing: '1.5px',
  margin: '0',
}

const headerTagline = {
  color: 'rgba(255,255,255,0.92)',
  fontSize: '13px',
  margin: '6px 0 0 0',
}

const titleBlock = {
  padding: '36px 48px 8px 48px',
}

const eyebrow = {
  color: TEAL,
  fontSize: '12px',
  fontWeight: 'bold',
  letterSpacing: '1.5px',
  margin: '0 0 10px 0',
}

const h1 = {
  color: INK,
  fontSize: '28px',
  lineHeight: '34px',
  fontWeight: 'bold',
  margin: '0',
}

const bodySection = {
  padding: '8px 48px 0 48px',
}

const markdownContainer = {
  padding: '0',
}

const mdStyles = {
  h1: { color: INK, fontSize: '24px', fontWeight: 'bold', margin: '28px 0 12px' },
  h2: { color: INK, fontSize: '20px', fontWeight: 'bold', margin: '26px 0 10px' },
  h3: { color: INK, fontSize: '17px', fontWeight: 'bold', margin: '22px 0 8px' },
  p: { color: '#374151', fontSize: '16px', lineHeight: '27px', margin: '14px 0' },
  li: { color: '#374151', fontSize: '16px', lineHeight: '26px', margin: '6px 0' },
  link: { color: TEAL, textDecoration: 'underline' },
  bold: { color: INK, fontWeight: 'bold' },
  codeInline: {
    backgroundColor: '#f3f4f6',
    color: '#9333ea',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'ui-monospace,SFMono-Regular,Menlo,monospace',
  },
  blockQuote: {
    borderLeft: `3px solid ${TEAL}`,
    paddingLeft: '16px',
    margin: '18px 0',
    color: '#4b5563',
    fontStyle: 'italic',
  },
}

const ctaContainer = {
  padding: '28px 48px 8px 48px',
}

const button = {
  backgroundColor: TEAL,
  borderRadius: '10px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '15px 28px',
  boxShadow: '0 3px 8px rgba(3,201,169,0.35)',
}

const ctaSub = {
  color: '#9ca3af',
  fontSize: '12px',
  textAlign: 'center' as const,
  margin: '12px 0 0 0',
}

const ctaLink = {
  color: '#6b7280',
  textDecoration: 'underline',
}

const replySection = {
  padding: '8px 48px 24px 48px',
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '20px 0',
}

const replyText = {
  color: '#4b5563',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0',
}

const footerBanner = {
  backgroundColor: '#111827',
  padding: '28px 48px',
  textAlign: 'center' as const,
}

const footerLink = { textDecoration: 'none' }

const footerBrandText = {
  color: TEAL,
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
}

const footerSocial = {
  color: '#9ca3af',
  fontSize: '13px',
  margin: '8px 0',
}

const socialLink = { color: '#d1d5db', textDecoration: 'none' }

const footerUnsubscribe = {
  color: '#6b7280',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '14px 0 0 0',
}

const unsubscribeLink = { color: '#9ca3af', textDecoration: 'underline' }
