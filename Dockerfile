FROM node:12

WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 6969

CMD [ "node", "server.js" ]