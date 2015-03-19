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
let LinkedList = require('./linkedlist');

class GridSortManagere {
  constructor(props, privateProps) {
    this.props = props;
    this.privateProps = privateProps;
    this.init();
  }

  init() {
    let curQuery = new LinkedList({});
    let span = Math.ceil(this.props.containerWidth / this.props.gridWidth);

    for (let i = 0; i < span; i++) {
      curQuery.add(0);
    }

    this.curQuery = curQuery;
  }

  getPosition(width, height) {
    let num = Math.ceil(width / this.props.gridWidth);
    let cur = this.getCurrentPointer(num);

    for (let i = cur[0], len = num + cur[0], newH = cur[1] + height; i < len; i++) {
      this.curQuery.update(i, newH);
    }
    return [cur[0] * this.props.gridWidth, cur[1]];
  }

  getCurrentPointer(num) {
    let min = Infinity;
    let idx = 0;
    let len = this.curQuery.size();

    for (let i = 0; i <= (len < num ? 0 : len - num); i++) {
      let max = -Infinity;
      let curValue;

      for (let j = 0; j < num; j++) {
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
}

module.exports = GridSortManagere;
