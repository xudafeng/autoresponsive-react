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

function transitionEnd() {
  let el = document.createElement('pin');
  let transitionEndEventNames = {
    WebkitTransition: 'webkitTransitionEnd',
    MozTransition: 'transitionend',
    OTransition: 'oTransitionEnd otransitionend',
    transition: 'transitionend'
  };

  for (let name in transitionEndEventNames) {
    if (el.style[name] !== undefined) {
      return transitionEndEventNames[name];
    }
  }
  return false;
}

let ifHasTransitionEnd = transitionEnd();

const prefixes = ['Webkit', 'Moz', 'ms', 'O', ''];

let AnimationManager = {};

AnimationManager.init = function(props, privateProps, style, position, itemSize) {
  this.props = props;
  this.privateProps = privateProps;
  this.position = position;
  this.itemSize = itemSize;
  return this[`css${ifHasTransitionEnd ? 3 : 2}Animation`](style);
}

AnimationManager.css2Animation = function() {
  this.style[this.props.horizontalDirection] = this.position[0] + 'px';
  this.style[this.props.verticalDirection] = this.position[1] + 'px';
  return this.style;
}

AnimationManager.css3Animation = function(style) {
  prefixes.map(function(prefix) {
    let x, y;

    if (this.props.horizontalDirection === 'right') {
      x = this.props.containerWidth - this.itemSize.width - this.position[0];
    } else {
      x = this.position[0];
    }

    if (this.props.verticalDirection === 'bottom') {
      y = this.privateProps.containerStyle.height - this.position[1];
    } else {
      y = this.position[1];
    }

    style[`${prefix}Transform`] = `translate3d(${x}px, ${y}px, 0)`;

    if (!this.props.closeAnimation) {
      style[`${prefix}TransitionDuration`] = `${this.props.transitionDuration}s`;
      style[`${prefix}TransitionTimingFunction`] = this.props.transitionTimingFunction;
    }
  }, this);

  return style;
};

module.exports = AnimationManager;
