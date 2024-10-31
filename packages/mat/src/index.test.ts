import { describe, test, expect } from 'vitest'
import * as mat from './index.js'

describe('mat', () => {
  describe('mult', () => {
    test('should return the identity matrix if no matrices are given', () => {
      expect(mat.mult()).toEqual(mat.IDENTITY)
    })

    test('should multiply two matrices', () => {
      const result = mat.fixNegativeZeros(
        mat.mult(mat.mat(1, 0, 0, 1, -50, -150), mat.mat(-1, 0, 0, -1, 0, 0))
      )

      expect(result).toEqual(mat.mat(-1, 0, 0, -1, -50, -150))
    })

    test('should multiply three matrices', () => {
      const result = mat.fixNegativeZeros(
        mat.mult(
          mat.mat(1, 0, 0, 1, -50, -150),
          mat.mat(-1, 0, 0, -1, 0, 0),
          mat.mat(1, 0, 0, 1, 50, 150)
        )
      )

      expect(result).toEqual(mat.mat(-1, 0, 0, -1, -100, -300))
    })
  })

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

  describe('fixNegativeZeros', () => {
    test('should return the same matrix if no values change', () => {
      const m = mat.mat(1, 2, 3, 4, 5, 6)
      expect(mat.fixNegativeZeros(m)).toBe(m)
    })

    test('should convert negative zeros to zeros', () => {
      const m = mat.mat(0, -0, -0, 0, -0, 0)
      expect(mat.fixNegativeZeros(m)).toEqual(mat.mat(0, 0, 0, 0, 0, 0))
    })
  })
})
