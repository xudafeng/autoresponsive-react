'use strict';

const { webpackHelper } = require('macaca-wd');

const {
  driver,
  BASE_URL
} = webpackHelper;

describe('./test/example.test.js', () => {
  describe('page func testing', () => {
    before(() => {
      return driver
        .initWindow({
          platformName: 'playwright',
          browserName: 'chromium',
          width: 375,
          height: 667,
          deviceScaleFactor: 2
        });
    });

    beforeEach(() => {
      return driver
        .getUrl(`${BASE_URL}/examples`);
    });

    afterEach(function () {
      return driver
        .coverage()
        .saveScreenshots(this);
    });

    after(() => {
      return driver
        .openReporter(false)
        .quit();
    });

    it('page resize should be ok', () => {
      return driver
        .setWindowSize(800, 600)
        .sleep(1000);
    });
  });
});
