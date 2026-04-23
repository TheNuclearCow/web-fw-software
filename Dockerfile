FROM nginx:alpine

# Copy the custom nginx configuration
COPY default.conf /etc/nginx/conf.d/default.conf

# Copy the static website files
COPY . /usr/share/nginx/html

EXPOSE 8001

CMD ["nginx", "-g", "daemon off;"]
