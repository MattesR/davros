FROM node:7.9.0

RUN mkdir -p /davros
WORKDIR /davros

RUN npm install -g ember-cli@2.12.0-beta.1 bower

COPY package.json .
RUN yarn

COPY . .
RUN bower install --allow-root
RUN ember build

ENV PORT 80
EXPOSE 80
CMD node app.js
