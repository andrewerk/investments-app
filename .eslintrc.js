module.exports = {
  root: true,
  parser: '@typescript-eslint/parser', // Especifica o analisador ESLint
  parserOptions: {
    ecmaVersion: 2020, // Permite a análise de recursos modernos do ECMAScript
    sourceType: 'module', // Permite o uso de imports
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
  parserOptions: {
       project: './tsconfig.json'
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  rules: {},
};