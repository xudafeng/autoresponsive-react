'use strict';

const path = require('path');

const pkg = require('./package');

const isProduction = process.env.NODE_ENV === 'production';

const config = {
  entry: {
    homepage: path.resolve('homepage'),
    examples: path.resolve('examples')
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/dist',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js?/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }, {
        test: /\.json$/,
        loader: 'json-loader',
        exclude: /node_modules/
      }, {
        test:/\.less$/,
        loader:"style-loader!css-loader!less-loader"
      }
    ]
  }
};

module.exports = config;
