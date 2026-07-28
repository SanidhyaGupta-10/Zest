# Node.js production image for Next.js frontend
FROM node:20-alpine AS base

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

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
