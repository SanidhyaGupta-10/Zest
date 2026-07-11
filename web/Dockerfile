# Use the official Oven Bun image
FROM oven/bun:1-slim AS base

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN bun install

# Copy the rest of the application files
COPY . .

# Disable Next.js telemetry and set production environment
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the Next.js application
RUN bun run build

# Expose the port Next.js runs on
EXPOSE 3000

# Start the application using Next.js production server
CMD ["bun", "run", "start"]
