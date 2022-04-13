module.exports = {
  'env': {
    'es2021': true,
    'node': true,
  },
  'extends': [
    'google',
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
  },
  'plugins': [
    '@typescript-eslint',
  ],
  'rules': {
    'max-len': ['off'],
    'object-curly-spacing': ['error', 'always'],
    'require-jsdoc': ['off'], // todo: remove this later when the project is ready for active documentation
  },
};
