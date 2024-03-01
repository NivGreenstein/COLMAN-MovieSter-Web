## ===========================================================> The common stage
FROM node:18-bullseye-slim AS base
ENV NODE_ENV=production

WORKDIR /app

COPY package.json \
        package-lock.json    \
        ./ 
RUN npm ci --only=production \
        && npm cache clean --force

RUN apt-get update && apt-get install -y curl

## Remove unnecessary files from `node_modules` directory
RUN ( curl -q -O /dev/stdout https://gobinaries.com/tj/node-prune | sh ) \
        && node-prune


## ======================================================> The build image stage
FROM base AS build
ENV NODE_ENV=development

COPY . .

## This step could install only the missing dependencies (ie., development deps ones)
RUN npm install
## Compile the TypeScript source code
RUN npm run build

## =================================================> The production image stage
FROM node:18-bullseye-slim AS prod
ENV NODE_ENV=production

ENV DB_NAME=moviester
ENV MONGO_DB_URL=mongodb://host.docker.internal:27017/moviester
ENV POSTGRES_PORT=5432
ENV ACCESS_TOKEN_SECRET=abc123
ENV REFRESH_TOKEN_SECRET=cbd321
ARG PORT=5000
ENV PORT=$PORT
EXPOSE $PORT

WORKDIR /app

## Copy required file to run the production application
COPY --from=base --chown=node:node /app/node_modules ./node_modules
COPY --from=base --chown=node:node /app/*.json ./ 
COPY --from=build --chown=node:node /app/dist ./dist/

## https://engineeringblog.yelp.com/2016/01/dumb-init-an-init-for-docker.html
RUN apt-get update && apt-get install -y dumb-init

## Dropping privileges
USER node

## Running the app wrapped by the init system for helping on graceful shutdowns
CMD ["dumb-init", "node", "."]