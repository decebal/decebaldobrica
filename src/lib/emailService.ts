import { addMinutes, format } from 'date-fns'
import { Resend } from 'resend'

let resend: Resend | null = null

export function getResendClient() {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      console.warn('⚠️  Resend not configured. Set RESEND_API_KEY to enable email notifications')
      return null
    }
    resend = new Resend(process.env.RESEND_API_KEY)
    console.log('✅ Resend email service initialized')
  }
  return resend
}

// Keep initResend for backwards compatibility
export function initResend() {
  return getResendClient()
}

export interface Meeting {
  id: string
  type: string
  date: Date
  duration: number
  contactName?: string
  contactEmail?: string
  notes?: string
  category?: string
}

/**
 * Send meeting confirmation email
 */
export async function sendMeetingConfirmation(
  meeting: Meeting,
  meetLink?: string
): Promise<boolean> {
  const client = getResendClient()

  if (!client) {
    console.log('⚠️  Email not sent: Resend not configured')
    return false
  }

  if (!meeting.contactEmail) {
    console.log('⚠️  Email not sent: No contact email provided')
    return false
  }

  const meetingEndTime = addMinutes(meeting.date, meeting.duration)

  const htmlContent = generateMeetingConfirmationHTML(meeting, meetingEndTime, meetLink)
  const textContent = generateMeetingConfirmationText(meeting, meetingEndTime, meetLink)

  try {
    console.log(`📧 Sending meeting confirmation to ${meeting.contactEmail}...`)
    console.log(`   From: ${process.env.EMAIL_FROM || 'noreply@decebaldobrica.com'}`)
    console.log(`   Subject: Meeting Confirmed: ${meeting.type}`)

    const result = await client.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@decebaldobrica.com',
      to: meeting.contactEmail,
      subject: `Meeting Confirmed: ${meeting.type}`,
      html: htmlContent,
      text: textContent,
      replyTo: process.env.EMAIL_REPLY_TO || process.env.EMAIL_FROM,
    })

    console.log(`   Full response:`, JSON.stringify(result, null, 2))
    console.log(`✅ Meeting confirmation sent to ${meeting.contactEmail}`)
    console.log(`   Email ID: ${result.data?.id || result.id || 'unknown'}`)

    if (result.error) {
      console.error('   ⚠️ Resend returned an error:', result.error)
      return false
    }

    return true
  } catch (error) {
    console.error('❌ Error sending meeting confirmation email:', error)
    if (error instanceof Error) {
      console.error('   Error message:', error.message)
      console.error('   Error stack:', error.stack)
    }
    // @ts-ignore - log the full error object
    if (error?.response) {
      // @ts-ignore
      console.error('   API Response:', JSON.stringify(error.response, null, 2))
    }
    return false
  }
}

/**
 * Send meeting reminder email
 */
export async function sendMeetingReminder(meeting: Meeting): Promise<boolean> {
  if (!resend || !meeting.contactEmail) {
    return false
  }

  const meetingEndTime = addMinutes(meeting.date, meeting.duration)

  const htmlContent = generateMeetingReminderHTML(meeting, meetingEndTime)
  const textContent = generateMeetingReminderText(meeting, meetingEndTime)

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@decebaldobrica.com',
      to: meeting.contactEmail,
      subject: `Reminder: ${meeting.type} in 24 hours`,
      html: htmlContent,
      text: textContent,
    })

    console.log(`✅ Meeting reminder sent to ${meeting.contactEmail}`)
    return true
  } catch (error) {
    console.error('Error sending reminder:', error)
    return false
  }
}

/**
 * Send meeting cancellation email
 */
export async function sendMeetingCancellation(meeting: Meeting, reason?: string): Promise<boolean> {
  if (!resend || !meeting.contactEmail) {
    return false
  }

  const htmlContent = generateCancellationHTML(meeting, reason)
  const textContent = generateCancellationText(meeting, reason)

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@decebaldobrica.com',
      to: meeting.contactEmail,
      subject: `Meeting Cancelled: ${meeting.type}`,
      html: htmlContent,
      text: textContent,
    })

    console.log(`✅ Cancellation email sent to ${meeting.contactEmail}`)
    return true
  } catch (error) {
    console.error('Error sending cancellation:', error)
    return false
  }
}

/**
 * Generate meeting confirmation HTML
 */
