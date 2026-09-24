import { ESLint } from 'eslint'
import path from 'path'
import { describe, expect, test } from 'vitest'

function cleanResults(results: ESLint.LintResult[]) {
  for (const r of results) {
    delete r.source

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
  return results
}

function getRuleIds(results: ESLint.LintResult[]) {
  return results.flatMap((r) => r.messages.map((m) => m.ruleId))
}

describe('eslint', () => {
  const eslint = new ESLint({
    cwd: import.meta.dirname,
    ignore: false,
  })

  test('browser config', async () => {
    const results = await eslint.lintFiles(
      path.join(import.meta.dirname, './bad.tsx')
    )
    expect(cleanResults(results)).toMatchSnapshot()
  })

  test('node config restricts console', async () => {
    const nodeEslint = new ESLint({
      cwd: import.meta.dirname,
      overrideConfigFile: path.join(
        import.meta.dirname,
        './eslint.config.node.js'
      ),
      ignore: false,
    })

    const results = await nodeEslint.lintFiles(
      path.join(import.meta.dirname, './bad-node.ts')
    )
    const ruleIds = getRuleIds(results)

    expect(ruleIds).toContain('no-console')
  })

  test('cli config allows console', async () => {
    const cliEslint = new ESLint({
      cwd: import.meta.dirname,
      overrideConfigFile: path.join(
        import.meta.dirname,
        './eslint.config.cli.js'
      ),
      ignore: false,
    })

    const results = await cliEslint.lintFiles(
      path.join(import.meta.dirname, './bad-cli.ts')
    )
    const ruleIds = getRuleIds(results)

    expect(ruleIds).not.toContain('no-console')
  })
})
