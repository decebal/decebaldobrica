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

interface NewsletterConfirmationEmailProps {
  name?: string
  confirmUrl: string
}

export function NewsletterConfirmationEmail({
  name = "there",
  confirmUrl,
}: NewsletterConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Confirm your subscription to Decebal's Newsletter</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to my newsletter!</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            Thank you for subscribing to my newsletter! I share insights about
            software engineering, web development, and building products.
          </Text>
          <Text style={text}>
            To complete your subscription, please confirm your email address by
            clicking the button below:
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={confirmUrl}>
              Confirm Subscription
            </Button>
          </Section>
          <Text style={text}>
            Or copy and paste this URL into your browser:
          </Text>
          <Link href={confirmUrl} style={link}>
            {confirmUrl}
          </Link>
          <Hr style={hr} />
          <Text style={footer}>
            This link will expire in 24 hours. If you didn't subscribe to this
            newsletter, you can safely ignore this email.
          </Text>
          <Text style={footer}>
            Best regards,
            <br />
            Decebal Dobrica
            <br />
            <Link href="https://decebaldobrica.com" style={link}>
              decebaldobrica.com
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default NewsletterConfirmationEmail

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

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "16px 0",
  padding: "0 48px",
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

const link = {
  color: "#0066cc",
  fontSize: "14px",
  textDecoration: "underline",
  wordBreak: "break-all" as const,
  padding: "0 48px",
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
