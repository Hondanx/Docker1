FROM node:14 as base 

WORKDIR /app

COPY package.json /app/



FROM base as dev 

RUN npm install

CMD ["npm", "run", "start-dev"]

COPY . /app/

EXPOSE 4000



FROM base as prod 

RUN npm install --only=production 

CMD ["npm","start"]

COPY . /app/

EXPOSE 4000
