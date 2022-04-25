'use strict';

const Promise = require('bluebird');

const { webpackHelper } = require('macaca-wd');

const {
  driver,
  BASE_URL
} = webpackHelper;

describe('./test/homepage.test.js', () => {
  describe('page func testing', () => {
    before(() => {
      return driver
        .initWindow({
          platformName: 'playwright',
          browserName: 'chromium',
          width: 375,
          height: 667,
          deviceScaleFactor: 2,
        });
    });

    beforeEach(() => {
      return driver
        .getUrl(BASE_URL);
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

    it('panel should be ok', () => {
      const elementGroup = `#simplest .btn-group`;
      const elementButton = `${elementGroup} button`;
      const elementRect = `document.querySelector('${elementGroup}').getClientRects()`;
      const height = `${elementRect}[0].y || ${elementRect}[0].top`;
      return driver
        .execute(`window.scrollTo(0, ${height})`)
        .elementsByCss(elementButton)
        .then(list => {
          const queue = list.map((item, key) => `${elementButton}:nth-child(${key + 1})`);
          return Promise.reduce([null].concat(queue), (i, selector) => {
            return driver
              .elementByCss(selector)
              .click();
          });
        });
    });

    it('resize should be ok', () => {
      return driver
        .setWindowSize(800, 600);
    });

    it('hash should be ok', () => {
      return driver
        .elementById('examples')
        .click()
        .sleep(500);
    });

    it('hash redirect should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/#usage`)
        .sleep(1000);
    });
  });
});
