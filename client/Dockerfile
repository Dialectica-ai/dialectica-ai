# --- Builder Image ---
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma

COPY . .

# dummy DATABASE_URL for build time
ENV DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
RUN npm run build

# --- Production Image ---
FROM node:24-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

ENV PORT=3001

EXPOSE 3001

CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && npm run start"]