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

exports.merge = function(r, s) {
  this.each(s, function(v, k) {
    r[k] = v;
  });
  return r;
};

exports.each = function(obj, fn) {
  for (let i in obj) {
    if (obj.hasOwnProperty(i)) {
      fn.call(this, obj[i], i);
    }
  }
  return obj;
};

exports.extend = function() {
  let args = Array.prototype.slice.call(arguments);
  let object = args.shift();

  for (let i = 0, l = args.length; i < l; i++) {
    let props = args[i];

    for (let key in props) {
      object[key] = props[key];
    }
  }
  return object;
};
