# Davros File Storage

Davros lets you store all of your files in the cloud and sync them between your devices.

![Screenshot of Davros](/public/images/screenshot.png)

[![Try Live Demo](https://cdn.rawgit.com/mnutt/davros/master/public/images/try-live.svg)](https://oasis.sandstorm.io/appdemo/8aspz4sfjnp8u89000mh2v1xrdyx97ytn8hq71mdzv4p4d8n0n3h)

## Prerequisites

Davros is built to run inside [Sandstorm](https://sandstorm.io), an open source web application platform. You can either [run Sandstorm yourself](https://sandstorm.io/install/) or [let someone else host it for you](https://oasis.sandstorm.io/).

## Installation

* [Set up Sandstorm](https://sandstorm.io/install/)
* Download the [latest release](https://github.com/mnutt/davros/releases) and upload it to your Sandstorm server.

## Development

Davros is built using Node.js and Ember.js. To run locally, you'll need to install node.js. Then:

* `npm install`
* `bower install`
* `PORT=3009 ember serve`

At this point you'll have Davros running at `http://localhost:3009`. Substitute `3009` for another port if you want. Note that running Davros this way is not particularly safe; it relies completely on Sandstorm for user management and authentication.

In development, you can connect your desktop client to http://localhost:3009/ with any username and password.

## Sandstorm Development

A few parts of Davros are dependent on running within Sandstorm, such as the authentication instructions on the Clients page. To run inside Sandstorm, first get [vagrant-spk](https://github.com/sandstorm-io/vagrant-spk). Then, within the Davros directory, run

    vagrant-spk up
    ember spk

This uses [ember-cli-vagrant-spk](https://github.com/mnutt/ember-cli-vagrant-spk) to automatically inject Davros into your local Sandstorm instance.

### Building

* `ember build` (development)
* `ember build --environment production` (production, minified)
* `vagrant-spk pack build/davros-v0.10.0`

### OAuth

Davros needs a valid OAuth provider. This will work in two ways:

* use `ember s` from project root, in which case you need to modify the 
  providers in `app/torii-providers` and `config/environment.js`
* build a Docker container (see next section) and use environment variables 
  `OAUTH_URL` and `DAVROS_URL`

### Docker

This Davros clone is able to run from a Docker container and provide access 
only to OAuth authorized clients.

First you need to build the image: from project's root, run
`docker build -t <somenamespace>/davros .`

When running the container, you can set these environment variables, or let 
them fall back to their default values:

```
OAUTH_URL=http://localhost:8000
DAVROS_URL=http://localhost:4200
```

Sample command:

```
docker run -d -p 8100:8000 -e OAUTH_URL=http://localhost:8000 -e DAVROS_URL=http://localhost:8100 --name davros nightsh/davros
```

The above will run Davros:

* with OAuth support on local port 8100
* authenticating against a local server on port 8000
* in a detached container named `davros` (see with `docker ps`)
* from the image built as `nightsh/davros`

Note: `docker run` will trigger an `ember build` each time the container is 
started, due to some `sed` operations going on in the Ember source files. This 
is because the Davros server is always using the prebuilt Ember app. Don't 
panic if you can't see anything in your browser after running – you can check 
the container's logs to monitor when it's ready, e.g. `docker logs -f davros`

### Acknowledgements

* Built on [Ember.js](https://emberjs.com).
* WebDAV support built with [jsDAV](https://github.com/mikedeboer/jsDAV).

### License

See LICENSE file.
