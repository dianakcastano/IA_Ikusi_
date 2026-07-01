FROM node:18-slim

# Instalar dependencias del sistema necesarias para compilar SQLite (si es necesario según la arquitectura)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar archivos de definición de dependencias
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Copiar el resto del código de la aplicación
COPY . .

# Establecer variables de entorno por defecto
ENV PORT=8080
ENV NODE_ENV=production

# Exponer el puerto
EXPOSE 8080

# Iniciar la aplicación
CMD ["node", "server.js"]
