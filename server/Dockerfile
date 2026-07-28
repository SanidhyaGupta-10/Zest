# Node.js production image for Express backend
FROM node:20-slim AS base

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Configure npm registry fetch retries and install production dependencies
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm ci --omit=dev

# Copy Prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy source code and build TypeScript project
COPY . .
RUN npm run build

# Expose backend port
EXPOSE 4000

ENV PORT=4000
ENV NODE_ENV=production

# Start compiled server
CMD ["npm", "run", "start"]
