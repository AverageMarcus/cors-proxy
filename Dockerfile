FROM node:10-alpine

WORKDIR /app

ADD package.json .
RUN npm install
ADD index.js index.html ./

CMD npm start
