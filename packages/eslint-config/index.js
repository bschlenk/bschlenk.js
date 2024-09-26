import { fixupPluginRules } from '@eslint/compat'
import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import reactPlugin from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import tsEslint from 'typescript-eslint'

export { globals }

const base = [
  { linterOptions: { reportUnusedDisableDirectives: 'error' } },

  js.configs.recommended,

  {
    plugins: {
      import: fixupPluginRules(importPlugin),
      'simple-import-sort': simpleImportSort,
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
            // Node.js builtins prefixed with `node:`.
            ['^node:'],
            // Packages (react first).
            // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
            ['^react$', '^react-dom$', '^@?\\w'],
            // Absolute imports and other imports such as Vue-style `@/foo`.
            // Anything not matched in another group.
            ['^'],
            // Relative imports.
            // Anything that starts with a dot.
            ['^\\.'],
            // Css imports
            ['\\.css$', '\\.module\\.css$'],
          ],
        },
      ],
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
  { settings: { react: { version: 'detect' } } },

  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],

  {
    plugins: {
      'react-hooks': reactHooks,
      rules: reactHooks.configs.recommended.rules,
    },
  },

  {
    rules: {
      'react/jsx-curly-brace-presence': [
        'error',
        { propElementValues: 'always' },
      ],
      'react/self-closing-comp': ['error', { component: true, html: true }],
    },
  },

  prettier,
]

export default { configs: { javascript, typescript, react } }
