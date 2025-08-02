# Build stage
FROM node:18 AS build

# Declare build time environment variables
ARG REACT_APP_NODE_ENV
ARG REACT_APP_SERVER_BASE_URL

# Set environment variables
ENV REACT_APP_NODE_ENV=$REACT_APP_NODE_ENV
ENV REACT_APP_SERVER_BASE_URL=$REACT_APP_SERVER_BASE_URL

WORKDIR /app

# Copy package files
COPY package*.json ./

# Clean npm cache and install with legacy peer deps
RUN npm cache clean --force
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build with Vite
RUN npm run build

# Production stage with Nginx
FROM nginx:1.23-alpine

# Copy built files from Vite (dist folder, not build)
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: Copy custom nginx config
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]