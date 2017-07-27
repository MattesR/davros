import Ember from 'ember';
import fetch from 'ember-network/fetch';
import $ from 'jquery';
import File from 'davros/models/file';
import ensureCollectionExists from 'davros/lib/ensure-collection-exists';
import { task } from 'ember-concurrency';

const { get, inject, Logger } = Ember;

const socketUrl = ((document.location.protocol === 'https:') ? 'wss://' : 'ws://') + document.location.host;

export default Ember.Route.extend({
  websockets: inject.service(),
  queryParams: {
    code: {
      refreshModel: true
    }
  },

  init: function() {
    this._super.apply(this, arguments);

    const socket = get(this, 'websockets').socketFor(socketUrl);

    socket.on('message', this.messageHandler, this);
  },

  messageHandler: function(rawMessage) {
    var message = JSON.parse(rawMessage.data);

    if(message.file) {
      if(message.file === "/") { message.file = ""; }
      if(this.get('controller.model.path') === message.file) {
        this.get('controller.model').load();
      }
    }
  },

  model: function(params) {

    var id = params.path || '';
    var file = File.create({path: id});
    var options = {};
    if (params.code) {
      options.code = params.code;
    }

    window.history.pushState(
      "object or string",
      "Title",
      String(window.location).replace(/code=[^&\/]*&*/, '')
    );

    return file.load(options).then((res) => {
        if (res instanceof Array && res[0] && res[0].nodeName === 'error') {
          let errors = res.slice();
          Logger.info('cloned errors', errors);
          res = {
            isError: true,
            oauthURL: errors[0].querySelector('oauthURL').innerHTML,
            errors
          };
        }
        return res;
    });


  },

  resetController(controller, isExiting) {
    if (isExiting) {
      // isExiting would be false if only the route's model was changing
      controller.set('code', undefined);
    }
  },

  renderTemplate: function() {
    if(this.get('controller.model.isError')) {
      this.render('unauthorized');
    } else if(this.get('controller.model.isDirectory')) {
      this.render('directory');
    } else {
      this.render('file');
    }
  },

  uploadFile: task(function * (file) {
    if(file.blob.type === "") { yield; } // it's a directory
    var location = document.location.pathname;
    var path = file.blob.webkitRelativePath || file.get('fullPath') || file.get('name');

    if(location.indexOf('/files') === 0) {
      // if user is in a directory, upload the files there
      location = location.replace(/^\/files\//, '');
      // dirname of current path, so if path is /foo/README, use /foo/
      location = location.replace(/\/[^\/]*$/, '');
    } else {
      // otherwise, upload files in the root directory
      // (this shouldn't happen anymore)
      location = '';
    }

    if(path[0] !== '/') { path = '/' + path; }

    console.log("uploading " + path + " into location " + location);

    var fullPath = [location, path].join('');

    yield ensureCollectionExists(fullPath).then(() => {
      return file.upload('/api/upload', {
        data: {
          destination: fullPath
        }
      }).then(() => {
        return this.get('controller.model').load();
      });
    });
  }).maxConcurrency(5).enqueue(),

  actions: {
    "delete": function(defer) {
      var model = this.get('controller.model');
      var parent = model.get('parent');

        return model.delete().then(() => {
        if(parent) {
          this.transitionTo('file', parent);
      } else {
          this.transitionTo('files');
      }
      }).then(() => { defer.resolve(); }, () => { defer.reject(); });
    },

    newDirectory(dirname, defer) {
      var model = this.get('controller.model');

        var fullPath = [model.get('rawPath'), dirname].join('/');
        return fetch(fullPath, {method: 'MKCOL'}).then(() => {
          return this.get('controller.model').load();
      }).then(() => { defer.resolve(); }, () => { defer.reject(); });
    },

    chooseUpload() {
      $("#upload-placeholder").click();
    },

    downloadDirectory() {
      var path = this.get('controller.model.path');
      var endpoint = "/api/archive?path=" + encodeURIComponent(path);
      document.location.href = endpoint;
    },

    upload: function(file) {
      this.get('uploadFile').perform(file);
    }
  }

});
