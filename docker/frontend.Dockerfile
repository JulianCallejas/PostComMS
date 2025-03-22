# Etapa de construcción
FROM node:18-alpine AS builder

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json* ./

RUN npm ci

COPY frontend/. ./ 

RUN npm run build

# Etapa de producción
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/next.config.ts ./ 
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

ENV PORT=3005
EXPOSE 3005

CMD ["npm", "start"]
