# 1: 'base' 
FROM node:18-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci

# 2: 'development' 
FROM base AS development
COPY . .
CMD [ "npm", "run", "dev" ]

# 3: 'production' 
FROM base AS production
COPY . .
RUN npm run build
RUN npm prune --production

# 4: 'release' 
FROM node:18-alpine AS release
WORKDIR /usr/src/app
COPY --from=production /usr/src/app/package*.json ./
COPY --from=production /usr/src/app/node_modules ./node_modules
COPY --from=production /usr/src/app/dist ./dist
CMD [ "node", "dist/server.js" ]