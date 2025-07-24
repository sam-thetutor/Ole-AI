# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Install system dependencies for native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git \
    libusb-dev \
    eudev-dev

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally
RUN npm install -g pnpm

# Set environment to skip optional dependencies that require native compilation
ENV NODE_ENV=production
ENV SKIP_USB_INSTALL=true

# Install dependencies with legacy peer deps and skip optional deps
RUN pnpm install --frozen-lockfile --legacy-peer-deps --ignore-optional

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Create a production server
FROM nginx:alpine

# Copy built files to nginx
COPY --from=0 /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 