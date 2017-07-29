FROM node:7.9.0

RUN mkdir -p /davros
WORKDIR /davros

RUN npm install -g ember-cli@2.14.0 bower

COPY package.json .
RUN npm i
COPY bower.json .
RUN bower install --allow-root

COPY . .
RUN ember g ember-plupload
RUN ember build

ENV PORT 80
EXPOSE 80
CMD node app.js
