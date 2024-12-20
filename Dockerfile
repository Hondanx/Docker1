FROM node:14

WORKDIR /app

COPY package.json /app/
RUN npm install

COPY . /app/

EXPOSE 4000

CMD ["npm", "run", "start-dev"]
