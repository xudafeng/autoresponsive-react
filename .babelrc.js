'use strict';

module.exports = {
  presets: [
    'env',
    'react',
    'stage-2'
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
