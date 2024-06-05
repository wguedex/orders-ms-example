FROM node:21-alpine3.19

WORKDIR /usr/src/app

COPY package*.json ./

# Actualizar npm y configurar opciones
RUN npm install -g npm@latest \
    && npm config set fetch-timeout 120000 \
    && npm config set fetch-retries 5 \
    && npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000 \
    && npm cache clean --force \
    && rm -rf node_modules package-lock.json

# Usar --omit=optional para excluir dependencias opcionales
RUN npm install --omit=optional

COPY . .

EXPOSE 3002
