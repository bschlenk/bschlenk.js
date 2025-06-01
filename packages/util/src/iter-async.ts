/**
 * Yield the result of calling the async function `fn` on each item in `items`,
 * in the same order as they appear in `items`. The number of concurrent running
 * promises is limited by `limit`. In other words, once `limit` promises are
 * running the next one will be kicked off only when one of the running ones
 * finishes.
 */
export async function* iterAsync<T, U>(
  limit: number,
  items: T[],
  fn: (item: T) => Promise<U>
): AsyncGenerator<U, undefined, undefined> {
  let idx = 0
  let running: Promise<U>[] = []

  const enqueue = async (): Promise<U> => {
    const result = await fn(items[idx++])
    if (idx < items.length) {
      running.push(enqueue())
    }
    return result
  }

  const lim = Math.min(limit, items.length)
  for (let i = 0; i < lim; ++i) {
    running.push(enqueue())
  }

  for (const promise of running) {
    yield promise
  }
}
