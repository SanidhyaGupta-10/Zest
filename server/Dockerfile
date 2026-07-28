# Node.js production image for Express backend
FROM node:20-alpine AS base

WORKDIR /app

# Copy dependency manifests first to leverage Docker layer caching
COPY package.json package-lock.json* ./

# Install production dependencies
RUN npm ci --only=production

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
