# Stage 1: Build the React application
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy only the package.json and package-lock.json first to leverage Docker's layer caching
COPY package*.json ./

# Install dependencies
RUN npm install && npm update

# Now copy the rest of the frontend source code to the container
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the React application with NGINX
FROM nginx:alpine

# Update package lists and upgrade installed packages
RUN apk update && apk upgrade

# Remove the default NGINX static resources
RUN rm -rf /usr/share/nginx/html/*

# Copy the build files from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 3000
EXPOSE 3000

# Update NGINX configuration to listen on port 3000
RUN sed -i 's/listen       80;/listen       3000;/g' /etc/nginx/conf.d/default.conf

# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]
