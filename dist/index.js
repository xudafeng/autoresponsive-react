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

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var Common = require('autoresponsive-common');

var Util = Common.Util;
var GridSort = Common.GridSort;

var AnimationManager = require('./animation');

var noop = function noop() {};

var AutoResponsive = (function (_React$Component) {
  _inherits(AutoResponsive, _React$Component);

  function AutoResponsive(props) {
    _classCallCheck(this, AutoResponsive);

    _get(Object.getPrototypeOf(AutoResponsive.prototype), 'constructor', this).call(this, props);
    this.state = {};
  }

  _createClass(AutoResponsive, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.sortManager = new GridSort({
        containerWidth: this.props.containerWidth,
        gridWidth: this.props.gridWidth
      });

      this.animationManager = new AnimationManager();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {

      if (this.props.containerWidth !== nextProps.containerWidth) {
        this.sortManager.changeProps({
          containerWidth: nextProps.containerWidth
        });
      }
    }
  }, {
    key: 'setPrivateProps',
    value: function setPrivateProps() {
      this.containerStyle = {
        position: 'relative',
        height: this.containerHeight || 0
      };

      if (typeof this.props.containerHeight === 'number') {
        this.fixedContainerHeight = true;
        this.containerStyle.height = this.props.containerHeight;
      } else {
        this.fixedContainerHeight = false;
      }
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate() {
      this.sortManager.init();
    }
  }, {
    key: 'renderChildren',
    value: function renderChildren() {
      var _this = this;

      return React.Children.map(this.props.children, function (child, childIndex) {

        if (child.props.className && _this.props.itemClassName && ! ~child.props.className.indexOf(_this.props.itemClassName)) {
          return;
        }

        var childWidth = parseInt(child.props.style.width, 10) + _this.props.itemMargin;
        var childHeight = parseInt(child.props.style.height, 10) + _this.props.itemMargin;

        var calculatedPosition = _this.sortManager.getPosition(childWidth, childHeight, _this.containerStyle.height);

        if (!_this.fixedContainerHeight && _this.props.containerWidth) {

          if (calculatedPosition[1] + childHeight > _this.containerStyle.height) {
            _this.containerStyle.height = calculatedPosition[1] + childHeight;
          }
        }

        var calculatedStyle = _this.animationManager.generate(Util.extend({}, _this.props, {
          position: calculatedPosition,
          size: {
            width: childWidth,
            height: childHeight
          },
          containerHeight: _this.containerStyle.height
        }));

        _this.mixItemInlineStyle(calculatedStyle);

        _this.props.onItemDidLayout.call(_this, child);

        if (childIndex + 1 === _this.props.children.length) {
          _this.props.onContainerDidLayout.call(_this);
        }

        return React.cloneElement(child, {
          style: Util.extend({}, child.props.style, calculatedStyle)
        });
      });
    }
  }, {
    key: 'mixItemInlineStyle',
    value: function mixItemInlineStyle(s) {
      var itemMargin = this.props.itemMargin;
      var style = {
        display: 'block',
        float: 'left',
        margin: '0 ' + itemMargin + 'px ' + itemMargin + 'px 0 '
      };

      if (this.props.containerWidth) {
        style = {
          position: 'absolute',
          overflow: 'hidden'
        };
      }
      Util.merge(s, style);
    }
  }, {
    key: 'getContainerStyle',
    value: function getContainerStyle() {
      return this.containerStyle;
    }
  }, {
    key: 'render',
    value: function render() {
      this.setPrivateProps();

      return React.createElement(
        'div',
        { ref: 'container', className: this.props.prefixClassName + '-container', style: this.getContainerStyle() },
        this.renderChildren()
      );
    }
  }]);

  return AutoResponsive;
})(React.Component);

AutoResponsive.defaultProps = {
  containerWidth: null,
  containerHeight: null,
  gridWidth: 10,
  prefixClassName: 'rc-autoresponsive',
  itemClassName: 'item',
  itemMargin: 0,
  horizontalDirection: 'left',
  transitionDuration: 1,
  transitionTimingFunction: 'linear',
  verticalDirection: 'top',
  closeAnimation: false,
  onItemDidLayout: noop,
  onContainerDidLayout: noop
};

module.exports = AutoResponsive;