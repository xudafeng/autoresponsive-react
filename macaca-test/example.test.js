const wd = require('macaca-wd');

describe('macaca desktop sample', function() {
  this.timeout(5 * 60 * 1000);

  var driver = wd.promiseChainRemote({
    host: 'localhost',
    port: process.env.MACACA_SERVER_PORT || 3456
  });

  const initialURL = 'http://localhost:4567/examples';

  before(() => {
    return driver
      .init({
        platformName: 'desktop',
        browserName: 'electron'
      })
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
