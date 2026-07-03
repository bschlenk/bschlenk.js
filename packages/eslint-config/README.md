# @bschlenk/eslint-config

My personal ESLint flat config. Ships three composable config arrays
(`javascript`, `typescript`, `react`) plus an `eslint-init` script that
generates a starting `eslint.config.js` for a project.

## Install

```sh
npm install --save-dev @bschlenk/eslint-config eslint
```

## Quick start: `eslint-init`

The package ships a bin script, `eslint-init`, that inspects the current
project and writes an `eslint.config.js` for you:

```sh
npx eslint-init
```

It detects your setup by checking, from the current working directory:

- **TypeScript**: whether a `./tsconfig.json` file exists.
- **React**: whether `react` or `react-dom` is listed in `dependencies` or
  `peerDependencies` in `./package.json`.

Based on that, it picks the appropriate base config (`typescript` or
`javascript`), adds `react` on top if needed, sets up the right `files`
globs (`.js`/`.ts`/`.jsx`/`.tsx` as appropriate), and — for TypeScript
projects — points `parserOptions.project` at your `tsconfig.json` so that
type-aware rules work. Run it once, then adjust the generated file by hand
if your setup needs anything more specific.

## Manual setup

If you'd rather write the config yourself, or `eslint-init`'s detection
doesn't fit your project, import the flavor(s) you need directly:

```js
import bschlenk from '@bschlenk/eslint-config'

export default [...bschlenk.configs.javascript]
```

### The three configs

- **`javascript`** and **`typescript`** are the base configs and are
  **mutually exclusive** — pick whichever matches the project. `typescript`
  includes everything `javascript` does, plus `typescript-eslint`'s
  type-checked rules, so don't spread both.
- **`react`** is an add-on, not a base config. Spread it *in addition to*
  whichever base you picked, for projects that use React:

```js
import bschlenk, { globals } from '@bschlenk/eslint-config'

export default [
  {
    languageOptions: {
      parserOptions: { project: './tsconfig.json' },
      globals: { ...globals.browser, ...globals.es2022 },
    },
  },

  ...bschlenk.configs.typescript,
  ...bschlenk.configs.react,
]
```

Each flavor ends with its own rule overrides (so, for example, `react`'s
`prettier` spread can't silently undo a rule `typescript` already set —
see `index.js` for details), so it's safe to compose any base with `react`,
or to use any single flavor standalone.

The `globals` export is re-exported from the [`globals`](https://www.npmjs.com/package/globals)
package for convenience when filling in `languageOptions.globals`.
