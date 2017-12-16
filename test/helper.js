'use strict';

import {
  opn,
  platform,
  isExistedFile,
  uuid,
  mkdir
} from 'xutil';
import path from 'path';
import wd from 'macaca-wd';
import {
  appendToContext
} from 'macaca-reporter';
import istanbul from 'macaca-istanbul';

const collector = new istanbul.Collector();

const cwd = process.cwd();

wd.addPromiseChainMethod('initWindow', function (options = {}) {
  const handle = () => {
    return this
      .init(Object.assign({
        platformName: 'desktop',
        browserName: 'electron',
        deviceScaleFactor: 2
      }, options))
      .setWindowSize(options.width, options.height);
  };

  if (platform.isOSX) {
    return handle();
  } else {
    const readyFile = path.join(cwd, '.ready');
    return new Promise(resolve => {
      const timeout = (port) => {
        setTimeout(() => {
          if (isExistedFile(readyFile)) {
            resolve(handle());
          } else {
            console.log('waiting for you');
            timeout(port);
          }
        }, 2000);
      };
      timeout(8080);
    });
  }
});

wd.addPromiseChainMethod('saveScreenshots', function (context) {
  const filepath = path.join(cwd, 'screenshots', `${uuid()}.png`);
  const reportspath = path.join(cwd, 'reports');
  mkdir(path.dirname(filepath));

  return this
    .saveScreenshot(filepath)
    .then(() => {
      appendToContext(context, `${path.relative(reportspath, filepath)}`);
    });
});

wd.addPromiseChainMethod('coverage', function (context) {
  const coverageHtml = path.join(cwd, 'coverage', 'index.html');
  return this
    .execute('return window.__macaca_coverage__')
    .then(__coverage__ => {
      if (!__coverage__) {
        return this
          .execute('return location.href')
          .then(url => {
            console.log(`>> coverage failed: ${url}`);
          });
      }
      const reporter = new istanbul.Reporter();
      collector.add(__coverage__);
      reporter.addAll([
        'html',
        'lcov'
      ]);
      return new Promise(resolve => {
        reporter.write(collector, true, () => {
          console.log(`>> coverage: ${coverageHtml}`);
          resolve('ok');
        });
      });
    })
    .catch(e => {
      console.log(e);
    });
});

wd.addPromiseChainMethod('openReporter', function (open) {
  if (!open || !platform.isOSX) {
    return this;
  }

  const file1 = path.join(cwd, 'reports', 'index.html');
  const file2 = path.join(cwd, 'coverage', 'index.html');

  if (isExistedFile(file1)) {
    opn(file1);
  }

  if (isExistedFile(file2)) {
    opn(file2);
  }

  return this;
});

export const driver = wd.promiseChainRemote({
  host: 'localhost',
  port: process.env.MACACA_SERVER_PORT || 3456
});

const webpackDevServerPort = 8080;

export const BASE_URL = `http://127.0.0.1:${webpackDevServerPort}/`;
