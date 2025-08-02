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

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:1.23-alpine

# Copy built files from Vite
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]