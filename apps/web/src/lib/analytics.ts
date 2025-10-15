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

      // Page tracking
      autocapture: true,
      capture_pageview: true,
      capture_pageleave: true,

      // Session recording - ENABLED
      disable_session_recording: false,
      session_recording: {
        maskAllInputs: true,
        maskTextSelector: '[data-private]',
        recordCrossOriginIframes: false,
      },

      // Performance
      capture_performance: true,

      // Storage
      persistence: 'localStorage+cookie',

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

// Web vitals and performance tracking
export const performanceAnalytics = {
  /**
   * Track Core Web Vitals (CLS, FID, LCP)
   */
  trackWebVital: (metric: {
    name: string
    value: number
    id: string
    rating: 'good' | 'needs-improvement' | 'poor'
  }) => {
    trackEvent('web_vital', {
      metric_name: metric.name,
      metric_value: metric.value,
      metric_id: metric.id,
      metric_rating: metric.rating,
      page: window.location.pathname,
    })
  },

  /**
   * Track page load time
   */
  trackPageLoad: (loadTime: number) => {
    trackEvent('page_load', {
      load_time: loadTime,
      page: window.location.pathname,
    })
  },
}

// User journey tracking
export const journeyAnalytics = {
  /**
   * Track form submissions
   */
  formSubmitted: (formName: string, success: boolean, errorMessage?: string) => {
    trackEvent('form_submitted', {
      form_name: formName,
      success,
      error_message: errorMessage,
      page: window.location.pathname,
    })
  },

  /**
   * Track CTA clicks
   */
  ctaClicked: (ctaName: string, ctaLocation: string, ctaUrl?: string) => {
    trackEvent('cta_clicked', {
      cta_name: ctaName,
      cta_location: ctaLocation,
      cta_url: ctaUrl,
      page: window.location.pathname,
    })
  },

  /**
   * Track navigation
   */
  navigationClicked: (linkText: string, linkUrl: string) => {
    trackEvent('navigation_clicked', {
      link_text: linkText,
      link_url: linkUrl,
      from_page: window.location.pathname,
    })
  },

  /**
   * Track section views (scroll depth)
   */
  sectionViewed: (sectionName: string, scrollDepth: number) => {
    trackEvent('section_viewed', {
      section_name: sectionName,
      scroll_depth: scrollDepth,
      page: window.location.pathname,
    })
  },
}

// Conversion tracking
export const conversionAnalytics = {
  /**
   * Track booking started
   */
  bookingStarted: (meetingType: string, source: string) => {
    trackEvent('booking_started', {
      meeting_type: meetingType,
      source,
      page: window.location.pathname,
    })
  },

  /**
   * Track booking completed
   */
  bookingCompleted: (meetingType: string, meetingDate: string, hasPaid: boolean) => {
    trackEvent('booking_completed', {
      meeting_type: meetingType,
      meeting_date: meetingDate,
      has_paid: hasPaid,
      page: window.location.pathname,
    })
  },

  /**
   * Track payment initiated
   */
  paymentInitiated: (amount: number, currency: string, meetingType: string) => {
    trackEvent('payment_initiated', {
      amount,
      currency,
      meeting_type: meetingType,
      page: window.location.pathname,
    })
  },

  /**
   * Track payment completed
   */
  paymentCompleted: (
    amount: number,
    currency: string,
    paymentMethod: string,
    transactionId: string
  ) => {
    trackEvent('payment_completed', {
      amount,
      currency,
      payment_method: paymentMethod,
      transaction_id: transactionId,
      page: window.location.pathname,
    })
  },
}

// Error and exception tracking
export const errorAnalytics = {
  /**
   * Track JavaScript errors
   */
  trackError: (error: Error, context?: Record<string, any>) => {
    trackEvent('javascript_error', {
      error_name: error.name,
      error_message: error.message,
      error_stack: error.stack?.slice(0, 500), // Limit stack trace
      page: window.location.pathname,
      ...context,
    })
  },

  /**
   * Track API errors
   */
  trackApiError: (endpoint: string, statusCode: number, errorMessage: string, method: string) => {
    trackEvent('api_error', {
      endpoint,
      status_code: statusCode,
      error_message: errorMessage,
      method,
      page: window.location.pathname,
    })
  },
}

// Session recording controls
export const recordingControls = {
  /**
   * Start session recording
   */
  startRecording: () => {
    if (typeof window !== 'undefined') {
      posthog.startSessionRecording()
    }
  },

  /**
   * Stop session recording
   */
  stopRecording: () => {
    if (typeof window !== 'undefined') {
      posthog.stopSessionRecording()
    }
  },

  /**
   * Mask element in recording
   */
  maskElement: (selector: string) => {
    if (typeof window !== 'undefined') {
      const elements = document.querySelectorAll(selector)
      elements.forEach((el) => {
        el.setAttribute('data-private', 'true')
      })
    }
  },
}

export default posthog
