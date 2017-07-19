var exec       = require('child-process-promise').exec;
var url        = require('url');
var storage    = require('node-persist');

var configPath = process.env.CONFIG_PATH || (__dirname + "/../config");
var domainFilePath = [configPath, 'domain'].join('/');

exports.callback = function(req, res) {
  console.log('Callback session ID', req.sessionID);
  var token = req.session.grant.response.access_token;
  console.log('Callback token', token);
  storage.init().then(function() {
    storage.setItem(req.sessionID, token, { ttl: 1000*3600 /* 1 hour */ })
    .then(function() {
      return storage.getItem(req.sessionID)
    })
    .then(function(value) {
      console.log('Access token cached!', value);
      // debugger;
      res.redirect('/files');
    })
  });
};
