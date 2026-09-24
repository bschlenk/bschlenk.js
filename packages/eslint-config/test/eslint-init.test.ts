import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { expect, test } from 'vitest'

test.each([{ args: [] }, { args: ['--type'] }])(
  'requires --type for arguments $args',
  ({ args }) => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'eslint-init-test-'))

    try {
      const script = path.join(import.meta.dirname, '../bin/eslint-init')
      const result = spawnSync(process.execPath, [script, ...args], {
        cwd,
        encoding: 'utf8',
      })

      expect(result.status).toBe(1)
      expect(result.stderr).toContain(
        'Type is required. Valid options: browser, node, cli'
      )
      expect(fs.existsSync(path.join(cwd, 'eslint.config.js'))).toBe(false)
    } finally {
      fs.rmSync(cwd, { recursive: true, force: true })
    }
  }
)
