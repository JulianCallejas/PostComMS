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
COPY backend/src/services/posts ./src/services/posts
COPY backend/src/config ./src/config
COPY backend/src/swagger/posts ./src/swagger/posts
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
COPY backend/src/swagger/posts/swagger-posts-doc.sw ./src/swagger/posts/swagger-posts-doc.sw

ENV PORT=3003
EXPOSE 3003

CMD ["node", "dist/services/posts/server.js"]