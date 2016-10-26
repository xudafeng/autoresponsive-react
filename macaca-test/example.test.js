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

var wd = require('webdriver-client')({
  platformName: 'desktop',
  browserName: 'electron'
});

describe('macaca desktop sample', function() {
  this.timeout(5 * 60 * 1000);

  const driver = wd.initPromiseChain();
  const initialURL = 'http://localhost:4567/examples';

  before(() => {
    return driver
      .initDriver()
      .setWindowSize(1280, 800);
  });

  it('#0 should load success', function() {
    return driver
      .get(initialURL)
      .sleep(3000);
  });

  it('#1 should resize', function() {
    return driver
      .setWindowSize(800, 800)
      .sleep(3000);
  });

  after(() => {
    return driver
      .quit();
  });
});
