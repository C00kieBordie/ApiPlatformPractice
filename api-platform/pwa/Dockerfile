#syntax=docker/dockerfile:1

# Versions
FROM node:lts AS node_upstream

# Base stage for dev and build
FROM node_upstream AS base

WORKDIR /srv/app

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Delete the following line in case you want to enable telemetry during dev and build.
ENV NEXT_TELEMETRY_DISABLED=1

# Development image
FROM base AS dev

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=localhost

COPY package.json pnpm-lock.yaml* package-lock.json* ./

RUN npm install || true

CMD ["sh", "-c", "npm install && npm run dev"]

FROM base AS builder

COPY package.json pnpm-lock.yaml* package-lock.json* ./

RUN npm install --omit=dev || npm install

COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM node_upstream AS prod

WORKDIR /srv/app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --gid 1001 nodejs 2>/dev/null || true; \
	adduser --uid 1001 --ingroup nodejs nextjs 2>/dev/null || true

COPY --from=builder --link /srv/app/public ./public

# Set the correct permission for prerender cache
RUN mkdir -p .next; \
	chown -R nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --link --chown=1001:1001 /srv/app/.next/standalone ./
COPY --from=builder --link --chown=1001:1001 /srv/app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
