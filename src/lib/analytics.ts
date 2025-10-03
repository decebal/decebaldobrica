import posthog from 'posthog-js'

let analyticsInitialized = false

/**
 * Initialize PostHog analytics (client-side only)
 */
export function initAnalytics() {
  if (typeof window === 'undefined') {
    return // Server-side, skip
  }

  if (analyticsInitialized) {
    return
  }

  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com'

  if (!apiKey) {
    console.warn('⚠️  PostHog not configured. Set NEXT_PUBLIC_POSTHOG_KEY to enable analytics')
    return
  }

  try {
    posthog.init(apiKey, {
      api_host: apiHost,
      autocapture: true,
      capture_pageview: true,
      capture_pageleave: true,
      disable_session_recording: true, // Disable to reduce errors
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') {
          posthog.debug() // Enable debug mode in development
        }
      },
    })
  } catch (error) {
    console.warn('⚠️  PostHog initialization failed:', error)
    return
  }

  analyticsInitialized = true
  console.log('✅ PostHog analytics initialized')
}

/**
 * Track a custom event
 */
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (!analyticsInitialized || typeof window === 'undefined') {
    return
  }

  posthog.capture(eventName, properties)
}

/**
 * Identify a user
 */
export function identifyUser(userId: string, properties?: Record<string, any>) {
  if (!analyticsInitialized || typeof window === 'undefined') {
    return
  }

  posthog.identify(userId, properties)
}

/**
 * Track page view
 */
export function trackPageView(pageName?: string) {
  if (!analyticsInitialized || typeof window === 'undefined') {
    return
  }

  posthog.capture('$pageview', {
    page: pageName || window.location.pathname,
  })
}

/**
 * Reset analytics (on logout)
 */
export function resetAnalytics() {
  if (!analyticsInitialized || typeof window === 'undefined') {
    return
  }

  posthog.reset()
}

/**
 * Set user properties
 */
export function setUserProperties(properties: Record<string, any>) {
  if (!analyticsInitialized || typeof window === 'undefined') {
    return
  }

  posthog.people.set(properties)
}

/**
 * Track feature flag
 */
export function isFeatureEnabled(featureName: string): boolean {
  if (!analyticsInitialized || typeof window === 'undefined') {
    return false
  }

  return posthog.isFeatureEnabled(featureName) || false
}

// Chat-specific analytics helpers
export const chatAnalytics = {
  /**
   * Track when a chat conversation starts
   */
  conversationStarted: (conversationId: string, userId?: string) => {
    trackEvent('chat_conversation_started', {
      conversation_id: conversationId,
      user_id: userId,
      timestamp: new Date().toISOString(),
    })
  },

  /**
   * Track when a message is sent
   */
  messageSent: (role: 'user' | 'assistant', messageLength: number, conversationId: string) => {
    trackEvent('chat_message_sent', {
      role,
      message_length: messageLength,
      conversation_id: conversationId,
      timestamp: new Date().toISOString(),
    })
  },

  /**
   * Track when availability is checked
   */
  availabilityChecked: (date: string, slotsFound: number, conversationId: string) => {
    trackEvent('chat_availability_checked', {
      date,
      slots_found: slotsFound,
      conversation_id: conversationId,
      timestamp: new Date().toISOString(),
    })
  },

  /**
   * Track when a meeting is scheduled
   */
  meetingScheduled: (
    meetingId: string,
    type: string,
    duration: number,
    hasEmail: boolean,
    conversationId: string
  ) => {
    trackEvent('chat_meeting_scheduled', {
      meeting_id: meetingId,
      type,
      duration,
      has_email: hasEmail,
      conversation_id: conversationId,
      timestamp: new Date().toISOString(),
    })
  },

  /**
   * Track RAG queries
   */
  ragQueryPerformed: (query: string, documentsFound: number, conversationId: string) => {
    trackEvent('chat_rag_query', {
      query_length: query.length,
      documents_found: documentsFound,
      conversation_id: conversationId,
      timestamp: new Date().toISOString(),
    })
  },

  /**
   * Track errors
   */
  errorOccurred: (errorType: string, errorMessage: string, conversationId?: string) => {
    trackEvent('chat_error', {
      error_type: errorType,
      error_message: errorMessage,
      conversation_id: conversationId,
      timestamp: new Date().toISOString(),
    })
  },
}

export default posthog
