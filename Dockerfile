FROM nginx:alpine

# Copy the frontend files to the default Nginx public directory
COPY . /usr/share/nginx/html

EXPOSE 80
