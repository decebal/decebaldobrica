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
} from "@react-email/components"
import * as React from "react"

interface NewsletterWelcomeEmailProps {
  name?: string
  tier: "free" | "premium" | "founding"
}

export function NewsletterWelcomeEmail({
  name = "there",
  tier = "free",
}: NewsletterWelcomeEmailProps) {
  const getTierInfo = () => {
    switch (tier) {
      case "premium":
        return {
          title: "Premium Subscriber",
          benefits: [
            "Access to all premium content and deep dives",
            "Exclusive tutorials and code examples",
            "Early access to new articles",
            "Priority support and responses",
          ],
        }
      case "founding":
        return {
          title: "Founding Member",
          benefits: [
            "All premium benefits",
            "Lifetime access to premium content",
            "Direct access to me for questions",
            "Exclusive founding member community",
            "Your name in the supporters list (optional)",
          ],
        }
      default:
        return {
          title: "Free Subscriber",
          benefits: [
            "Weekly newsletter with latest articles",
            "Curated tech insights and tips",
            "No spam, unsubscribe anytime",
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
          <Heading style={h1}>You're in! 🎉</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            Welcome to my newsletter! Your subscription has been confirmed as a{" "}
            <strong>{tierInfo.title}</strong>.
          </Text>
          <Heading style={h2}>What to expect:</Heading>
          <Section style={benefitsSection}>
            {tierInfo.benefits.map((benefit, index) => (
              <Text key={index} style={benefitItem}>
                ✓ {benefit}
              </Text>
            ))}
          </Section>
          <Text style={text}>
            I typically send newsletters <strong>once a week</strong>, sharing
            practical insights about software engineering, web development, and
            building digital products.
          </Text>
          {tier === "free" && (
            <>
              <Hr style={hr} />
              <Heading style={h2}>Want more?</Heading>
              <Text style={text}>
                Upgrade to <strong>Premium</strong> for exclusive deep dives,
                tutorials, and early access to content.
              </Text>
              <Section style={buttonContainer}>
                <Button
                  style={button}
                  href="https://decebaldobrica.com/newsletter/pricing"
                >
                  View Premium Plans
                </Button>
              </Section>
            </>
          )}
          <Hr style={hr} />
          <Text style={text}>
            In the meantime, check out my latest articles on my blog:
          </Text>
          <Section style={buttonContainer}>
            <Button
              style={buttonSecondary}
              href="https://decebaldobrica.com/blog"
            >
              Read the Blog
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            Thanks for subscribing!
            <br />
            Decebal Dobrica
            <br />
            <Link href="https://decebaldobrica.com" style={link}>
              decebaldobrica.com
            </Link>
          </Text>
          <Text style={footer}>
            You can{" "}
            <Link
              href="https://decebaldobrica.com/newsletter/unsubscribe"
              style={link}
            >
              unsubscribe
            </Link>{" "}
            at any time.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default NewsletterWelcomeEmail

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "580px",
}

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0 48px",
}

const h2 = {
  color: "#333",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "32px 0 16px",
  padding: "0 48px",
}

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "16px 0",
  padding: "0 48px",
}

const benefitsSection = {
  padding: "0 48px",
}

const benefitItem = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "8px 0",
  padding: "0",
}

const buttonContainer = {
  padding: "27px 48px",
}

const button = {
  backgroundColor: "#000000",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 20px",
}

const buttonSecondary = {
  backgroundColor: "#ffffff",
  border: "2px solid #000000",
  borderRadius: "6px",
  color: "#000000",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 20px",
}

const link = {
  color: "#0066cc",
  fontSize: "14px",
  textDecoration: "underline",
}

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 48px",
}

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  padding: "0 48px",
  margin: "8px 0",
}
