#!/bin/bash -ex

apt-get -qq update > /dev/null
apt-get install -yqq build-essential git rsync > /dev/null
curl -sL https://deb.nodesource.com/setup_6.x | bash -
apt-get install -yqq nodejs > /dev/null

mkdir /tmp/davros-build
rsync -a --exclude='factory' /mnt/davros/ /tmp/davros-build
cd /tmp/davros-build

npm set progress=false
npm set color=false

npm install
./node_modules/bower/bin/bower --no-color --allow-root install
./node_modules/ember-cli/bin/ember build

cp -a --no-preserve=ownership dist build node_modules bower_components /mnt/davros
