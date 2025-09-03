# Minimal Dockerfile for Soulfield API (Node backend)
FROM node:20-alpine AS base

ENV NODE_ENV=production
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Expose API and MCP ports
EXPOSE 8790 8791

# Default command runs the API server. Use compose to run MCP.
CMD ["node", "backend/index.cjs"]

