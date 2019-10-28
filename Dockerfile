FROM node:10.16.3

MAINTAINER Shawn Park <moidpg@gmail.com>

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8888
CMD [ "npm", "start" ]