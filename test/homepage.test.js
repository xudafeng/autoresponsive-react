'use strict';

import Promise from 'bluebird';

import {
  driver,
  BASE_URL
} from './helper';

describe('test/homepage.test.js', () => {
  before(() => {
    return driver
      .initWindow({
        width: 375,
        height: 667,
        deviceScaleFactor: 2
      });
  });

  afterEach(function () {
    return driver
      .coverage()
      .saveScreenshots(this);
  });

  after(() => {
    return driver
      .openReporter(true)
      .quit();
  });

  it('page render should be ok', () => {
    return driver
      .get(BASE_URL);
  });

  it('panel should be ok', () => {
    const elementGroup = `#simplest .btn-group`;
    const elementButton = `${elementGroup} > button`;
    const elementRect = `document.querySelector('${elementGroup}').getClientRects()`;
    const height = `${elementRect}[0].y || ${elementRect}[0].top`;
    return driver
      .sleep(1500)
      .execute(`window.scrollTo(0, ${height})`)
      .elementsByCss(elementButton)
      .then(list => {
        const queue = list.map((item, key) => `${elementButton}:nth-child(${key + 1})`);
        return Promise.reduce(queue, (i, selector) => {
          return driver
            .elementByCss(selector)
            .click()
            .sleep(500)
            .click()
            .sleep(500);
        });
      });
  });

  it('waterfall should be ok', () => {
    const element = `#waterfall .rc-autoresponsive-container`;
    const elementRect = `document.querySelector('${element}').getClientRects()`;
    const height = `${elementRect}[0].y || ${elementRect}[0].top`;

    return driver
      .execute(`window.scrollTo(0, ${height})`)
      .sleep(500)
      .elementsByCss(`${element} .item`)
      .then(list => {
        const queue = list.map((item, key) => `${element} > .item:nth-child(${key + 1})`);
        return Promise.reduce(queue, (i, selector) => {
          return driver
            .elementByCss(selector)
            .click()
            .sleep(1000)
            .click();
        });
      });
  });

  it('i18n should be ok', () => {
    return driver
      .elementByCss('div.i18n-buttons > div > button:nth-child(2)')
      .click()
      .sleep(500);
  });
});
