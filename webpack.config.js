'use strict';

const fs = require('fs');
const path = require('path');

const pkg = require('./package');

const isProduction = process.env.NODE_ENV === 'production';

class WebpackAfterAllPlugin {
  apply (compiler) {
    compiler.plugin('done', (compilation) => {
      setTimeout(() => {
        fs.writeFileSync(path.join(__dirname, '.ready'), '')
      }, 1000)
    })
  }
}

const config = {
  entry: {
    [pkg.name]: path.join(__dirname, 'src'),
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
  },
  plugins: [
    new WebpackAfterAllPlugin()
  ]
};

module.exports = config;
