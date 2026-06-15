/**
 * Newsletter data access (app-local).
 *
 * This module previously held a Supabase-backed duplicate of the newsletter
 * logic. The canonical, AllSource-backed implementation now lives in
 * `@decebal/newsletter`; this file re-exports it so any lingering
 * `@/lib/newsletter` imports keep working against the event store.
 *
 * Behaviour delta: `confirmSubscription` now takes a confirmation token (the
 * double opt-in flow) rather than a subscriber id, matching the package API.
 */
export {
  type NewsletterEvent,
  type NewsletterIssue,
  type NewsletterSubscriber,
  type NewsletterSubscription,
  confirmSubscription,
  createNewsletterIssue,
  generateConfirmationToken,
  getActiveSubscribers,
  getNewsletterIssue,
  getNewsletterStats,
  getSubscriberByEmail,
  getSubscriberCount,
  markIssueSent,
  subscribeToNewsletter,
  trackNewsletterEvent,
  unsubscribeFromNewsletter,
} from '@decebal/newsletter'
