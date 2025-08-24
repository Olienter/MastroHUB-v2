FROM node:20-alpine
WORKDIR /app

# pnpm cez corepack + fallback
RUN corepack enable || true
RUN corepack prepare pnpm@10.14.0 --activate || (npm i -g pnpm@10.14.0 && pnpm -v)

# Závislosti
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Zdrojáky a build
COPY . .
RUN pnpm build

# Runtime
ENV NODE_ENV=production
ENV PORT=3000
RUN apk add --no-cache curl
EXPOSE 3000

# Healthcheck (shell form kvôli env expanzii)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD sh -c "curl -fsS http://127.0.0.1:${PORT:-3000}/api/health | grep -q '\"status\":\"healthy\"' || exit 1"

CMD ["pnpm","start"]
