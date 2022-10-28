
FROM node:16
WORKDIR /app
COPY dist .
COPY package.json .

RUN npm install --production

EXPOSE 3000

CMD ["node", "main.js"]
