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

var path = require('path');

var config = {
  entry: {
    'autoresponsive-react': path.resolve('index.js'),
  },
  output: {
    path: path.join(__dirname, 'assets'),
    filename: '[name].js'
  },
  externals: {
    react: 'React',
    'react/addons': 'React'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'jsx-loader?harmony'
      }
    ]
  }
};

module.exports = config;
