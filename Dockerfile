FROM node:10-alpine

WORKDIR /app

ADD package.json .
RUN npm install
ADD index.js .

CMD npm start
