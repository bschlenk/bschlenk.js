import path from 'node:path'

import bschlenk, { globals } from '../index.js'

export default [
  { files: ['./bad.tsx'] },

  {
    languageOptions: {
      parserOptions: {
        project: path.join(import.meta.dirname, './tsconfig.json'),
      },
      globals: { ...globals.browser, ...globals.es2022 },
    },
  },

  ...bschlenk.configs.typescript,
  ...bschlenk.configs.react,
]
