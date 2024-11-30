FROM node:14
WORKDIR /app

COPY package.json /app/

run npm install

copy .  .

EXPOSE 4000 6000

cmd ["npm","start"]