FROM node:18

WORKDIR /app

COPY ./src/package.json ./

RUN apt-get update && apt-get install -y bash
RUN npm install -g npm@latest

COPY ./src/ .

RUN npm install

expose 3000

# start express server (server.js)
CMD ["npm", "run", "start"]
