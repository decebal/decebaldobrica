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

interface NewsletterWelcomeEmailProps {
  name?: string
  tier: 'free' | 'premium' | 'founding'
}

export function NewsletterWelcomeEmail({
  name = 'there',
  tier = 'free',
}: NewsletterWelcomeEmailProps) {
  const getTierInfo = () => {
    switch (tier) {
      case 'premium':
        return {
          title: 'Premium Subscriber',
          benefits: [
            'Access to all premium content and deep dives',
            'Exclusive tutorials and code examples',
            'Early access to new articles',
            'Priority support and responses',
          ],
        }
      case 'founding':
        return {
          title: 'Founding Member',
          benefits: [
            'All premium benefits',
            'Lifetime access to premium content',
            'Direct access to me for questions',
            'Exclusive founding member community',
            'Your name in the supporters list (optional)',
          ],
        }
      default:
        return {
          title: 'Free Subscriber',
          benefits: [
            'Weekly newsletter with latest articles',
            'Curated tech insights and tips',
            'No spam, unsubscribe anytime',
          ],
        }
    }
  }

  const tierInfo = getTierInfo()

  return (
    <Html>
      <Head />
      <Preview>Welcome to Decebal's Newsletter - You're all set!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Branded Header */}
          <Section style={header}>
            <Text style={logo}>DECEBAL DOBRICA</Text>
            <Text style={headerTagline}>Fractional CTO & AI Engineering Leader</Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>You're in! 🎉</Heading>
            <Text style={text}>Hi {name},</Text>
            <Text style={text}>
              Welcome to my newsletter! Your subscription has been confirmed as a{' '}
              <strong>{tierInfo.title}</strong>.
            </Text>
            <Heading style={h2}>What to expect:</Heading>
            <Section style={benefitsSection}>
              {tierInfo.benefits.map((benefit) => (
                <Text key={benefit} style={benefitItem}>
                  ✓ {benefit}
                </Text>
              ))}
            </Section>
            <Text style={text}>
              I typically send newsletters <strong>once a week</strong>, sharing practical insights
              about software engineering, AI integration, web development, and building digital
              products.
            </Text>
            {tier === 'free' && (
              <>
                <Hr style={hr} />
                <Heading style={h2}>Want more?</Heading>
                <Text style={text}>
                  Upgrade to <strong>Premium</strong> for exclusive deep dives, tutorials, and early
                  access to content.
                </Text>
                <Section style={buttonContainer}>
                  <Button style={button} href="https://decebaldobrica.com/newsletter/pricing?tier=free">
                    View Premium Plans
                  </Button>
                </Section>
              </>
            )}
            <Hr style={hr} />
            <Text style={text}>In the meantime, check out my latest articles on my blog:</Text>
            <Section style={buttonContainer}>
              <Button style={buttonSecondary} href="https://decebaldobrica.com/blog">
                Read the Blog
              </Button>
            </Section>
          </Section>

          {/* Branded Footer */}
          <Section style={footer}>
            <Hr style={footerDivider} />
            <Text style={footerText}>
              Thanks for subscribing!
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
              <Text style={footerUnsubscribe}>
                You can{' '}
                <Link href="https://decebaldobrica.com/newsletter/unsubscribe" style={unsubscribeLink}>
                  unsubscribe
                </Link>{' '}
                at any time.
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default NewsletterWelcomeEmail

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
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '32px 0 24px 0',
  padding: '0 48px',
}

const h2 = {
  color: '#1f2937',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '32px 0 16px',
  padding: '0 48px',
}

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
  padding: '0 48px',
}

const benefitsSection = {
  padding: '0 48px',
  margin: '16px 0',
}

const benefitItem = {
  color: '#059669',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '10px 0',
  padding: '0',
  fontWeight: '500',
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

const buttonSecondary = {
  backgroundColor: '#ffffff',
  border: '2px solid #03c9a9',
  borderRadius: '8px',
  color: '#03c9a9',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 26px',
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '24px 48px',
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
  margin: '12px 0',
}

const socialLink = {
  color: '#d1d5db',
  textDecoration: 'none',
}

const footerUnsubscribe = {
  color: '#6b7280',
  fontSize: '12px',
  margin: '12px 0 0 0',
}

const unsubscribeLink = {
  color: '#9ca3af',
  textDecoration: 'underline',
}
