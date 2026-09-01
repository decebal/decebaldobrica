# syntax=docker/dockerfile:1.7

FROM oven/bun:1.3-alpine AS builder

ARG NEXT_PUBLIC_APP_URL=https://wolventech.com
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY=

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json bun.lockb turbo.json ./
COPY apps/anything-llm/package.json apps/anything-llm/
COPY apps/newsletter-admin/package.json apps/newsletter-admin/
COPY apps/services-admin/package.json apps/services-admin/
COPY apps/web/package.json apps/web/
COPY apps/wolventech/package.json apps/wolventech/
COPY packages/analytics/package.json packages/analytics/
COPY packages/booking/package.json packages/booking/
COPY packages/crypto-subscriptions/package.json packages/crypto-subscriptions/
COPY packages/database/package.json packages/database/
COPY packages/email/package.json packages/email/
COPY packages/newsletter/package.json packages/newsletter/
COPY packages/payment-gate/package.json packages/payment-gate/
COPY packages/social/package.json packages/social/
COPY packages/ui/package.json packages/ui/

RUN bun install --frozen-lockfile \
    --filter @decebal/wolventech \
    --filter @decebal/booking \
    --filter @decebal/email \
    --filter @decebal/ui

COPY tooling/typescript tooling/typescript
COPY packages/booking packages/booking
COPY packages/email packages/email
COPY packages/ui packages/ui
COPY apps/wolventech apps/wolventech

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL} \
    NEXT_PUBLIC_TURNSTILE_SITE_KEY=${NEXT_PUBLIC_TURNSTILE_SITE_KEY}

WORKDIR /app/apps/wolventech
RUN bun next build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=4200 \
    HOSTNAME=0.0.0.0

RUN apk add --no-cache tini wget && \
    rm -rf /var/cache/apk/* && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/wolventech/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/wolventech/.next/static ./apps/wolventech/.next/static
COPY --from=builder /app/apps/wolventech/public ./apps/wolventech/public

USER nextjs

EXPOSE 4200

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:4200/api/healthz || exit 1

ENTRYPOINT ["/sbin/tini", "-g", "--"]
CMD ["node", "apps/wolventech/server.js"]
