# Build stage
FROM node:18 AS build

# Declare build time environment variables (Vite)
# Truyền bằng: docker build --build-arg VITE_API_ROOT='https://api.example.com' ...
ARG VITE_API_ROOT
ARG VITE_SOCKET_URL
ARG VITE_ADMIN_ID
ARG VITE_GOOGLE_MAP_API_KEY
ARG VITE_DOMAIN_AUTH0
ARG VITE_CLIENT_ID_AUTH0
ARG VITE_REACT_GOOGLE_CLIENT_ID
ARG VITE_FACEBOOK_APP_ID

# Set environment variables (chỉ tồn tại trong giai đoạn build)
ENV VITE_API_ROOT=$VITE_API_ROOT
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL
ENV VITE_ADMIN_ID=$VITE_ADMIN_ID
ENV VITE_GOOGLE_MAP_API_KEY=$VITE_GOOGLE_MAP_API_KEY
ENV VITE_DOMAIN_AUTH0=$VITE_DOMAIN_AUTH0
ENV VITE_CLIENT_ID_AUTH0=$VITE_CLIENT_ID_AUTH0
ENV VITE_REACT_GOOGLE_CLIENT_ID=$VITE_REACT_GOOGLE_CLIENT_ID
ENV VITE_FACEBOOK_APP_ID=$VITE_FACEBOOK_APP_ID

# Set the working directory
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