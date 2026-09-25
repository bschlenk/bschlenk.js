# @bschlenk/eslint-config

My personal ESLint flat config. Ships six composable config arrays (`javascript`, `typescript`, `react`, `browser`, `node`, `cli`) plus an `eslint-init` script that generates a starting `eslint.config.js` for a project.

## Install

```sh
pnpm add -D @bschlenk/eslint-config eslint
```

## Quick start: `eslint-init`

The package ships a bin script, `eslint-init`, that inspects the current project and writes an `eslint.config.js` for you:

```sh
pnpm exec eslint-init --type browser
```

Choose `browser`, `node`, or `cli` for `--type`. The option is required.

It detects your setup by checking, from the current working directory:

- **TypeScript**: whether a `./tsconfig.json` file exists.
- **React**: whether `react` or `react-dom` is listed in `dependencies` or `peerDependencies` in `./package.json`.

Based on that, it picks the appropriate base config (`typescript` or `javascript`), adds the requested runtime config and `react` if needed, sets up the right `files` globs (`.js`/`.ts`/`.jsx`/`.tsx` as appropriate), and — for TypeScript projects — points `parserOptions.project` at your `tsconfig.json` so that type-aware rules work. Run it once, then adjust the generated file by hand if your setup needs anything more specific.

## Manual setup

If you'd rather write the config yourself, or `eslint-init`'s detection doesn't fit your project, import the flavor(s) you need directly:

```js
import bschlenk from '@bschlenk/eslint-config'

export default [...bschlenk.configs.javascript]
```

### The six configs

- **`javascript`** and **`typescript`** are the base configs and are **mutually exclusive** — pick whichever matches the project. `typescript` includes everything `javascript` does, plus `typescript-eslint`'s type-checked rules, so don't spread both.
- **`browser`**, **`node`**, and **`cli`** supply runtime globals. Choose one based on where the code runs. The `node` preset disallows `console`; the `cli` preset allows it.
- **`react`** is an add-on, not a base config. Spread it _in addition to_ whichever base you picked, for projects that use React.

For example, a browser project using TypeScript and React can use all three:

```js
import bschlenk, { globals } from '@bschlenk/eslint-config'

export default [
  {
    languageOptions: {
      parserOptions: { project: './tsconfig.json' },
      globals: { ...globals.es2022 },
    },
  },

  ...bschlenk.configs.typescript,
  ...bschlenk.configs.browser,
  ...bschlenk.configs.react,
]
```

The base and React configs include rule overrides, so they can be composed as shown above. See `index.js` for details.

The `globals` export is re-exported from the [`globals`](https://www.npmjs.com/package/globals) package for convenience when filling in `languageOptions.globals`.
