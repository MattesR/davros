# Davros File Storage

Davros lets you store all of your files in the cloud and sync them between your devices.

![Screenshot of Davros](/public/images/screenshot.png)

[![Try Live Demo](https://cdn.rawgit.com/mnutt/davros/master/public/images/try-live.svg)](https://oasis.sandstorm.io/appdemo/8aspz4sfjnp8u89000mh2v1xrdyx97ytn8hq71mdzv4p4d8n0n3h)

## Prerequisites

Davros is built to run inside [Sandstorm](https://sandstorm.io), an open source web application platform. You can either [run Sandstorm yourself](https://sandstorm.io/install/) or [let someone else host it for you](https://oasis.sandstorm.io/).

## Installation

* [Set up Sandstorm](https://sandstorm.io/install/)
* Download the [latest release](https://github.com/mnutt/davros/releases) and upload it to your Sandstorm server.

## OAuth

This fork features OAuth login with a custom provider for any requests to the WebDAV related endpoints of Davros.

There are a few environment variables that handle this, as per this table:

| Variable              | Default value             |
|-----------------------|---------------------------|
| `PORT`                | `3000`                    |
| `PROTOCOL`            | `http`                    |
| `HOST`                | `localhost`               |
| `OAUTH_HOST`          | `http://localhost:8000`   |
| `OAUTH_AUTHORIZE_URL` | `$OAUTH_HOST/o/authorize` |
| `OAUTH_ACCESS_URL`    | `$OAUTH_HOST/o/token`     |
| `OAUTH_REDIRECT_URL`  | `/oauth/callback`         |
| `OAUTH_KEY`           | ``                        |
| `OAUTH_SECRET`        | ``                        |

As you might notice, if your OAuth gateway aligns well with the defaults given, you will only need to set `OAUTH_KEY` and `OAUTH_SECRET` in order for this to work.

As of now, the OAuth feature cannot be turned off. A switch for easy enabling/disabling authentication will be present in the future.

For more about how authentication is handled, see the [authentication.md](./docs/authentication.md) file.

## Docker

Here are some quick, copy-paste friendly, examples of how to build an image and spin a Davros container.

```
$ docker build liquidinvestigations/davros .
$ docker run -d --name davros liquidinvestigations/davros
```

When running the container, you can set all the environment variables listed in the above table, or let them fall back to their default values.

Another thing you might be needing is to mount the data directory as a volume. To do this, simply point any resource you want at the `/davros/data` directory of the container. Here's an updated, more complete command with a volume and env vars:

```
$ docker run -d \
-p 8080:80 \
-v /host/path:/davros/data \
-e PORT=80 \
-e OAUTH_HOST=172.16.0.2 \
-e OAUTH_KEY=somekeyforyouoauthclient \
-e OAUTH_SECRET=hereisthesecretyouwillneverfind \
--name davros \
liquidinvestigations/davros
```

Of course, if you use something like docker-compose, you can link containers and use local name resolution, data containers etc. 

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

### Acknowledgements

* Built on [Ember.js](https://emberjs.com).
* WebDAV support built with [jsDAV](https://github.com/mikedeboer/jsDAV).

### License

See LICENSE file.
