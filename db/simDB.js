'use strict';

// Simple In-Memory Database (async-callback version)
const DELAY = 100;
const { promisify } = require('util');

const simDB = {

  // Synchronous Initialize
  initialize: function(data) {
    this.nextVal = 1000;
    this.data = data.map(item => {
      item.id = this.nextVal++;
      return item;
    });
    return this;
  },

  // Asynchronous CRUD operations
  create: function (newItem, callback) {
    setTimeout(() => {
      try {
        newItem.id = this.nextVal++;
        this.data.push(newItem);
        callback(null, newItem);
      } catch (err) {
        callback(err);
      }
    }, DELAY);
  },

  filter: function (term, callback) {
    setTimeout(() => {
      try {
        let list = term ? this.data.filter(item => item.title.includes(term)) : this.data;
        callback(null, list);
      } catch (err) {
        callback(err);
      }
    }, DELAY);
  },

  find: function (id, callback) {
    setTimeout(() => {
      try {
        id = Number(id);
        let item = this.data.find(item => item.id === id);
        callback(null, item);
      } catch (err) {
        callback(err);
      }
    }, DELAY);
  },

  replace: function (id, replaceItem, callback) {
    setTimeout(() => {
      try {
        id = Number(id);
        const index = this.data.findIndex(item => item.id === id);
        if (index === -1) {
          return callback(null, null);
        }
        replaceItem.id = id;
        this.data.splice(index, 1, replaceItem);
        callback(null, replaceItem);
      } catch (err) {
        callback(err);
      }
    });
  },

  update: function (id, updateItem, callback) {
    setTimeout(() => {
      try {
        id = Number(id);
        let item = this.data.find(item => item.id === id);
        if (!item) {
          return callback(null, null);
        }
        Object.assign(item, updateItem);
        callback(null, item);
      } catch (err) {
        callback(err);
      }
    }, DELAY);
  },

  delete: function (id, callback) {
    setTimeout(() => {
      try {
        id = Number(id);
        const index = this.data.findIndex(item => item.id === id);
        if (index === -1) {
          return callback(null, null);
        } else {
          const len = this.data.splice(index, 1).length;
          return callback(null, len);
        }
      } catch (err) {
        callback(err);
      }
    }, DELAY);
  }

};

module.exports = Object.create({
  initialize: simDB.initialize,
  create: promisify(simDB.create),
  filter: promisify(simDB.filter),
  find: promisify(simDB.find),
  update: promisify(simDB.update),
  delete: promisify(simDB.delete)
});
