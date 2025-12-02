import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface NewsletterConfirmationEmailProps {
  name?: string
  confirmUrl: string
}

export function NewsletterConfirmationEmail({
  name = 'there',
  confirmUrl,
}: NewsletterConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Confirm your subscription to Decebal's Newsletter</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Branded Header */}
          <Section style={header}>
            <Text style={logo}>DECEBAL DOBRICA</Text>
            <Text style={headerTagline}>Fractional CTO & AI Engineering Leader</Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>Welcome to my newsletter!</Heading>
            <Text style={text}>Hi {name},</Text>
            <Text style={text}>
              Thank you for subscribing to my newsletter! I share insights about software
              engineering, web development, AI integration, and building products.
            </Text>
            <Text style={text}>
              To complete your subscription, please confirm your email address by clicking the
              button below:
            </Text>
            <Section style={buttonContainer}>
              <Button style={button} href={confirmUrl}>
                Confirm Subscription
              </Button>
            </Section>
            <Text style={text}>Or copy and paste this URL into your browser:</Text>
            <Section style={urlBox}>
              <Link href={confirmUrl} style={urlLink}>
                {confirmUrl}
              </Link>
            </Section>
            <Text style={disclaimer}>
              This link will expire in 24 hours. If you didn't subscribe to this newsletter, you can
              safely ignore this email.
            </Text>
          </Section>

          {/* Branded Footer */}
          <Section style={footer}>
            <Hr style={footerDivider} />
            <Text style={footerText}>
              Best regards,
              <br />
              <strong>Decebal Dobrica</strong>
            </Text>
            <Section style={footerBanner}>
              <Link href="https://decebaldobrica.com" style={footerLink}>
                <Text style={footerBrandText}>decebaldobrica.com</Text>
              </Link>
              <Text style={footerSocial}>
                <Link href="https://github.com/decebal" style={socialLink}>
                  GitHub
                </Link>{' '}
                •{' '}
                <Link href="https://www.linkedin.com/in/decebaldobrica/" style={socialLink}>
                  LinkedIn
                </Link>{' '}
                •{' '}
                <Link href="https://x.com/ddonprogramming" style={socialLink}>
                  Twitter
                </Link>
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default NewsletterConfirmationEmail

// Styles
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
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}

// Header styles
const header = {
  background: 'linear-gradient(135deg, #03c9a9 0%, #059669 100%)',
  padding: '32px 48px',
  textAlign: 'center' as const,
}

const logo = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  letterSpacing: '1px',
  margin: '0',
  padding: '0',
}

const headerTagline = {
  color: 'rgba(255, 255, 255, 0.9)',
  fontSize: '14px',
  margin: '8px 0 0 0',
  padding: '0',
}

// Content styles
const content = {
  padding: '0 0 32px 0',
}

const h1 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '32px 0 24px 0',
  padding: '0 48px',
}

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
  padding: '0 48px',
}

const buttonContainer = {
  padding: '24px 48px',
}

const button = {
  backgroundColor: '#03c9a9',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '14px 28px',
  boxShadow: '0 2px 4px rgba(3, 201, 169, 0.3)',
}

// URL box with proper wrapping
const urlBox = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '6px',
  padding: '16px',
  margin: '16px 48px',
  maxWidth: '504px', // 600px - (48px * 2) for padding
}

const urlLink = {
  color: '#059669',
  fontSize: '14px',
  textDecoration: 'none',
  wordBreak: 'break-all' as const,
  display: 'block',
  fontFamily: 'monospace',
}

const disclaimer = {
  color: '#6b7280',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '24px 0 0 0',
  padding: '0 48px',
  fontStyle: 'italic',
}

// Footer styles
const footer = {
  backgroundColor: '#f9fafb',
  padding: '0',
  margin: '0',
}

const footerDivider = {
  borderColor: '#e5e7eb',
  margin: '0',
}

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  padding: '24px 48px 16px 48px',
  margin: '0',
}

const footerBanner = {
  backgroundColor: '#1f2937',
  padding: '24px 48px',
  textAlign: 'center' as const,
}

const footerLink = {
  textDecoration: 'none',
}

const footerBrandText = {
  color: '#03c9a9',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
  textDecoration: 'none',
}

const footerSocial = {
  color: '#9ca3af',
  fontSize: '13px',
  margin: '12px 0 0 0',
}

const socialLink = {
  color: '#d1d5db',
  textDecoration: 'none',
}
