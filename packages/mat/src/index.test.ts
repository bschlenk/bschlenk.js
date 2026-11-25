import { describe, test, expect } from 'vitest'
import * as mat from './index.js'

describe('mat', () => {
  describe('rotate', () => {
    test('rotation of 0 should return the identity matrix', () => {
      expect(mat.fixNegativeZeros(mat.rotate(0))).toEqual(mat.IDENTITY)
    })
  })

  describe('skew', () => {
    test('skew of 0 should return the identity matrix', () => {
      expect(mat.skew(0, 0)).toEqual(mat.IDENTITY)
    })

    test('x slants the y axis along x, like CSS skewX', () => {
      const m = mat.skewDeg(45)
      expectPoint(mat.transformPoint(m, { x: 0, y: 1 }), 1, 1)
      expectPoint(mat.transformPoint(m, { x: 1, y: 0 }), 1, 0)
    })

    test('y slants the x axis along y, like CSS skewY', () => {
      const m = mat.skewDeg(0, 45)
      expectPoint(mat.transformPoint(m, { x: 1, y: 0 }), 1, 1)
      expectPoint(mat.transformPoint(m, { x: 0, y: 1 }), 0, 1)
    })

    test('skewAt leaves the center point in place', () => {
      const m = mat.skewDegAt(45, 0, 10, 20)
      expectPoint(mat.transformPoint(m, { x: 10, y: 20 }), 10, 20)
      expectPoint(mat.transformPoint(m, { x: 10, y: 21 }), 11, 21)
    })
  })

  describe('mult', () => {
    test('should return the identity matrix if no matrices are given', () => {
      expect(mat.mult()).toBe(mat.IDENTITY)
    })

    test('should multiply two matrices', () => {
      const result = mat.mult(
        mat.mat(1, 0, 0, 1, -50, -150),
        mat.mat(-1, 0, 0, -1, 0, 0)
      )

      expect(mat.fixNegativeZeros(result)).toEqual(
        mat.mat(-1, 0, 0, -1, -50, -150)
      )
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

    test('multiplying by the identity matrix should return an equal matrix', () => {
      const m = mat.mult(mat.rotateDeg(45), mat.IDENTITY)
      expect(m).toEqual(m)
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

function expectPoint(p: { x: number; y: number }, x: number, y: number) {
  expect(p.x).toBeCloseTo(x, 10)
  expect(p.y).toBeCloseTo(y, 10)
}
