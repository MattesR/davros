import Ember from 'ember';

const { Service, computed } = Ember;
const STORAGE_ITEM = 'session';

class LocalStorage {
  constructor(item) {
    this.item = item;
    this.load();
  }

  load() {
    let data = window.localStorage.getItem(this.item);

    try {
      this.data = JSON.parse(data) || {};
    } catch (e) {
      logger.error(`Invalid JSON session data: "${data}" (error: ${e})`);
      this.data = {};
    }
  }

  store() {
    window.localStorage.setItem(this.item, JSON.stringify(this.data));
  }

  delete() {
    window.localStorage.removeItem(this.item);
  }
}

export default Ember.Service.extend({
  token: attr(),
  timeFormat: attr(),
  userFilter: attr()
});

function attr() {
  return computed({
    get(key) {
      return new LocalStorage(STORAGE_ITEM).data[key];
    },

    set(key, value) {
      let session = new LocalStorage(STORAGE_ITEM);

      session.data[key] = value;
      session.store();

      return value;
    }
  });
}
