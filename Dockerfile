FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN apk add g++ make py3-pip

EXPOSE 3000

CMD npm start