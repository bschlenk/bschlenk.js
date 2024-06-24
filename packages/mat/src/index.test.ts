import { describe, test, expect } from 'vitest'
import * as mat from './index.js'

describe('mat', () => {
  describe('round', () => {
    test('returns the same matrix if no values change', () => {
      const m = mat.mat(1, 2, 3, 4, 5, 6)
      expect(mat.round(m)).toBe(m)
    })

    test('rounds values within epsilon', () => {
      const m = mat.mat(0.9999999999999999, 0.0000000000000001, 0, 1, 0, 0)
      expect(mat.round(m)).toEqual(mat.IDENTITY)
    })
  })
})
