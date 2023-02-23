FROM node:14.21-alpine

WORKDIR /usr/src/app

COPY package.json .

RUN yarn install

COPY . .

EXPOSE 3000

RUN yarn build

CMD ["npm", "run", "start:prod"]