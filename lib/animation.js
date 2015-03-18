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

const prefixes = ['-webkit-', '-moz-', '-ms-', '-o-', ''];

class AnimationManager {
  constructor(props, privateProps) {
    this.props = props;
    this.privateProps = privateProps;
  }

  init(style, positionObject, itemSize) {
    this.style = style;
    this.positionObject = positionObject;
    this.itemSize = itemSize;
    return this.css3Animation();
  }

  css2Animation() {
    this.style[this.props.horizontalDirection] = this.positionObject[0] + 'px';
    this.style[this.props.verticalDirection] = this.positionObject[1] + 'px';
    return this.style;
  }

  css3Animation() {
    prefixes.map(function(prefix) {
      let x, y;

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
  }

  noneAnimation() {
    this.style[this.props.horizontalDirection || 'left'] = this.positionObject[0] + 'px';
    this.style[this.props.verticalDirection || 'top'] = this.positionObject[1] + 'px';
    return this.style;
  }
}

module.exports = AnimationManager;
