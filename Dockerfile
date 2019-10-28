FROM node:10.16.3

MAINTAINER Shawn Park <moidpg@gmail.com>

RUN mkdir -p /app
WORKDIR /app
ADD . /app
RUN npm install
EXPOSE 8888

CMD [ "npm","product" ]