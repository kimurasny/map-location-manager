# ---- ビルドステージ ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# API クライアントは生成済みをコミットしているため、そのままビルドする。
RUN npm run build

# ---- 配信ステージ（Nginx） ----
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
