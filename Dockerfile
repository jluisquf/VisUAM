# Hacer el build
FROM node:latest as build
WORKDIR /app
COPY . .
# Instalar las dependencias
RUN npm install
# Hacemos el build de la app
RUN npm run build --prod


# Crear el web server
FROM nginx:alpine as server
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/vis-uam /usr/share/nginx/html
EXPOSE 80
