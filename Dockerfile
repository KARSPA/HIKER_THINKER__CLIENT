#Construction de l'image de l'application
FROM node:22.14-slim AS build
WORKDIR /app
COPY package*.json ./
# Installation des dépendances
RUN npm ci
RUN npm install -g @angular/cli
COPY . .
# Build le projet en mode production
RUN npm run build --configuration=production

# Serveur NGINX pour servir/distribuer les fichiers
FROM nginx:latest
# Copier la config NGINX
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
# Copier le répertoire contenant l'application et les assets.
COPY --from=build /app/dist/hiker-thinker/browser /usr/share/nginx/html


EXPOSE 80