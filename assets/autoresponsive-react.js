/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

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

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

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

	var React = __webpack_require__(2);
	var Util = __webpack_require__(3);
	var GridSortManager = __webpack_require__(4);
	var AnimationManager = __webpack_require__(5);

	var noop = function() {};

	var defaultConfigurationObject = {
	  containerWidth: 1024,
	  containerHeight: 'auto',
	  gridWidth: 10,
	  prefixClassName: 'rc-autoresponsive',
	  itemSelector: 'rc-autoresponsive-item',
	  itemMargin: 0,
	  horizontalDirection: 'left',
	  verticalDirection: 'top',
	  amimationType: 'transform',
	  onLayoutDidComplete: noop
	};

	var defaultContainerStyle = {
	  position: 'relative'
	};

	var AutoResponsive = React.createClass({displayName: "AutoResponsive",
	  getDefaultProps: function() {
	    return defaultConfigurationObject;
	  },
	  setPrivateProps: function() {
	    this.privateProps = {
	      autoSetContainerHeight: false,
	      containerHeight: 0,
	      containerStyle: defaultContainerStyle
	    };

	    if (this.props.containerHeight === 'auto') {
	      this.privateProps.autoSetContainerHeight = true;
	    } else {
	      this.privateProps.containerStyle.height = this.props.containerHeight;
	    }

	    if (this.props.verticalDirection === 'bottom') {
	      this.privateProps.autoSetContainerHeight = false;

	      if (typeof this.props.containerHeight !== 'number') {
	        this.privateProps.containerStyle.height = 800;
	      } else {
	        this.privateProps.containerStyle.height = this.props.containerHeight;
	      }
	    }
	  },
	  detect: function() {
	  },
	  initGridSortManager: function() {
	    this.sortInstance = new GridSortManager(this.props, this.privateProps);
	  },
	  selectorFilter: function() {
	    console.log(123)
	  },
	  renderChildrenGrids: function() {
	    this.initGridSortManager();

	    return React.Children.map(this.props.children, function(child, childIndex) {
	      var itemWidth = parseInt(child.props.style.width) + this.props.itemMargin;
	      var itemHeight = parseInt(child.props.style.height) + this.props.itemMargin;
	      var calculatedPositionObject = this.sortInstance.getPosition(itemWidth, itemHeight);

	      if (this.privateProps.autoSetContainerHeight) {

	        if (calculatedPositionObject[1] + itemHeight > this.privateProps.containerHeight) {
	          this.privateProps.containerHeight = calculatedPositionObject[1] + itemHeight;
	        }

	        if (childIndex + 1 === this.props.children.length) {
	          this.privateProps.containerStyle.height = this.privateProps.containerHeight;
	        }
	      }

	      var calculatedStyle = new AnimationManager(this.props, this.privateProps).init({
	        position: 'absolute',
	        overflow: 'hidden'
	      }, calculatedPositionObject, {
	        width: itemWidth,
	        height: itemHeight
	      });

	      this.props.onLayoutDidComplete(child);

	      return React.addons.cloneWithProps(child, {
	        style: Util.merge(child.props.style, calculatedStyle)
	      });
	    }, this);
	  },
	  render: function() {
	    var that = this;
	    this.setPrivateProps();
	    this.detect();//
	    return (
	      React.createElement("div", React.__spread({className: this.props.prefixClassName},  this.props, {style: this.privateProps.containerStyle}), 
	      this.renderChildrenGrids()
	      )
	    );
	  }
	});

	if (typeof window === 'undefined') {
	  module.exports = AutoResponsive;
	} else {
	  window.AutoResponsive = AutoResponsive;
	}


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = React;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

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

	var Util = {
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
	  }
	};

	module.exports = Util;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

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

	var Util = __webpack_require__(3);
	var LinkedList = __webpack_require__(6);

	function GridSortManager(props, privateProps) {
	  this.props = props;
	  this.privateProps = privateProps;
	  this.curQuery = null;
	  this.init();
	}

	var proto = {
	  init: function() {
	    this.getColumn();
	  },
	  getColumn: function() {
	    var curQuery = new LinkedList({});
	    var span = Math.ceil(this.props.containerWidth / this.props.gridWidth);

	    for (var i = 0; i < span; i++) {
	      curQuery.add(0);
	    }
	    this.curQuery = curQuery;
	  },
	  getPosition: function(width, height) {
	    var num = Math.ceil(width / this.props.gridWidth);
	    var cur = this.getCurrentPointer(num);

	    for (var i = cur[0], len = num + cur[0], newH = cur[1] + height; i < len; i++) {
	      this.curQuery.update(i, newH);
	    }
	    return [cur[0] * this.props.gridWidth, cur[1]];
	  },
	  getCurrentPointer: function(num) {
	    var min = Infinity;
	    var idx = 0;
	    var len = this.curQuery.size();

	    for (var i = 0; i <= (len < num ? 0 : len - num); i++) {
	      var max = -Infinity;
	      var curValue;

	      for (var j = 0; j < num; j++) {
	        curValue = this.curQuery.get(i + j);
	        if (curValue >= min) {
	          i += j + 1; // jump back
	          if (i > len - num) {//get the edge
	            max = min;
	            break;
	          }
	          j = -1; // reset
	          max = -Infinity;
	          continue;
	        }
	        if (curValue > max) {
	          max = curValue;
	        }
	      }
	      if (min > max) {
	        min = max;
	        idx = i; // save index
	      }
	    }
	    return [idx, min];
	  }
	};

	Util.merge(GridSortManager.prototype, proto);

	module.exports = GridSortManager;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

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

	var Util = __webpack_require__(3);

	var prefixes = ['-webkit-', '-moz-', '-ms-', '-o-', ''];

	function AnimationManager(props, privateProps) {
	  this.props = props;
	  this.privateProps = privateProps;
	  this.style = null;
	  this.type = null;
	}

	var proto = {
	  init: function(style, positionObject, itemSize) {
	    this.style = style;
	    this.positionObject = positionObject;
	    this.itemSize = itemSize;
	    return this.css3Animation();
	  },
	  css2Animation: function() {
	    this.style[this.props.horizontalDirection] = this.positionObject[0] + 'px';
	    this.style[this.props.verticalDirection] = this.positionObject[1] + 'px';
	    return this.style;
	  },
	  css3Animation: function() {
	    prefixes.map(function(prefix) {
	      var x, y;

	      if (this.props.horizontalDirection === 'right') {
	        x = this.props.containerWidth - this.itemSize.width - this.positionObject[0];
	      } else {
	        x = this.positionObject[0];
	      }

	      if (this.props.verticalDirection === 'bottom') {
	        y = this.privateProps.containerStyle.height - this.positionObject[1];
	      } else {
	        y = this.positionObject[1];
	      }

	      this.style[prefix + 'transform'] = 'translate(' + x + 'px, ' + y + 'px)';
	     // this.style[prefix + 'transition-duration'] = '3s';
	    }, this);
	    return this.style;
	  },
	  noneAnimation: function() {
	    this.style[this.props.horizontalDirection || 'left'] = this.positionObject[0] + 'px';
	    this.style[this.props.verticalDirection || 'top'] = this.positionObject[1] + 'px';
	    return this.style;
	  }
	};

	Util.merge(AnimationManager.prototype, proto);

	module.exports = AnimationManager;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

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

	var Util = __webpack_require__(3);

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


/***/ }
/******/ ]);