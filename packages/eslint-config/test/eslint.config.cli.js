import path from 'node:path'

import bschlenk, { globals } from '../index.js'

export default [
  { files: ['./bad-cli.ts'] },

  {
    languageOptions: {
      parserOptions: {
        project: path.join(import.meta.dirname, './tsconfig.json'),
      },
      globals: { ...globals.es2022 },
    },
  },

  ...bschlenk.configs.typescript,
  ...bschlenk.configs.cli,
]
