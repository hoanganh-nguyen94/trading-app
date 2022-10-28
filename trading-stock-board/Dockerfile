FROM node:16 as builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build


FROM nginx:1.21-alpine
WORKDIR /usr/share/nginx/html

COPY --from=builder /app/build /usr/share/nginx/html/

COPY --from=builder /app/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
