# Node.js production image for Next.js web application
FROM node:20-slim AS base

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json* ./

# Configure npm registry fetch retries and install dependencies
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm ci

# Copy application source code
COPY . .

# Set environment variables for build phase
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build Next.js app
RUN npm run build

# Expose port
EXPOSE 3000

ENV PORT=3000

# Start production server
CMD ["npm", "run", "start"]