function generateMeetingConfirmationHTML(
  meeting: Meeting,
  endTime: Date,
  meetLink?: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #e5e7eb; background: #0a1929; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #0f1d35; }
    .header { background: linear-gradient(135deg, #0c1c36 0%, #0a66c2 50%, #03c9a9 100%); color: white; padding: 40px 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
    .content { padding: 40px 30px; background: #0f1d35; }
    .content p { color: #d1d5db; margin: 16px 0; }
    .meeting-details { background: rgba(3, 201, 169, 0.1); border-left: 4px solid #03c9a9; padding: 24px; margin: 24px 0; border-radius: 8px; }
    .detail-row { margin: 12px 0; display: flex; align-items: baseline; }
    .label { font-weight: 600; color: #03c9a9; min-width: 100px; }
    .value { color: #f3f4f6; }
    .button { display: inline-block; padding: 14px 28px; background: #03c9a9; color: white !important; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: 600; transition: background 0.2s; }
    .button:hover { background: #02a88d; }
    .footer { text-align: center; padding: 30px 20px; color: #9ca3af; font-size: 14px; background: #0a1929; border-top: 1px solid rgba(255,255,255,0.1); }
    .footer a { color: #03c9a9; text-decoration: none; }
    .footer a:hover { text-decoration: underline; }
    .meet-link-box { background: rgba(3, 201, 169, 0.15); border: 2px solid #03c9a9; padding: 20px; border-radius: 8px; text-align: center; margin: 24px 0; }
    .meet-link-box a { color: #03c9a9; font-weight: 600; word-break: break-all; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Meeting Confirmed!</h1>
    </div>
    <div class="content">
      <p>Hi ${meeting.contactName || 'there'},</p>
      <p>Your meeting has been successfully scheduled. Here are the details:</p>

      <div class="meeting-details">
        <div class="detail-row">
          <span class="label">Meeting Type:</span>
          <span class="value">${meeting.type}</span>
        </div>
        <div class="detail-row">
          <span class="label">Date:</span>
          <span class="value">${format(meeting.date, 'EEEE, MMMM d, yyyy')}</span>
        </div>
        <div class="detail-row">
          <span class="label">Time:</span>
          <span class="value">${format(meeting.date, 'h:mm a')} - ${format(endTime, 'h:mm a')}</span>
        </div>
        <div class="detail-row">
          <span class="label">Duration:</span>
          <span class="value">${meeting.duration} minutes</span>
        </div>
        ${
          meeting.notes
            ? `
        <div class="detail-row">
          <span class="label">Notes:</span>
          <span class="value">${meeting.notes}</span>
        </div>
        `
            : ''
        }
      </div>

      ${
        meetLink
          ? `
      <div class="meet-link-box">
        <p style="margin: 0 0 10px 0; color: #03c9a9; font-weight: 600;">📹 Join Video Call</p>
        <a href="${meetLink}">${meetLink}</a>
      </div>
      `
          : '<p>A calendar invitation with the meeting link has been sent separately.</p>'
      }

      <center>
        <a href="${meetLink || 'https://decebaldobrica.com/contact'}" class="button">${meetLink ? 'Join Meeting' : 'Add to Calendar'}</a>
      </center>

      ${
        meeting.category
          ? `
      <div style="background: rgba(3, 201, 169, 0.08); border-left: 3px solid #03c9a9; padding: 16px; margin: 24px 0; border-radius: 6px;">
        <p style="margin: 0; color: #d1d5db; font-size: 14px;">
          <strong style="color: #03c9a9;">Context:</strong> You mentioned interest in <strong>${meeting.category}</strong>
        </p>
      </div>
      `
          : ''
      }

      <p>Looking forward to speaking with you!</p>

      <div style="background: rgba(255,255,255,0.03); border-radius: 8px; padding: 20px; margin: 24px 0;">
        <p style="margin: 0 0 12px 0; color: #9ca3af; font-size: 14px;"><strong>About Me</strong></p>
        <p style="margin: 0 0 12px 0; color: #d1d5db; font-size: 14px;">
          I'm a Fractional CTO specializing in AI engineering and digital transformation for VC-backed startups.
        </p>
        <div style="margin-top: 12px;">
          <a href="https://www.linkedin.com/in/decebaldobrica/" style="color: #03c9a9; text-decoration: none; margin-right: 16px; font-size: 14px;">LinkedIn</a>
          <a href="https://github.com/decebal" style="color: #03c9a9; text-decoration: none; margin-right: 16px; font-size: 14px;">GitHub</a>
          <a href="https://x.com/ddonprogramming" style="color: #03c9a9; text-decoration: none; font-size: 14px;">Twitter/X</a>
        </div>
      </div>

      <p style="margin-top: 30px;">Best regards,<br><strong style="color: #03c9a9;">Decebal Dobrica</strong></p>
    </div>
    <div class="footer">
      <p style="color: #9ca3af; font-size: 13px;">Need to reschedule? Use the calendar invite or Google Calendar to propose a new time.</p>
      <p style="margin-top: 16px;">&copy; ${new Date().getFullYear()} Decebal Dobrica. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

/**
 * Generate meeting confirmation plain text
 */
function generateMeetingConfirmationText(
  meeting: Meeting,
  endTime: Date,
  meetLink?: string
): string {
  return `
Meeting Confirmed!

Hi ${meeting.contactName || 'there'},

Your meeting has been successfully scheduled. Here are the details:

Meeting Type: ${meeting.type}
Date: ${format(meeting.date, 'EEEE, MMMM d, yyyy')}
Time: ${format(meeting.date, 'h:mm a')} - ${format(endTime, 'h:mm a')}
Duration: ${meeting.duration} minutes
${meeting.notes ? `Notes: ${meeting.notes}` : ''}

${meetLink ? `Join Video Call: ${meetLink}` : 'A calendar invitation with the meeting link has been sent separately.'}

${meeting.category ? `\nContext: You mentioned interest in ${meeting.category}\n` : ''}

Looking forward to speaking with you!

---
About Me:
I'm a Fractional CTO specializing in AI engineering and digital transformation
for VC-backed startups.

Connect with me:
- LinkedIn: https://www.linkedin.com/in/decebaldobrica/
- GitHub: https://github.com/decebal
- Twitter/X: https://x.com/ddonprogramming

Best regards,
Decebal Dobrica

---
Need to reschedule? Use the calendar invite or Google Calendar to propose a new time.
  `.trim()
}

/**
 * Generate meeting reminder HTML
 */
function generateMeetingReminderHTML(meeting: Meeting, endTime: Date): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #f59e0b; color: white; padding: 20px; text-align: center; }
    .content { background: #f8f9fa; padding: 30px; }
    .meeting-details { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #f59e0b; }
    .detail-row { margin: 10px 0; }
    .label { font-weight: bold; color: #666; }
    .value { color: #333; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⏰ Meeting Reminder</h1>
    </div>
    <div class="content">
      <p>Hi ${meeting.contactName || 'there'},</p>
      <p>This is a friendly reminder about your upcoming meeting in 24 hours:</p>

      <div class="meeting-details">
        <div class="detail-row">
          <span class="label">Meeting Type:</span>
          <span class="value">${meeting.type}</span>
        </div>
        <div class="detail-row">
          <span class="label">Tomorrow:</span>
          <span class="value">${format(meeting.date, 'EEEE, MMMM d, yyyy')}</span>
        </div>
        <div class="detail-row">
          <span class="label">Time:</span>
          <span class="value">${format(meeting.date, 'h:mm a')} - ${format(endTime, 'h:mm a')} EST</span>
        </div>
      </div>

      <p>Looking forward to our conversation!</p>
      <p>Best regards,<br>Decebal Dobrica</p>
    </div>
    <div class="footer">
      <p>Need to reschedule? <a href="https://decebaldobrica.com/contact">Contact us</a></p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

/**
 * Generate meeting reminder plain text
 */
function generateMeetingReminderText(meeting: Meeting, endTime: Date): string {
  return `
Meeting Reminder

Hi ${meeting.contactName || 'there'},

This is a friendly reminder about your upcoming meeting in 24 hours:

Meeting Type: ${meeting.type}
Tomorrow: ${format(meeting.date, 'EEEE, MMMM d, yyyy')}
Time: ${format(meeting.date, 'h:mm a')} - ${format(endTime, 'h:mm a')} EST

Looking forward to our conversation!

Best regards,
Decebal Dobrica
  `.trim()
}

/**
 * Generate cancellation HTML
 */
function generateCancellationHTML(meeting: Meeting, reason?: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #ef4444; color: white; padding: 20px; text-align: center; }
    .content { background: #f8f9fa; padding: 30px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>❌ Meeting Cancelled</h1>
    </div>
    <div class="content">
      <p>Hi ${meeting.contactName || 'there'},</p>
      <p>Unfortunately, the following meeting has been cancelled:</p>

      <p><strong>${meeting.type}</strong><br>
      ${format(meeting.date, 'EEEE, MMMM d, yyyy')} at ${format(meeting.date, 'h:mm a')} EST</p>

      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}

      <p>Please feel free to reschedule at your convenience.</p>
      <p>Apologies for any inconvenience.</p>

      <p>Best regards,<br>Decebal Dobrica</p>
    </div>
    <div class="footer">
      <p><a href="https://decebaldobrica.com/contact">Reschedule Meeting</a></p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

/**
 * Generate cancellation plain text
 */
function generateCancellationText(meeting: Meeting, reason?: string): string {
  return `
Meeting Cancelled

Hi ${meeting.contactName || 'there'},

Unfortunately, the following meeting has been cancelled:

${meeting.type}
${format(meeting.date, 'EEEE, MMMM d, yyyy')} at ${format(meeting.date, 'h:mm a')} EST

${reason ? `Reason: ${reason}` : ''}

Please feel free to reschedule at your convenience.
Apologies for any inconvenience.

Best regards,
Decebal Dobrica

---
Reschedule: https://decebaldobrica.com/contact
  `.trim()
}
