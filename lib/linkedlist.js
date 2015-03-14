/* ================================================================
 * autoresponsive-react by xdf(xudafeng[at]126.com)
 *
 * first created at : Mon Jun 02 2014 20:15:51 GMT+0800 (CST)
 *
 * ================================================================
 * Copyright 2014 xdf
 *
 * Licensed under the MIT License
 * You may not use this file except in compliance with the License.
 *
 * ================================================================ */

'use strict';

var Util = require('./util');

function LinkedList(cfg) {
  var that = this;
  that.length = 0;
  that.head = null;
  that.tail = null;
  that.type = cfg.type || true;
  that.query = [];
  that.init();
}

var proto = {
  init: function() {
  },
  add: function(value) {
    var that = this;
    if (that.type) {
      that.query.push(value);
      return;
    }
    var node = {
      value: value,
      next: null,
      prev: null
    };
    if (that.length === 0) {
      that.head = that.tail = node;
    } else {
      that.tail.next = node;
      node.prev = that.tail;
      that.tail = node;
    }
    that.length++;
  },
  remove: function(index) {
    var that = this;
    if (index > that.length - 1 || index < 0) {
      return null;
    }
    var node = that.head,
        i = 0;
    if (index === 0) {
      that.head = node.next;
      if (that.head == null) {
        that.tail = null;
      }
      else {
        that.head.previous = null;
      }
    } else if (index === that.length - 1) {
      node = that.tail;
      that.tail = node.prev;
      that.tail.next = null;
    } else {
      while (i++ < index) {
        node = node.next;
      }
      node.prev.next = node.next;
      node.next.prev = node.prev;
    }
    that.length--;
  },
  get: function(index) {
    var that = this;
    if (that.type) {
      return that.query[index];
    }
    return that.node(index).value;
  },
  node: function(index) {
    var that = this;
    if (index > that.length - 1 || index < 0) {
      return null;
    }
    var node = that.head,
        i = 0;
    while (i++ < index) {
      node = node.next;
    }
    return node;
  },
  update: function(index, value) {
    var that = this;
    if (that.type) {
      that.query[index] = value;
      return;
    }
    that.node(index).value = value;
  },
  size: function(){
    return this.query.length || this.length;
  }
};

Util.merge(LinkedList.prototype, proto);

module.exports = LinkedList;
