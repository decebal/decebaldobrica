import { Resend } from 'resend';
import { format, addMinutes } from 'date-fns';

let resend: Resend | null = null;

export function initResend() {
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️  Resend not configured. Set RESEND_API_KEY to enable email notifications');
    return null;
  }

  resend = new Resend(process.env.RESEND_API_KEY);
  console.log('✅ Resend email service initialized');
  return resend;
}

export interface Meeting {
  id: string;
  type: string;
  date: Date;
  duration: number;
  contactName?: string;
  contactEmail?: string;
  notes?: string;
}

/**
 * Send meeting confirmation email
 */
export async function sendMeetingConfirmation(meeting: Meeting): Promise<boolean> {
  if (!resend || !meeting.contactEmail) {
    console.log('Email not sent: Resend not configured or no contact email');
    return false;
  }

  const meetingEndTime = addMinutes(meeting.date, meeting.duration);

  const htmlContent = generateMeetingConfirmationHTML(meeting, meetingEndTime);
  const textContent = generateMeetingConfirmationText(meeting, meetingEndTime);

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@yourdomain.com',
      to: meeting.contactEmail,
      subject: `Meeting Confirmed: ${meeting.type}`,
      html: htmlContent,
      text: textContent,
      replyTo: process.env.EMAIL_REPLY_TO || process.env.EMAIL_FROM
    });

    console.log(`✅ Meeting confirmation sent to ${meeting.contactEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

/**
 * Send meeting reminder email
 */
export async function sendMeetingReminder(meeting: Meeting): Promise<boolean> {
  if (!resend || !meeting.contactEmail) {
    return false;
  }

  const meetingEndTime = addMinutes(meeting.date, meeting.duration);

  const htmlContent = generateMeetingReminderHTML(meeting, meetingEndTime);
  const textContent = generateMeetingReminderText(meeting, meetingEndTime);

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@yourdomain.com',
      to: meeting.contactEmail,
      subject: `Reminder: ${meeting.type} in 24 hours`,
      html: htmlContent,
      text: textContent
    });

    console.log(`✅ Meeting reminder sent to ${meeting.contactEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending reminder:', error);
    return false;
  }
}

/**
 * Send meeting cancellation email
 */
export async function sendMeetingCancellation(meeting: Meeting, reason?: string): Promise<boolean> {
  if (!resend || !meeting.contactEmail) {
    return false;
  }

  const htmlContent = generateCancellationHTML(meeting, reason);
  const textContent = generateCancellationText(meeting, reason);

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@yourdomain.com',
      to: meeting.contactEmail,
      subject: `Meeting Cancelled: ${meeting.type}`,
      html: htmlContent,
      text: textContent
    });

    console.log(`✅ Cancellation email sent to ${meeting.contactEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending cancellation:', error);
    return false;
  }
}

/**
 * Generate meeting confirmation HTML
 */
function generateMeetingConfirmationHTML(meeting: Meeting, endTime: Date): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #0ea5e9; color: white; padding: 20px; text-align: center; }
    .content { background: #f8f9fa; padding: 30px; }
    .meeting-details { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #0ea5e9; }
    .detail-row { margin: 10px 0; }
    .label { font-weight: bold; color: #666; }
    .value { color: #333; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
    .button { display: inline-block; padding: 12px 24px; background: #0ea5e9; color: white !important; text-decoration: none; border-radius: 5px; margin: 10px 0; }
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
          <span class="value">${format(meeting.date, 'h:mm a')} - ${format(endTime, 'h:mm a')} EST</span>
        </div>
        <div class="detail-row">
          <span class="label">Duration:</span>
          <span class="value">${meeting.duration} minutes</span>
        </div>
        ${meeting.notes ? `
        <div class="detail-row">
          <span class="label">Notes:</span>
          <span class="value">${meeting.notes}</span>
        </div>
        ` : ''}
      </div>

      <p>A calendar invitation has been sent separately. You'll receive a reminder 24 hours before the meeting.</p>

      <center>
        <a href="https://your-domain.com/meetings/${meeting.id}" class="button">View Meeting Details</a>
      </center>

      <p>Looking forward to speaking with you!</p>
      <p>Best regards,<br>John Doe</p>
    </div>
    <div class="footer">
      <p>Need to reschedule? <a href="https://your-domain.com/contact">Contact us</a></p>
      <p>&copy; ${new Date().getFullYear()} John Doe. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Generate meeting confirmation plain text
 */
function generateMeetingConfirmationText(meeting: Meeting, endTime: Date): string {
  return `
Meeting Confirmed!

Hi ${meeting.contactName || 'there'},

Your meeting has been successfully scheduled. Here are the details:

Meeting Type: ${meeting.type}
Date: ${format(meeting.date, 'EEEE, MMMM d, yyyy')}
Time: ${format(meeting.date, 'h:mm a')} - ${format(endTime, 'h:mm a')} EST
Duration: ${meeting.duration} minutes
${meeting.notes ? `Notes: ${meeting.notes}` : ''}

A calendar invitation has been sent separately. You'll receive a reminder 24 hours before the meeting.

Looking forward to speaking with you!

Best regards,
John Doe

---
Need to reschedule? Visit: https://your-domain.com/contact
  `.trim();
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
      <p>Best regards,<br>John Doe</p>
    </div>
    <div class="footer">
      <p>Need to reschedule? <a href="https://your-domain.com/contact">Contact us</a></p>
    </div>
  </div>
</body>
</html>
  `.trim();
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
John Doe
  `.trim();
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

      <p>Best regards,<br>John Doe</p>
    </div>
    <div class="footer">
      <p><a href="https://your-domain.com/contact">Reschedule Meeting</a></p>
    </div>
  </div>
</body>
</html>
  `.trim();
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
John Doe

---
Reschedule: https://your-domain.com/contact
  `.trim();
}
