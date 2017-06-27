#!/bin/bash

cd /usr/src/app
if [ -n "$DAVROS_URL" ]; then
    sed -i "s|davrosUrl = undefined|davrosUrl = '$DAVROS_URL'|g" config/environment.js
fi
if [ -n "$OAUTH_URL" ]; then
    sed -i "s|oauthUrl = undefined|oauthUrl = '$OAUTH_URL'|g" app/torii-providers/liquid.js
fi

ember build

node app.js
