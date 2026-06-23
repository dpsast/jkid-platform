FROM node:24-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/daemon/package.json packages/daemon/package.json
COPY packages/web/package.json packages/web/package.json
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY . .
RUN pnpm web:build

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=8000
ENV SQLITE_URL=file:/data/jkid.db
WORKDIR /app
COPY --from=build /app /app
RUN mkdir -p /data
VOLUME ["/data"]
EXPOSE 8000
WORKDIR /app/packages/daemon
CMD ["pnpm", "start"]
