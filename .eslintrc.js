/* eslint-disable quote-props */
const RULES = {
  OFF: 'off',
  ERROR: 'error',
  WARN: 'warn',
}

module.exports = {
  env: {
    browser: false,
    node: true,
    es2021: true,
    'jest/globals': true,
  },
  extends: ['airbnb-base', 'prettier'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@', '.'],
          ['~', './src'],
        ],
        extensions: ['.js', '.mjs', 'json'],
      },
      node: {},
      webpack: {},
    },
  },
  plugins: ['jest'],
  rules: {
    // Possible Errors
    'no-console': RULES.OFF,
    'no-debugger': process.env.CI || process.env.NODE_ENV === 'production' ? 'error' : 'warn',

    // Stylistic Issues
    'max-len': [RULES.ERROR, { code: 120 }],
    'no-unused-vars': [RULES.ERROR, { vars: 'all' }],
    'no-underscore-dangle': [
      RULES.ERROR,
      {
        allow: ['__', '_id'],
        enforceInMethodNames: true,
      },
    ], // ramda's placeholder
    'brace-style': RULES.OFF,
    'no-bitwise': RULES.OFF,
    'no-plusplus': RULES.OFF,
    'no-restricted-syntax': RULES.OFF,
    quotes: [RULES.ERROR, 'single', { allowTemplateLiterals: true }],

    // ECMAScript 6
    'no-confusing-arrow': [
      RULES.ERROR,
      {
        allowParens: true,
      },
    ],

    // Imports
    'import/prefer-default-export': RULES.OFF,
  },
}
