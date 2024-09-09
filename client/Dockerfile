# FROM node:lts-alpine

# WORKDIR /app

# COPY package.json .
# RUN npm install -g npm@latest
# RUN npm install -g pnpm
# RUN pnpm install
# COPY . .
# CMD ["pnpm", "run", "dev"]

FROM oven/bun:canary-alpine
WORKDIR /app
COPY package.json .
RUN bun install
COPY . .
CMD ["bun","run","dev"]
