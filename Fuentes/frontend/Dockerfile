# --- ETAPA 1: EL OBRERO QUE CONSTRUYE ---
# 1. Traemos un ordenador con Node.js versión 20. Usamos la 20 porque tu Angular es súper moderno (versión 20) y necesita lo último. Llamamos a esta etapa "build".
FROM node:20 AS build

# 2. Le decimos al ordenador que cree una carpeta llamada /app y se meta dentro a trabajar.
WORKDIR /app

# 3. Copiamos tus archivos package.json y package-lock.json. Aquí es donde dice qué librerías necesitas.
COPY package*.json ./

# 4. Le damos la orden de descargar todas esas librerías (esto crea la famosa y pesada carpeta node_modules dentro del contenedor, sin ensuciar tu Mac).
RUN npm install

# 5. Ahora sí, copiamos el resto de tu código Angular (tus componentes, tus HTML, tus CSS...).
COPY . .

# 6. Ejecutamos el comando de Angular para compilar la web en modo "Producción" (esto la comprime y la hace súper rápida).
RUN npm run build --configuration=production


# --- ETAPA 2: EL ESCAPARATE QUE ENSEÑA LA WEB ---
# 7. Despedimos al obrero (Node) y traemos a Nginx (un servidor web súper rápido y que pesa poquísimo).
FROM nginx:alpine

# 8. ¡El truco de magia! Vamos al ordenador del obrero (build), cogemos la web ya compilada de la carpeta "miopia/browser" y la pegamos en la carpeta pública de Nginx para que el mundo la vea.
COPY --from=build /app/dist/miopia/browser /usr/share/nginx/html

# 9. Le decimos a Docker que este contenedor va a comunicarse por el puerto 80 (el puerto estándar de Internet).
EXPOSE 80

# 10. La orden final: "Enciende el servidor Nginx y no te apagues".
CMD ["nginx", "-g", "daemon off;"]