# Etapa de construcción
FROM node:18-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY frontend/package.json frontend/package-lock.json* ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY frontend/. ./ 

# Construir la aplicación
RUN npm run build
#RUN npx tsc --project tsconfig.json && cp next.config.ts /app/next.config.js

# Etapa de producción
FROM node:18-alpine AS runner

# Establecer directorio de trabajo
WORKDIR /app

# Establecer variables de entorno para producción
ENV NODE_ENV=production

# Copiar archivos necesarios desde la etapa de construcción
COPY --from=builder /app/next.config.ts ./ 
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Exponer puerto
ENV PORT=3005
EXPOSE 3005

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
