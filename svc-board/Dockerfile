FROM node:16 as builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build


FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app/dist .
COPY --from=builder /app/package.json .
RUN npm install --production

EXPOSE 3000

CMD ["node", "main.js"]
