FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install -g npm@latest
RUN npm install --omit=dev  && npm prune --production
RUN npm audit fix
COPY . .

CMD ["npm", "start"]
# FROM node:alpine as base

# ENV PNPM_HOME="/pnpm"
# ENV PATH="$PNPM_HOME:$PATH"
# RUN corepack enable
# COPY . /app
# WORKDIR /app

# FROM base AS prod-deps
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# FROM base AS build
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# RUN pnpm run build

# FROM base
# RUN mkdir .git
# ARG COMMIT_SHA
# LABEL commit_sha=$COMMIT_SHA
# COPY --from=prod-deps /app/node_modules /app/node_modules
# COPY --from=build /app/dist /app/
# CMD [ "pnpm", "start" ]