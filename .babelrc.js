'use strict';

module.exports = {
  presets: [
    '@babel/react', 
    '@babel/env', 
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties'
  ],
  comments: false,
  env: {
    test: {
      plugins: [
        'istanbul'
      ]
    }
  }
};
