'use client'

import { usePathname } from 'next/navigation'
import posthog from 'posthog-js'
import { useEffect, useState } from 'react'

type AnalyticsConfig = { token: string | null; host: string | null }
type Choice = 'allow' | 'decline' | null
const preferenceKey = 'wolven_analytics_choice'

function logDev(error: unknown) {
  if (process.env.NODE_ENV !== 'production') console.warn('Analytics unavailable', error)
}

export default function Analytics() {
  const pathname = usePathname()
  const [config, setConfig] = useState<AnalyticsConfig | null>(null)
  const [choice, setChoice] = useState<Choice>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(preferenceKey)
      if (saved === 'allow' || saved === 'decline') setChoice(saved)
    } catch (error) {
      logDev(error)
    }
    const controller = new AbortController()
    fetch('/api/analytics-config', { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then(setConfig)
      .catch((error) => {
        if (!controller.signal.aborted) logDev(error)
      })
    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (choice !== 'allow' || !config?.token || !config.host) return
    posthog.init(config.token, {
      api_host: config.host,
      defaults: '2026-08-30',
      persistence: 'memory',
      autocapture: false,
      capture_pageview: false,
      capture_pageleave: false,
      disable_session_recording: true,
      person_profiles: 'never',
      advanced_disable_feature_flags: true,
      before_send: (event) => {
        if (event?.properties) {
          event.properties.$current_url = window.location.origin
          for (const key of Object.keys(event.properties)) {
            if (/^\$(initial|referr|utm_|pathname)/.test(key)) event.properties[key] = undefined
          }
        }
        return event
      },
    })
    posthog.opt_in_capturing()
    setReady(true)
    return () => {
      posthog.opt_out_capturing()
      setReady(false)
    }
  }, [choice, config])

  useEffect(() => {
    if (ready && ['/guides/ai-agent-development-engagement', '/contact'].includes(pathname)) {
      posthog.capture('$pageview', { site: window.location.hostname, page_path: pathname })
    }
  }, [ready, pathname])

  useEffect(() => {
    if (!ready) return
    const onClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const link = target.closest('a')
      if (pathname !== '/guides/ai-agent-development-engagement' || !link) return
      const destination = new URL(link.href, window.location.origin)
      if (destination.origin !== window.location.origin || destination.pathname !== '/contact')
        return
      posthog.capture('content_cta_click', {
        site: window.location.hostname,
        article_path: pathname,
        destination_path: destination.pathname,
      })
    }
    const onBooking = () =>
      posthog.capture('contact_submit_success', {
        site: window.location.hostname,
        page_path: window.location.pathname,
      })
    const onAudio = (event: Event) => {
      if (
        pathname !== '/guides/ai-agent-development-engagement' ||
        !(event.target instanceof HTMLAudioElement)
      )
        return
      posthog.capture(event.type === 'play' ? 'content_audio_play' : 'content_audio_complete', {
        site: window.location.hostname,
        article_path: pathname,
      })
    }
    document.addEventListener('click', onClick)
    document.addEventListener('play', onAudio, true)
    document.addEventListener('ended', onAudio, true)
    window.addEventListener('booking_completed', onBooking)
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('play', onAudio, true)
      document.removeEventListener('ended', onAudio, true)
      window.removeEventListener('booking_completed', onBooking)
    }
  }, [ready, pathname])

  const choose = (next: Choice) => {
    try {
      if (next) localStorage.setItem(preferenceKey, next)
      else localStorage.removeItem(preferenceKey)
    } catch (error) {
      logDev(error)
    }
    setChoice(next)
  }

  if (!config?.token || !config.host) return null
  if (choice) {
    return (
      <button
        className="fixed bottom-2 right-2 z-50 rounded bg-rust-surface px-3 py-2 text-xs text-rust-ink"
        onClick={() => choose(null)}
        type="button"
      >
        Analytics preferences
      </button>
    )
  }
  return (
    <aside
      aria-label="Analytics preferences"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-xl rounded-lg border border-rust-line bg-rust-surface p-4 text-sm text-rust-ink shadow-lg"
    >
      <p>
        Allow optional analytics to measure page visits, article links and completed bookings? Your
        choice is saved on this device. Form contents are not sent to analytics.
      </p>
      <div className="mt-3 flex gap-3">
        <button
          className="rounded bg-rust-primary px-4 py-2 text-white"
          onClick={() => choose('allow')}
          type="button"
        >
          Allow analytics
        </button>
        <button
          className="rounded border border-rust-line px-4 py-2"
          onClick={() => choose('decline')}
          type="button"
        >
          Decline
        </button>
      </div>
    </aside>
  )
}
