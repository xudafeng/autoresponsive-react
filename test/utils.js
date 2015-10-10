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

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

function render(node) {
  return TestUtils.renderIntoDocument(node);
}

function findWithClass(root, cls) {
  return TestUtils.findRenderedDOMComponentWithClass(root, cls);
}

function tryWithClass(root, cls) {
  return TestUtils.scryRenderedDOMComponentsWithClass(root, cls);
}

exports.render = render;
exports.findWithClass = findWithClass;
exports.tryWithClass = tryWithClass;
