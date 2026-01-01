# Usar nginx para servir la aplicación Angular ya construida
FROM nginx:alpine

# Copiar los archivos construidos al directorio de nginx
COPY dist/hult-prize-registro /usr/share/nginx/html

# Exponer puerto 80
EXPOSE 80

# Comando por defecto de nginx
CMD ["nginx", "-g", "daemon off;"]