'use strict';

const path = require('path');
const { isExistedFile } = require('xutil');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const pkg = require('./package');

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
    rules: [
      {
        test: /\.js?/,
        use: 'babel-loader',
        exclude: /node_modules/
      }, {
        test: /\.json$/,
        use: 'json-loader',
        type: 'javascript/auto',
        exclude: /node_modules/
      }, {
        test:/\.less$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'less-loader'
          }
        ]
      }
    ]
  },
  plugins: [
  ]
};

const manifestFile = path.join(__dirname, 'dll', 'manifest.json');

if (isExistedFile(manifestFile)) {
  const manifest = require(manifestFile);
  config.plugins.push(new webpack.DllReferencePlugin({
    context: __dirname,
    manifest,
  }));
}

if (process.env.npm_config_report) {
  config.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = config;
