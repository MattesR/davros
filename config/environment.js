/* jshint node: true */

const davrosUrl = undefined;

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'davros',
    environment: environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    contentSecurityPolicy: {
      'default-src': "'none'",
      'script-src': "'self' 'unsafe-inline'",
      'font-src': "'self'",
      'frame-src': "'self' *",
      'object-src': "'self'",
      'connect-src': "'self' * ws://localhost:*",
      'img-src': "'self' * data:",
      'media-src': "'self'",
      'style-src': "'self' 'unsafe-inline'"
    },

    torii: {
      sessionServiceName: 'session',
      remoteServiceName: 'iframe',
      providers: {
        'liquid': {
          redirectUri: (davrosUrl || 'http://localhost:4200') + '/torii/redirect.html',
          clientId: 'TJjPpDHSGHY3RMRa1xYaQIa5R1LMbtf3cLatZnAm',
          clientSecret: 'obNvbyuMe2LdHKTdITqKnjgQ9KQtW56PIKLpl8VL0AhYWebFSQSTwoHmar6cFvjHdU3hfBcoHOD8ycociHRFUacU867g6R4JroBxZyZhLGd3O8TYUorYVXIYBAN5TRJf',
        },
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
