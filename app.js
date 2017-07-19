var startTime = new Date();
require('cache-require-paths');

var express = require('express');
var session = require('express-session');
var Grant   = require('grant-express');
var fs      = require('fs');
var api     = require('./server');
var path    = require('path');
var http    = require('http');
var compression = require('compression');

var root = __dirname;
var indexFile = path.resolve(root + '/dist/index.html');

var port = (process.env.DAVROS_PORT || '3000');
var socket = process.env.SOCKET;
var oauthGateway = (process.env.OAUTH_HOST || 'http://localhost:8000');

fs.access(indexFile, fs.constants.F_OK, function(err) {
  if(err) {
    console.error('Missing dist/index.html; run `ember build` to generate it.');
    process.exit(1);
  }
});

var grant = new Grant({
  'server': {
    'protocol': (process.env.DAVROS_PROTOCOL || 'http'),
    'host': (process.env.DAVROS_HOST || 'localhost') + `:${port}`,
    'callback': '/oauth/callback',
    'transport': 'session',
    'state': true
  },
  'default': {
    'authorize_url': (process.env.OAUTH_AUTHORIZE_URL || oauthGateway + '/o/authorize'),
    'access_url': (process.env.OAUTH_ACCESS_URL || oauthGateway + '/o/token/'),
    'callback': (process.env.OAUTH_REDIRECT_URL || '/oauth/callback'),
    'oauth': 2,
    'key': (process.env.OAUTH_KEY || ''),
    'secret': (process.env.OAUTH_SECRET || ''),
    // 'scope': ['read', 'write']
  },
});

var app = express();
var server = http.createServer(app);

app.use(session({
  secret: 'grant',
  // resave: false,
  saveUninitialized: true,
  // cookie: { secure: !true }
}));

app.use(grant);
app.oauth = grant;

app.use(compression());
app.use(express.static('dist'));

api(app, {httpServer: server});

app.use('/', function(req, res, next) {
  // send ember's index.html for any unknown route
  res.sendFile(indexFile);
});

if(socket) {
  server.listen(socket, function() {
    console.log('Davros listening on %s', socket);
  });
} else {
  server.listen(port, function () {
    var time = new Date() - startTime;
    console.log('Davros started in %sms, listening on port %s', time, port);
  });
}
