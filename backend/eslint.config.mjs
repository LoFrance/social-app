// @ts-check

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(eslint.configs.recommended, ...tseslint.configs.recommended, {
  files: ['src/**/*.ts'],
  ignores: [
    '!node_modules/', // unignore `node_modules/` directory
    'node_modules/*', // ignore its content
    '!node_modules/mylibrary/', // unignore `node_modules/mylibrary` directory
  ],
  rules: {
    // ..other rules,
    'sort-imports': [
      'error',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
      },
    ],
  },
})
