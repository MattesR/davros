import Ember from 'ember';

export default Ember.Controller.extend({
  permissions: Ember.inject.service(),
  session: Ember.inject.service(),

  canEdit: function() {
    return this.get('permissions').can('edit');
  }.property('permissions.list'),

  canSync: function() {
    return this.get('permissions').can('edit');
  }.property('permissions.list'),

  actions: {
    signIn() {
      let _this = this;
      this.set('signingIn', true);

      Ember.$('#signin-modal-back').one('click', function(){
        _this.set('signingIn', false);
      });
      this.get('session')
        .open('liquid')
        .then(function(data){
          _this.set('signingIn', false);
          _this.set('authenticated', true);
        }, function(error){
          _this.set('error', `Could not sign you in: ${error.message}`);
        });
    }
  }
});
