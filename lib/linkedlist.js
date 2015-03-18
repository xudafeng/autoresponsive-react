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

let Util = require('./util');

class LinkedList {
  constructor(cfg) {
    this.length = 0;
    this.head = null;
    this.tail = null;
    this.type = cfg.type || true;
    this.query = [];
    this.init();
  }

  init() {
  }

  add(value) {
    if (this.type) {
      this.query.push(value);
      return;
    }
    let node = {
      value: value,
      next: null,
      prev: null
    };
    if (this.length === 0) {
      this.head = this.tail = node;
    } else {
      this.tail.next = node;
      node.prev = this.tail;
      this.tail = node;
    }
    this.length++;
  }

  remove(index) {
    if (index > this.length - 1 || index < 0) {
      return null;
    }
    let node = this.head,
        i = 0;
    if (index === 0) {
      this.head = node.next;
      if (this.head == null) {
        this.tail = null;
      } else {
        this.head.previous = null;
      }
    } else if (index === this.length - 1) {
      node = this.tail;
      this.tail = node.prev;
      this.tail.next = null;
    } else {
      while (i++ < index) {
        node = node.next;
      }
      node.prev.next = node.next;
      node.next.prev = node.prev;
    }
    this.length--;
  }

  get(index) {
    if (this.type) {
      return this.query[index];
    }
    return this.node(index).value;
  }

  node(index) {
    if (index > this.length - 1 || index < 0) {
      return null;
    }
    let node = this.head,
        i = 0;
    while (i++ < index) {
      node = node.next;
    }
    return node;
  }

  update(index, value) {
    if (this.type) {
      this.query[index] = value;
      return;
    }
    this.node(index).value = value;
  }

  size(){
    return this.query.length || this.length;
  }
}

module.exports = LinkedList;
