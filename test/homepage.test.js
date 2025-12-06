'use strict';

const path = require('path');
const Promise = require('bluebird');
const { webpackHelper } = require('macaca-wd');

const {
  driver,
  BASE_URL
} = webpackHelper;

const TEST_TIMEOUT = 20000;

describe('./test/homepage.test.js', function () {
  describe('page func testing', function () {
    before(function () {
      this.timeout(TEST_TIMEOUT);
      return driver
        .initWindow({
          platformName: 'playwright',
          browserName: 'chromium',
          width: 375,
          height: 667,
          deviceScaleFactor: 2,
          recordVideo: {
            dir: path.resolve(__dirname, '..', 'reports', 'screenshots'),
          },
        });
    });

    beforeEach(function () {
      this.timeout(TEST_TIMEOUT);
      return driver
        .getUrl(BASE_URL);
    });

    afterEach(function () {
      this.timeout(TEST_TIMEOUT);
      return driver
        .coverage()
        .saveVideos(this)
        .saveScreenshots(this);
    });

    after(function () {
      this.timeout(TEST_TIMEOUT);
      return driver
        .openReporter(true)
        .quit();
    });

    it('panel should be ok', function () {
      this.timeout(TEST_TIMEOUT);
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

    it('resize should be ok', function () {
      this.timeout(TEST_TIMEOUT);
      return driver
        .setWindowSize(800, 600);
    });

    it('hash should be ok', function () {
      this.timeout(TEST_TIMEOUT);
      return driver
        .elementById('examples')
        .click()
        .sleep(500);
    });

    it('hash redirect should be ok', function () {
      this.timeout(TEST_TIMEOUT);
      return driver
        .getUrl(`${BASE_URL}/#usage`)
        .sleep(1000);
    });
  });
});
