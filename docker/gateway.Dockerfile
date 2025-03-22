FROM node:18-alpine AS builder

WORKDIR /app

# Copy only package files first to leverage cache
COPY backend/package*.json ./
COPY backend/tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY backend/src/gateway ./src/gateway
COPY backend/src/config ./src/config
COPY backend/src/swagger ./src/swagger
COPY backend/src/middleware ./src/middleware
COPY backend/src/lib ./src/lib

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy only production dependencies
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist
COPY backend/src/swagger/auth/swagger-auth-doc.sw ./src/swagger/auth/swagger-auth-doc.sw
COPY backend/src/swagger/users/swagger-users-doc.sw ./src/swagger/users/swagger-users-doc.sw
COPY backend/src/swagger/posts/swagger-posts-doc.sw ./src/swagger/posts/swagger-posts-doc.sw

ENV PORT=3000
EXPOSE 3000

CMD ["node", "dist/gateway/server.js"]