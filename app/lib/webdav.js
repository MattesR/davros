import Ember from 'ember';
import fetch from 'ember-network/fetch';

const { Logger } = Ember;
const propFindQuery = new Blob(['<?xml version="1.0" ?>\n<D:propfind xmlns:D="DAV:"><D:allprop/></D:propfind>'], {type: 'application/xml'});

export default {
  base: '/remote.php/webdav',

  propfind: function(path, options) {
    if (!options) {
      options = {};
    }
    return fetch(path, {
      method: 'PROPFIND',
      contentType: 'application/xml',
      headers: {
        oauthCode: options.code || ''
      },
      body: propFindQuery
    }).then(function(response) {
      if(response.status >= 200 && response.status < 400) {
        return response.text();
      } else if(response.status === 403) {
        var err = new Error('WebDAV access forbidden');
        err.code = 403;

        err.oauthURL = response.headers.map['oauthurl'][0];

        throw err;
      } else {
        if(response.status === 404) {
          throw(new Error(`404 Not Found`));
        } else {
          throw(new Error(`${response.status} Error`));
        }
      }
    }).catch(function(error) {
      if (error.message === '403') {
        Logger.info('Error link:', error.oauthURL);
        return error.oauthURL;
      } else {
        Logger.error('WebDAV error: ', error);
      }
      return `<error><code>${error.code}</code>
              <message>${error.message}</message>
              <oauthURL>${error.oauthURL}</oauthURL>
              </error>`;
    }).then(function(raw) {
      return Ember.$.parseXML(raw);
    }).catch(function(error) {
      Logger.error('XML parsing error: ', error);
    });
  },

  'delete': function(path) {
    return fetch(path, {
      method: 'DELETE'
    });
  },

  mkcol: function(path) {
    return fetch(path, {
      method: 'MKCOL'
    }).catch(function(err) {
      Logger.error(err);
    });
  }
};
