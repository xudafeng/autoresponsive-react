'use strict';

var path = require('path');

var config = {
  entry: {
    homepage: path.resolve('homepage'),
    examples: path.resolve('examples')
  },
  output: {
    path: path.join(__dirname, 'assets'),
    publicPath: '/assets/',
    filename: '[name].js'
  },
  externals: {
    react: 'window.React'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'jsx-loader?harmony'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  }
};

module.exports = config;
