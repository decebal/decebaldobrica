import { shutdownServerAnalytics } from '@decebal/analytics/server'

/**
 * Node-only instrumentation, imported dynamically from `instrumentation.ts`.
 *
 * Next compiles `instrumentation.ts` for the Edge runtime too, where `process.once` is not
 * available - keeping the signal handlers behind a dynamic import keeps the Edge bundle clean.
 */

// Long-lived processes (`next start`, self-hosted) flush on the way out. Serverless invocations
// never reach this and flush per capture instead.
const flush = () => {
  void shutdownServerAnalytics()
}

process.once('SIGTERM', flush)
process.once('SIGINT', flush)
