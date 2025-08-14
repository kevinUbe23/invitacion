# --- Build ---
FROM node:20-bullseye-slim AS builder
WORKDIR /app

# deps de sistema necesarias para Prisma/Next
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# instala dependencias (incluye dev para build)
COPY package*.json ./
RUN npm ci

# copia código
COPY . .

# genera prisma client y build
RUN npx prisma generate
RUN npm run build

# --- Runtime ---
FROM node:20-bullseye-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# mismas deps de sistema
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# copia artefactos
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

# entrypoint (migraciones + generate por si acaso)
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "server.js"]
