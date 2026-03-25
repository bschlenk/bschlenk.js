import module from 'node:module'

import js from '@eslint/js'
import eslintReact from '@eslint-react/eslint-plugin'
import stylistic from '@stylistic/eslint-plugin'
import prettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unicorn from 'eslint-plugin-unicorn'
import globals from 'globals'
import tsEslint from 'typescript-eslint'

export { globals }

const base = [
  { linterOptions: { reportUnusedDisableDirectives: 'error' } },

  js.configs.recommended,

  {
    plugins: {
      import: importPlugin,
      'simple-import-sort': simpleImportSort,
      unicorn,
    },

    rules: {
      eqeqeq: ['error', 'smart'],
      'no-restricted-globals': [
        'error',
        // https://sindresorhus.com/blog/goodbye-nodejs-buffer
        {
          name: 'Buffer',
          message: 'Use Uint8Array instead.',
        },
      ],
      'object-shorthand': [
        'error',
        'always',
        { avoidExplicitReturnArrows: true },
      ],

      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',

      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Side effect imports.
            ['^\\u0000'],
            // Node.js builtins.
            ['^node:', `^(${module.builtinModules.join('|')})$`],
            // Packages (react first).
            // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
            ['^react$', '^react-dom$', '^@?\\w'],
            // Absolute imports and other imports such as Vue-style `@/foo`.
            // Anything not matched in another group.
            ['^'],
            // Relative imports.
            // Anything that starts with a dot.
            ['^\\.\\.', '^\\.'],
            // Css imports
            ['\\.css$', '\\.module\\.css$', '\\.css\\.ts$'],
          ],
        },
      ],

      'unicorn/filename-case': ['error', { case: 'kebabCase' }],
      'unicorn/prefer-import-meta-properties': 'error',
      'unicorn/text-encoding-identifier-case': 'error',
    },
  },
]

const javascript = [...base, prettier]

const typescript = [
  ...base,

  ...tsEslint.configs.recommendedTypeChecked,
  ...tsEslint.configs.stylisticTypeChecked,

  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          // prefer omitting the binding instead
          // caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          // prefer an empty space between commas
          ignoreRestSiblings: false,
        },
      ],
    },
  },

  prettier,
]

const react = [
  eslintReact.configs['strict-typescript'],

  {
    plugins: { '@stylistic': stylistic },

    rules: {
      '@eslint-react/dom/no-unknown-property': 'error',

      '@stylistic/jsx-curly-brace-presence': [
        'error',
        { propElementValues: 'always' },
      ],
      '@stylistic/jsx-self-closing-comp': [
        'error',
        { component: true, html: true },
      ],
    },
  },

  prettier,
]

export default { configs: { javascript, typescript, react } }
