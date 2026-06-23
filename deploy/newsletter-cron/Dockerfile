# syntax=docker/dockerfile:1
#
# Newsletter autopilot worker (Fly).
#
# supercronic fires `bun run publish-due` on the schedule in
# deploy/newsletter-cron/crontab. Self-contained: the whole monorepo
# (incl. apps/web/content/blog) is baked into the image, so publishing a NEW
# post requires a re-deploy (`fly deploy`) to ship its .mdx. See README.md.
#
# Build context MUST be the repo root (the workspace install needs every
# package.json). Deploy from the repo root — see README.md.

FROM oven/bun:1.3.9

WORKDIR /app

# supercronic — a cron that runs in the foreground and logs to stdout (captured
# by `fly logs`). Pinned + SHA1-verified (v0.2.46, linux-amd64; Fly shared-cpu
# Machines are x86_64).
ENV SUPERCRONIC_URL=https://github.com/aptible/supercronic/releases/download/v0.2.46/supercronic-linux-amd64 \
    SUPERCRONIC_SHA1SUM=5bcefed628e32adc08e32634db2d10e9230dbca0 \
    SUPERCRONIC=supercronic-linux-amd64
RUN apt-get update \
 && apt-get install -y --no-install-recommends curl ca-certificates tzdata \
 && rm -rf /var/lib/apt/lists/* \
 && curl -fsSLO "$SUPERCRONIC_URL" \
 && echo "${SUPERCRONIC_SHA1SUM}  ${SUPERCRONIC}" | sha1sum -c - \
 && chmod +x "$SUPERCRONIC" \
 && mv "$SUPERCRONIC" "/usr/local/bin/${SUPERCRONIC}" \
 && ln -s "/usr/local/bin/${SUPERCRONIC}" /usr/local/bin/supercronic

# Full monorepo. .dockerignore drops node_modules and ALL .env* files — the
# latter is critical: a baked-in .env.local (NEXT_PUBLIC_APP_URL=localhost) would
# override the Fly [env] and re-introduce the localhost-links bug.
COPY . .
RUN bun install --frozen-lockfile || bun install

# Schedule evaluates in UTC (the crontab documents the intent in a comment).
ENV TZ=UTC

# -passthrough-logs forwards job stdout/stderr verbatim. supercronic stays in the
# foreground, so the Machine stays up between ticks.
CMD ["supercronic", "-passthrough-logs", "/app/deploy/newsletter-cron/crontab"]
