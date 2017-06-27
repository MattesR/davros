FROM node:7.9.0

#RUN curl -o- -L https://yarnpkg.com/install.sh | bash

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm install -g ember-cli@2.12.0-beta.1

# Install app dependencies
COPY package.json /usr/src/app/
#RUN $HOME/.yarn/bin/yarn install --pure-lockfile
RUN yarn

# Bundle app source
COPY . /usr/src/app
# WORKDIR /usr/src/app

# RUN ember build

EXPOSE 8000

ENTRYPOINT [ "/usr/src/app/docker-entrypoint.sh" ]
