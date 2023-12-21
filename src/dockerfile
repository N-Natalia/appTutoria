# Etapa de construcción
FROM node:18.13.0 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa de producción
FROM nginx:1.21.6-alpine AS prod

# Copia el archivo de configuración personalizado
COPY default.conf /etc/nginx/conf.d/default.conf

# Copia los archivos de la etapa de construcción
COPY --from=build /app/dist/tutoria-app /usr/share/nginx/html



#docker build -t tutoria-app .//construir imagen
#docker run -p 8080:80 tutoria-app 
