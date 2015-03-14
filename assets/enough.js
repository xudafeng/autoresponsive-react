/* ================================================================
 * enough by xdf(xudafeng[at]126.com)
 *
 * first created at : Mon Nov 03 2014 19:45:18 GMT+0800 (CST)
 *
 * ================================================================
 * Copyright  xdf
 *
 * Licensed under the MIT License
 * You may not use this file except in compliance with the License.
 *
 * ================================================================ */

;(function() {
  'use strict';

  var _guid = 0;
  var slice = Array.prototype.slice;

  var _ = {
    create: function(o) {
      if (Object.create) {
        return Object.create(o);
      } else {
        var F = function() {};
        F.prototype = o;
        return new F();
      }
    },
    slice: slice,
    guid: function() {
      return _guid++;
    },
    inherit: function(sub, sup) {
      var swap = sub.prototype;
      sub.prototype = this.create(sup.prototype);
      this.augment(sub, swap);
      sub.prototype.constructor = sub;
      sub.sup = sup;
    },
    augment: function(r, s) {
      this.merge(r.prototype, s);
      return r;
    },
    merge: function(r, s) {
      this.each(s, function(v, k) {
        r[k] = v;
      });
      return r;
    },
    each: function(obj, fn) {
      for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
          fn.call(this, obj[i], i);
        }
      }
      return obj;
    },
    extend: function() {
      var that = this;
      var args = slice.call(arguments);
      var r = args.shift();
      this.each(args, function(s) {
        that.merge(r, s);
      });
      return r;
    },
    trim: function(str) {
      return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }
  };

  function Klass(obj) {

    function Constructor() {

      if (!(this instanceof Constructor)) {
        throw new Error('Please use keyword: new, when initial a class.');
      }

      this._guid = _.guid();
      _dataHash[this._guid] = {};
      _eventHandleHash[this._guid] = {};

      // inherit
      Constructor.sup.call(this);

      // custom constructor
      var constructor = obj.hasOwnProperty('constructor') ? obj.constructor : function() {};

      constructor.apply(this, arguments);
    }

    var sup = obj.sup;

    _.extend(sup.prototype, Events, Data, {
      extend: function() {
        var that = this;
        _.each(slice.call(arguments), function(v) {
          _.merge(that, v);
        });
        return that;
      }
    });

    _.inherit(Constructor, sup);

    _.extend(Constructor, {
      extend: function() {
        return _.extend(this, arguments);
      },
      parent: sup.prototype,
      augment: function() {
        var proto = this.prototype;
        _.each(slice.call(arguments), function(v) {
          _.merge(proto, v);
        });
        return proto;
      },
      Klass: function(obj) {
        obj = obj || {};
        obj.sup = this;
        return Klass(obj);
      }
    });

    _.each(obj, function(v, k) {
      if (obj.hasOwnProperty(k) && k !== 'constructor') {
        Constructor.prototype[k] = v;
      }
    });
    return Constructor;
  }
  /**
   * custom event
   */
  var _eventHandleHash = {};

  var _bindSingleEvent = function(id, handle) {
    if (!_eventHandleHash[this._guid][id]) {
      _eventHandleHash[this._guid][id] = [];
    }
    _eventHandleHash[this._guid][id].push({
      id: this._guid,
      handle: handle,
      type: id
    });
  }

  var _bindEvent = function(map, handle) {
    var that = this;
    if (typeof map === 'string') {
      _bindSingleEvent.call(this, map, handle);
    } else {
      _.each(map, function(handle, id) {
        _bindSingleEvent.call(that, id, handle);
      });
    }
  }

  var _unbindEvent = function(id) {
    if (id) {
      delete _eventHandleHash[this._guid][id];
    } else {
      _eventHandleHash[this._guid] = [];
    }
  }

  var _triggerEvent = function(id, data) {
    var _eventLoop = _eventHandleHash[this._guid][id];

    if (!_eventLoop) return;
    var that = this;

    _.each(_eventLoop, function(e) {
      e.handle.call(that, data, e.type);
    });
  }

  var Events = {
    on: function(map, handle) {
      _bindEvent.call(this, map, handle);
      return this;
    },
    detach: function(id) {
      _unbindEvent.call(this, id);
      return this;
    },
    emit: function(id, data) {
      _triggerEvent.call(this, id, data);
      return this;
    }
  };

  var _dataHash = {};

  var Data = {
    get: function(k) {
      return this.has(k) ? _dataHash[this._guid][k] : null;
    },
    set: function(k, v) {
      var that = this;
      if (typeof k === 'object') {
        _.each(k, function(v, k) {
          var oldValue = _dataHash[that._guid][k];
          if (oldValue === v) return;
          _dataHash[that._guid][k] = v;
          that.emit('change:' + k, v);
          that.emit('change', v);
        });
      } else {
        var oldValue = _dataHash[that._guid][k];
        if (oldValue === v) return;
        _dataHash[that._guid][k] = v;
        that.emit('change:' + k, v);
        that.emit('change', v);
      }
      return this;
    },
    has: function(k) {
      return typeof _dataHash[this._guid][k] !== 'undefined';
    },
    remove: function(id) {
      var that = this;
      if (typeof id === 'function') {
        _.each(_dataHash[this._guid], function(v, k) {
          if (!id(v)) return;
          delete _dataHash[that._guid][k];
          that.emit('change:' + k);
          that.emit('change');
        });
        return this;
      }
      if (typeof id === 'undefined') {
        _dataHash[this._guid] = {};
      } else {
        if (this.has(id)) delete _dataHash[this._guid][id];
      }
      that.emit('change:' + id);
      this.emit('change');
      return this;
    },
    getAll: function() {
      return _dataHash[this._guid];
    },
    getAllAsArray: function() {
      var arr = [];
      var map = _dataHash[this._guid];
      _.each(map, function(v) {
        arr.push(v);
      })
      return arr;
    },
    size: function() {
      return this.getAllAsArray().length;
    },
    update: function(k, fn) {
      var that = this;
      if (typeof k === 'function') {
        _.each(_dataHash[this._guid], function(v, _k) {
          k(v);
          that.emit('change:' + _k, v);
        });
        this.emit('change');
        return;
      }
      var v = this.get(k);
      var clone = v;
      if (clone.constructor === Array) {
        clone = v.slice(0);
      } else if (typeof clone === 'object') {
        clone = _.extend({}, v);
      }
      if (v) this.set(k, fn(clone));
      return this;
    },
    filter : function(fn) {
      var items = [];
      _.each(_dataHash[this._guid], function(v) {
        if (fn(v)) items.push(v);
      });
      return items;
    }
  };

  var Enough = {
    _ : _,
    Klass: function(obj) {
      obj = obj || {};
      obj.sup = function() {};
      return Klass(obj);
    },
    _cache: {
      events: _eventHandleHash,
      data: _dataHash
    }
  };

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = Enough;
    }
    exports.Enough = Enough;
  } else if (typeof define === 'function' && define.amd) {
    define(function() {
      return Enough;
    });
  } else {
    window.Enough = Enough;
  }
})();
/* vim: set sw=2 ts=2 et tw=80 : */
