import Ember from 'ember';
import fetch from 'ember-network/fetch';
import provider from 'davros/torii-providers/liquid';

const { RSVP, inject, isEmpty } = Ember;

export default Ember.Object.extend({
  localStorage: inject.service(),
  session: inject.service(),

  // The authorization argument passed in to `session.open` here is
  // the result of the `torii.open(providerName)` promise
  open: function(authorization){
    // let authUrl = new provider().get('baseUrl').replace('authorize', 'introspect/');

    this.set('localStorage.token', authorization.authorizationCode);

    return RSVP.resolve();
    // return fetch(authUrl, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(authorization)
    // }).then((response) => {
    //   return response.json();
    // }).then((data) => {
    //   console.log('ajax', data);
    //   let token = data.accessToken;
    //   this.set('storage.token', token);
    //   return { token };
    // }).catch((err) => {
    //   this.set('error', err);
    // });
  },

  close() {
    this.set('localStorage.token', null);
    return RSVP.resolve();
  },

  fetch() {
    let token = this.get('localStorage.token');
    if (isEmpty(token)) {
      console.error('No token in storage');
      throw new Error('No token in storage');
    }
    return RSVP.resolve({ token });
  },
});
