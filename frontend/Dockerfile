# 1: 'base'
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# 2: 'development'
FROM base AS development
WORKDIR /app
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]

# 3: 'build'
FROM base AS build
WORKDIR /app
COPY . .
RUN npm run build

# 4: 'release' 
FROM nginx:stable-alpine AS release
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]