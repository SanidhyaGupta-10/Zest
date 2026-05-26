# Use the official Oven Bun image
FROM oven/bun:1-slim

WORKDIR /app

# Install openssl and ca-certificates (needed by Prisma to connect to secure databases)
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies using Bun
RUN bun install

# Copy Prisma directory and generate Prisma client
COPY prisma ./prisma/
RUN bunx prisma generate

# Copy the rest of the application files
COPY . .

# Expose the server port
EXPOSE 4000

# Start the server using Bun
CMD ["bun", "run", "server.ts"]
