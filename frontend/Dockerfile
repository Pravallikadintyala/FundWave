# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app

# Accept API URL at build time so Vite can embed it
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the Vite application
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Dynamically print the URL if APP_URL is provided in docker-compose
RUN echo 'if [ -n "$APP_URL" ]; then echo -e "\n\n FundWave Frontend running at $APP_URL\n\n"; fi' > /docker-entrypoint.d/40-print-url.sh && \
    chmod +x /docker-entrypoint.d/40-print-url.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
