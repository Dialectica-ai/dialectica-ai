# --- Build stage ---
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json tsconfig.json ./
RUN npm install

COPY . .
RUN npm run build

# --- Runtime stage ---
FROM node:24-alpine AS runtime

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev --ignore-scripts && npm cache clean --force

COPY --from=builder /app/dist ./dist

EXPOSE 5003
CMD ["npm", "start"]
