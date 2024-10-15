import { ESLint } from 'eslint'
import path from 'path'
import { describe, expect, test } from 'vitest'

describe('eslint', () => {
  const eslint = new ESLint({
    cwd: import.meta.dirname,
    ignore: false,
  })

  test('...', async () => {
    const results = await eslint.lintFiles(
      path.join(import.meta.dirname, './bad.tsx')
    )
    for (const r of results) {
      delete r.source

      // remove suppressed messages
      r.messages = r.messages.filter((m) => !('suppressions' in m))
      // @ts-expect-error safe to delete
      delete r.suppressedMessages

      for (const m of r.messages) {
        if ('fix' in m && m.fix && 'text' in m.fix) {
          // @ts-expect-error safe to delete
          delete m.fix.text
        }
      }
      r.filePath = path.relative(__dirname, r.filePath)
    }
    expect(results).toMatchSnapshot()
  })
})
