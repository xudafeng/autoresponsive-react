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

const React = require('react/addons');
const TestUtils = React.addons.TestUtils;

function render(node) {
  return TestUtils.renderIntoDocument(node);
}

function findWithClass(root, cls) {
  return TestUtils.findRenderedDOMComponentWithClass(root, cls);
}

function tryWithClass(root, cls) {
  return TestUtils.scryRenderedDOMComponentsWithClass(root, cls);
}

module.exports = TestUtils;
module.exports.render = render;
module.exports.findWithClass = findWithClass;
module.exports.tryWithClass = tryWithClass;
module.exports.renderer = TestUtils.createRenderer;

if (typeof document === 'undefined') {
  const jsdom = require('jsdom').jsdom;
  global.document = jsdom('<!doctype html><html><body></body></html>');
  global.window = document.parentWindow;
  global.navigator = {
    userAgent: ''
  };
}
