# --- Base stage ---
FROM node:22-slim AS base
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# --- Dev stage ---
FROM base AS dev
EXPOSE 4321
CMD ["npm", "run", "dev"]

# --- Build stage ---
FROM base AS builder
RUN npm run build

# --- Production stage ---
FROM node:22-slim AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
RUN npm install -g serve
EXPOSE 4321
CMD ["serve", "-s", "dist", "-l", "4321"]
