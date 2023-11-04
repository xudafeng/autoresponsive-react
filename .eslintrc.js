'use strict';

/* eslint-env node */
const eslintConfig = {
  extends: 'eslint-config-egg',
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
    },
  },
  plugins: [
    'react',
    'react-hooks',
  ],
  ignorePatterns: ['*.d.ts'],
  overrides: [],
};

const tslintConfig = {
  // enable the rule specifically for TypeScript files
  files: [
    '*.js',
    '*.jsx',
    '*.ts',
    '*.tsx',
  ],
  extends: [
    'eslint-config-egg/typescript',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    ...eslintConfig.rules,
    'no-unused-vars': 1,
    'no-undef': 'off',
    'no-use-before-define': 'off',
    'no-bitwise': 'warn',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/ban-ts-comment': ['warn'],
    'no-multiple-empty-lines': [
      'error',
      {
        max: 1,
        maxEOF: 0,
        maxBOF: 0,
      },
    ],
  },
};

eslintConfig.overrides.push(tslintConfig);

module.exports = eslintConfig;
