FROM node:18-alpine AS builder

WORKDIR /app
RUN apk add --no-cache openssl

# Copy only package files first
COPY backend/package*.json ./
COPY backend/tsconfig.json ./
COPY backend/prisma ./prisma/

# Install dependencies
RUN npm ci
RUN npx prisma generate

# Copy only necessary source files
COPY backend/src/services/users ./src/services/users
COPY backend/src/config ./src/config
COPY backend/src/middleware ./src/middleware
COPY backend/src/lib ./src/lib

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app
RUN apk add --no-cache openssl

# Copy only production dependencies and Prisma files
COPY backend/package*.json ./
COPY backend/prisma ./prisma/
RUN npm ci --only=production
RUN npx prisma generate

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

ENV PORT=3002
EXPOSE 3002

CMD ["node", "dist/services/users/server.js"]