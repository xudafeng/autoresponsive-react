'use strict';

const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';

const config = {
  entry: {
    homepage: path.resolve('homepage'),
    examples: path.resolve('examples')
  },
  output: {
    path: path.join(__dirname, 'assets'),
    publicPath: '/assets/',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js?/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'env', 'stage-2']
        }
      },{
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'istanbul-instrumenter-loader',
        query: {
          esModules: true,
          coverageVariable: '__macaca_coverage__'
        }
      }, {
        test: /\.json$/,
        loader: 'json-loader',
        exclude: /node_modules/
      }
    ]
  }
};

module.exports = config;
