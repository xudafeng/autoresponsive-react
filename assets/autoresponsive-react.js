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

	var AutoResponsive = __webpack_require__(1);

	if (typeof window === 'undefined') {
	  module.exports = AutoResponsive;
	} else {
	  window.AutoResponsive = AutoResponsive;
	}


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

	var ____Class0=React.Component;for(var ____Class0____Key in ____Class0){if(____Class0.hasOwnProperty(____Class0____Key)){AutoResponsive[____Class0____Key]=____Class0[____Class0____Key];}}var ____SuperProtoOf____Class0=____Class0===null?null:____Class0.prototype;AutoResponsive.prototype=Object.create(____SuperProtoOf____Class0);AutoResponsive.prototype.constructor=AutoResponsive;AutoResponsive.__superConstructor__=____Class0;
	  function AutoResponsive(props) {
	    ____Class0.call(this,props);
	    this.state = {
	      data: {
	        children: []
	      }
	    };
	  }

	  Object.defineProperty(AutoResponsive.prototype,"setPrivateProps",{writable:true,configurable:true,value:function() {
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
	  }});

	  Object.defineProperty(AutoResponsive.prototype,"initGridSortManager",{writable:true,configurable:true,value:function() {
	    this.sortInstance = new GridSortManager(this.props, this.privateProps);
	  }});

	  Object.defineProperty(AutoResponsive.prototype,"renderChildrenGrids",{writable:true,configurable:true,value:function() {
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
	  }});

	  Object.defineProperty(AutoResponsive.prototype,"render",{writable:true,configurable:true,value:function() {
	    var that = this;
	    this.setPrivateProps();
	    return (
	      React.createElement("div", React.__spread({className: this.props.prefixClassName},  this.props, {style: this.privateProps.containerStyle}), 
	      this.renderChildrenGrids()
	      )
	    );
	  }});



	AutoResponsive.defaultProps = defaultConfigurationObject;

	module.exports = AutoResponsive;


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


	  function GridSortManagere(props, privateProps) {
	    this.props = props;
	    this.privateProps = privateProps;
	    this.init();
	  }

	  Object.defineProperty(GridSortManagere.prototype,"init",{writable:true,configurable:true,value:function() {
	    var curQuery = new LinkedList({});
	    var span = Math.ceil(this.props.containerWidth / this.props.gridWidth);

	    for (var i = 0; i < span; i++) {
	      curQuery.add(0);
	    }
	    this.curQuery = curQuery;
	  }});

	  Object.defineProperty(GridSortManagere.prototype,"getPosition",{writable:true,configurable:true,value:function(width, height) {
	    var num = Math.ceil(width / this.props.gridWidth);
	    var cur = this.getCurrentPointer(num);

	    for (var i = cur[0], len = num + cur[0], newH = cur[1] + height; i < len; i++) {
	      this.curQuery.update(i, newH);
	    }
	    return [cur[0] * this.props.gridWidth, cur[1]];
	  }});

	  Object.defineProperty(GridSortManagere.prototype,"getCurrentPointer",{writable:true,configurable:true,value:function(num) {
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
	  }});


	module.exports = GridSortManagere;


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

	const prefixes = ['-webkit-', '-moz-', '-ms-', '-o-', ''];


	  function AnimationManager(props, privateProps) {
	    this.props = props;
	    this.privateProps = privateProps;
	  }

	  Object.defineProperty(AnimationManager.prototype,"init",{writable:true,configurable:true,value:function(style, positionObject, itemSize) {
	    this.style = style;
	    this.positionObject = positionObject;
	    this.itemSize = itemSize;
	    return this.css3Animation();
	  }});

	  Object.defineProperty(AnimationManager.prototype,"css2Animation",{writable:true,configurable:true,value:function() {
	    this.style[this.props.horizontalDirection] = this.positionObject[0] + 'px';
	    this.style[this.props.verticalDirection] = this.positionObject[1] + 'px';
	    return this.style;
	  }});

	  Object.defineProperty(AnimationManager.prototype,"css3Animation",{writable:true,configurable:true,value:function() {
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
	  }});

	  Object.defineProperty(AnimationManager.prototype,"noneAnimation",{writable:true,configurable:true,value:function() {
	    this.style[this.props.horizontalDirection || 'left'] = this.positionObject[0] + 'px';
	    this.style[this.props.verticalDirection || 'top'] = this.positionObject[1] + 'px';
	    return this.style;
	  }});


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
	    this.length = 0;
	    this.head = null;
	    this.tail = null;
	    this.type = cfg.type || true;
	    this.query = [];
	    this.init();
	  }

	  Object.defineProperty(LinkedList.prototype,"init",{writable:true,configurable:true,value:function() {
	  }});

	  Object.defineProperty(LinkedList.prototype,"add",{writable:true,configurable:true,value:function(value) {
	    if (this.type) {
	      this.query.push(value);
	      return;
	    }
	    var node = {
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
	  }});

	  Object.defineProperty(LinkedList.prototype,"remove",{writable:true,configurable:true,value:function(index) {
	    if (index > this.length - 1 || index < 0) {
	      return null;
	    }
	    var node = this.head,
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
	  }});

	  Object.defineProperty(LinkedList.prototype,"get",{writable:true,configurable:true,value:function(index) {
	    if (this.type) {
	      return this.query[index];
	    }
	    return this.node(index).value;
	  }});

	  Object.defineProperty(LinkedList.prototype,"node",{writable:true,configurable:true,value:function(index) {
	    if (index > this.length - 1 || index < 0) {
	      return null;
	    }
	    var node = this.head,
	        i = 0;
	    while (i++ < index) {
	      node = node.next;
	    }
	    return node;
	  }});

	  Object.defineProperty(LinkedList.prototype,"update",{writable:true,configurable:true,value:function(index, value) {
	    if (this.type) {
	      this.query[index] = value;
	      return;
	    }
	    this.node(index).value = value;
	  }});

	  Object.defineProperty(LinkedList.prototype,"size",{writable:true,configurable:true,value:function(){
	    return this.query.length || this.length;
	  }});


	module.exports = LinkedList;


/***/ }
/******/ ]);