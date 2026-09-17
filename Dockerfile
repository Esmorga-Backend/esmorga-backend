# syntax=docker/dockerfile:1

# ---------- Build stage ----------
FROM node:26-slim AS build

WORKDIR /app

# Build tools are only needed here to compile native deps (e.g. argon2).
# They are NOT present in the final image.
RUN apt-get update \
  && apt-get install -y --no-install-recommends build-essential python3 \
  && rm -rf /var/lib/apt/lists/*

# Copy dependency manifests first for better layer caching
COPY package.json package-lock.json ./

# Full install (incl. devDependencies) is required to compile the TypeScript build.
RUN npm ci

# Project config needed for the build
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src ./src

# Compile to dist/ (only runtime deps are needed here)
RUN npm run build && npm prune --omit=dev

# ---------- Runtime stage ----------
FROM node:26-slim AS runtime

# Run as a non-root user for security
RUN groupadd --system nodejs \
  && useradd --system --gid nodejs --create-home appuser

WORKDIR /app

# Needed for DB migrations file swap done by the app
RUN chown -R appuser /app

ENV NODE_ENV=PROD \
    NPM_CONFIG_PRODUCTION=true \
    APP_PORT=3000 \
    MIGRATION_ENV=PROD

# Copy only production node_modules (dev dependencies are pruned away)
COPY --from=build /app/node_modules ./node_modules

# Compiled output and runtime assets
COPY --from=build /app/dist ./dist
COPY package.json ./

# DB migrations
COPY --from=build /app/node_modules/.bin ./node_modules/.bin
COPY migrations ./migrations
COPY migrations_prod.json migrations_qa.json migrations_local.json migrations_compose.json ./

USER appuser

EXPOSE 3000

CMD ["sh", "-c", "node dist/main.js"]
