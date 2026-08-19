import { captureServerException } from '@decebal/analytics/server'

/**
 * Next.js instrumentation hooks.
 *
 * `onRequestError` is the only place Next surfaces errors thrown while rendering Server
 * Components, running Server Actions, handling route handlers and running middleware. Without
 * it, PostHog error tracking only ever sees the browser half of the app.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation
 */

type RequestErrorContext = Readonly<{
  routerKind: 'Pages Router' | 'App Router'
  routePath: string
  routeType: 'render' | 'route' | 'action' | 'middleware'
  renderSource?: 'react-server-components' | 'react-server-components-payload' | 'server-rendering'
  revalidateReason: 'on-demand' | 'stale' | undefined
}>

type ErrorRequest = Readonly<{
  path: string
  method: string
  headers: NodeJS.Dict<string | string[]>
}>

/** Headers worth keeping: enough to correlate, nothing that identifies a person. */
const CORRELATION_HEADERS = ['x-vercel-id', 'x-request-id', 'x-forwarded-host', 'referer'] as const

function header(headers: NodeJS.Dict<string | string[]>, name: string): string | undefined {
  const value = headers[name]
  return Array.isArray(value) ? value[0] : value
}

export async function register() {
  // Node APIs are not available in the Edge runtime, so they live in a separate module that is
  // only ever pulled in on the Node side.
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./instrumentation.node')
  }
}

export async function onRequestError(
  error: unknown,
  request: ErrorRequest,
  context: RequestErrorContext
) {
  const correlation: Record<string, unknown> = {
    request_path: request.path,
    user_agent: header(request.headers, 'user-agent'),
  }

  for (const name of CORRELATION_HEADERS) {
    correlation[name.replace(/-/g, '_')] = header(request.headers, name)
  }

  await captureServerException(error, {
    route: context.routePath,
    method: request.method,
    routerKind: context.routerKind,
    routeType: context.routeType,
    renderSource: context.renderSource,
    revalidateReason: context.revalidateReason,
    extra: {
      ...correlation,
      // Next puts this digest in the client-visible error, so it joins a browser report to
      // this server report.
      error_digest: (error as { digest?: string })?.digest,
    },
  })
}
