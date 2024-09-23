FROM node:20.12.2-alpine3.19

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

RUN npm run build

RUN npx prisma generate

COPY ./src/assets ./dist/assets

CMD ["npm", "run", "start:prod"]