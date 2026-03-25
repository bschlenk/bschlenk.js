import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { iterAsync } from '../iter-async.js'

describe('iterAsync', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('should pass index to callback', async () => {
    const indices: number[] = []

    const gen = iterAsync(1, ['a', 'b', 'c'], async (item, index) => {
      indices.push(index)
      return item
    })

    for await (const _ of gen) {
    }

    expect(indices).toEqual([0, 1, 2])
  })

  test('should yield in order', async () => {
    let running = 0

    const gen = iterAsync(2, [100, 200, 300, 400], async (n) => {
      running++
      await wait(n)
      running--
      return n
    })

    let next = gen.next()

    // Should start the first two
    expect(running).toBe(2)

    vi.advanceTimersByTime(100)

    // Should have started the next to keep 2 running
    expect(running).toBe(2)

    let result = await next
    expect(result.value).toBe(100)

    vi.advanceTimersByTime(100)

    // Should have started the next to keep 2 running
    expect(running).toBe(2)
    next = gen.next()
    result = await next

    expect(result.value).toBe(200)

    vi.advanceTimersByTime(400)

    next = gen.next()
    result = await next
    expect(result.value).toBe(300)
    expect(running).toBe(0)

    next = gen.next()
    result = await next

    expect(result.value).toBe(400)

    next = gen.next()
    result = await next
    expect(result.done).toBe(true)
    expect(result.value).toBeUndefined()
  })
})

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}
