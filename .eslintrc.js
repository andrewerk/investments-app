module.exports = {
  root: true,
  parser: '@typescript-eslint/parser', 
  parserOptions: {
    ecmaVersion: 2020, 
    sourceType: 'module', 
    project: './tsconfig.json'
  },
  env: {
    es6: true,
    node: true,
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  ignorePatterns: ['coverage/**/*.js']
};