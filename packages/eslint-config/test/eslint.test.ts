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

  test('react config detects the React version', async () => {
    const config = await eslint.calculateConfigForFile(
      path.join(import.meta.dirname, './bad.tsx')
    )

    expect(config?.settings?.['react-x']).toMatchObject({ version: 'detect' })
  })

  test('browser config', async () => {
    const results = await eslint.lintFiles(
      path.join(import.meta.dirname, './bad.tsx')
    )
    const ruleIds = getRuleIds(results)

    expect(ruleIds).toContain('import/no-duplicates')
    expect(ruleIds).toContain('import/newline-after-import')
    expect(ruleIds).toContain('@stylistic/jsx-curly-brace-presence')
    expect(ruleIds).toContain('@stylistic/jsx-self-closing-comp')
    expect(cleanResults(results)).toMatchSnapshot()
  })

  test('import config rejects imports after code', async () => {
    const results = await eslint.lintText(
      `const value = 1
import fs from 'node:fs'
export { value, fs }`,
      { filePath: path.join(import.meta.dirname, './bad.tsx') }
    )

    expect(getRuleIds(results)).toContain('import/first')
  })

  test('react config rejects conditional hook calls', async () => {
    const results = await eslint.lintText(
      `import { useState } from 'react'
function Component({ active }: { active: boolean }) {
  if (active) useState(0)
  return null
}`,
      { filePath: path.join(import.meta.dirname, './bad.tsx') }
    )

    const ruleIds = getRuleIds(results)
    expect(ruleIds).toContain('react-hooks/rules-of-hooks')
    expect(ruleIds).not.toContain('@eslint-react/rules-of-hooks')
  })

  test('react config checks JSX and DOM mistakes', async () => {
    const results = await eslint.lintText(
      `export function Example() {
  return <>
    <div class="wrong" />
    <a href="https://example.com" target="_blank">link</a>
    {[1, 2].map((value) => <span>{value}</span>)}
  </>
}`,
      { filePath: path.join(import.meta.dirname, './bad.tsx') }
    )

    const ruleIds = getRuleIds(results)
    expect(ruleIds).toContain('@eslint-react/dom-no-unknown-property')
    expect(ruleIds).toContain('@eslint-react/dom-no-unsafe-target-blank')
    expect(ruleIds).toContain('@eslint-react/no-missing-key')
  })

  test('react config rejects nested component definitions', async () => {
    const results = await eslint.lintText(
      `export function Parent() {
  function Child() { return <div /> }
  return <Child />
}`,
      { filePath: path.join(import.meta.dirname, './bad.tsx') }
    )

    expect(getRuleIds(results)).toContain(
      '@eslint-react/no-nested-component-definitions'
    )
  })

  test('react config detects leaked intervals in effects', async () => {
    const results = await eslint.lintText(
      `import { useEffect } from 'react'
export function Component() {
  useEffect(() => { setInterval(() => {}, 1000) }, [])
  return null
}`,
      { filePath: path.join(import.meta.dirname, './bad.tsx') }
    )

    expect(getRuleIds(results)).toContain(
      '@eslint-react/web-api-no-leaked-interval'
    )
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
