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

// Registers the plugins `ourRules` pulls rules from, kept separate from
// `base` so `react` can pull it in without re-applying `js.configs.recommended`
// (which would re-enable core rules that typescript-eslint already turned off).
const basePlugins = {
  plugins: {
    import: importPlugin,
    'simple-import-sort': simpleImportSort,
    unicorn,
  },
}

// Recommended/plugin configs. These may disable rules we care about (e.g.
// eslint-config-prettier turns off `curly`), so `ourRules` below is always
// composed after these in every exported flavor to make sure our choices win.
const base = [
  { linterOptions: { reportUnusedDisableDirectives: 'error' } },

  js.configs.recommended,

  basePlugins,
]

// Rules we've deliberately chosen, as opposed to what we get from the
// recommended/plugin configs above.
const ourRules = {
  rules: {
    curly: ['error', 'multi', 'consistent'],
    eqeqeq: ['error', 'smart'],
    'no-restricted-globals': [
      'error',
      // https://sindresorhus.com/blog/goodbye-nodejs-buffer
      {
        name: 'Buffer',
        message: 'Use Uint8Array instead.',
      },
    ],
    'object-shorthand': ['error', 'always', { avoidExplicitReturnArrows: true }],

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
}

const ourTypescriptRules = {
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
}

const ourReactRules = {
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
}

const javascript = [...base, prettier, ourRules]

const typescript = [
  ...base,

  ...tsEslint.configs.recommendedTypeChecked,
  ...tsEslint.configs.stylisticTypeChecked,

  prettier,
  ourRules,
  ourTypescriptRules,
]

const react = [
  basePlugins,

  eslintReact.configs['strict-typescript'],

  prettier,
  ourRules,
  ourReactRules,
]

export default { configs: { javascript, typescript, react } }
