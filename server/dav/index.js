var fs = require('fs');
var os = require('os');

var storage                = require("node-persist");
var request                = require("request");
var jsDAV                  = require("jsDAV/lib/jsdav");
var jsDAV_Server           = require("jsDAV/lib/DAV/server");
var jsDAV_Util             = require("jsDAV/lib/shared/util");
var Tree                   = require("./backend/tree");
var jsDAV_Locks_Backend_FS = require("jsDAV/lib/DAV/plugins/locks/fs");

//jsDAV.debugMode = true

// for free disk space reporting
var statvfs = require('./statvfs-shim');
fs.statvfs = statvfs;

var oauthGateway = (process.env.OAUTH_HOST || 'http://localhost:8000');

var validateToken = function(token) {
  // FIXME use env vars
  var requestOptions = {
    url: `${oauthGateway}/accounts/profile`,
    'auth': {
      'bearer': token
    }
  };
  return request.get(requestOptions, function(error, response, body) {
    if(error) {
      console.log(error);
      return false;
    }
    if (response.statusCode === 200) {
      return false;
    } else {
      return body;
    }
  });
}

var redirectToLogin = function(res, next) {
  // Put in a header containing the OAuth login link and go 403
  res.set({
    'OauthURL': '/connect/default'
  });
  res.status(403);
  return next();
}

exports.base = '/remote.php/webdav';

exports.server = function(root) {

  console.log("Mounting webdav from data dir " + root);

  var tempDir = os.tmpdir();
  console.log("Storing temporary files in " + tempDir);

  var tree = Tree.new(root);

  var server = jsDAV.mount({
    tree: tree,
    tmpDir: tempDir,
    sandboxed: true,
    locksBackend: jsDAV_Locks_Backend_FS.new(root),
    plugins: jsDAV_Util.extend(jsDAV_Server.DEFAULT_PLUGINS, {
      "ws-notify": require("./notify"),
      "root-delete": require("./root-delete"),
      "mtime":       require("./mtime"),
      "safe-gets":   require("./safe-gets")
    })
  });

  tree.setSandbox(tree.basePath);
  require('./backend/etag').tree = tree;

  server.baseUri = exports.base + '/';

  return function(req, res, next) {
    if(req.url.indexOf(exports.base) === 0) {
      // Init the storage
      return storage.init()
      .then(function() {
        // Get the session's token
        return storage.getItem(req.sessionID)
        .then(function(token) {
          if(token) {
            validateToken(token) || redirectToLogin(res, next);
            server.emit('request', req, res);
          } else {
            redirectToLogin(res, next);
          }
        });
      });
    } else {
      next();
    }
  };
};
