import { afterEach, describe, expect, test, vi } from 'vitest'
import * as vec from './index.js'

describe('vec', () => {
  test('exports the origin and unit vectors', () => {
    expect(vec.ZERO).toEqual({ x: 0, y: 0 })
    expect(vec.UNIT_X).toEqual({ x: 1, y: 0 })
    expect(vec.UNIT_Y).toEqual({ x: 0, y: 1 })
  })

  test('creates vectors with the given coordinates', () => {
    expect(vec.vec(-2, 3)).toEqual({ x: -2, y: 3 })
  })

  describe('equals', () => {
    test('compares both coordinates', () => {
      expect(vec.equals(vec.vec(2, 3), vec.vec(2, 3))).toBe(true)
      expect(vec.equals(vec.vec(2, 3), vec.vec(2, 4))).toBe(false)
    })

    test('uses Number.EPSILON as the default tolerance', () => {
      expect(vec.equals(vec.ZERO, vec.vec(Number.EPSILON / 2, 0))).toBe(true)
      expect(vec.equals(vec.ZERO, vec.vec(Number.EPSILON, 0))).toBe(false)
    })

    test('accepts a tolerance for rounding errors', () => {
      expect(vec.equals(vec.vec(1, 2), vec.vec(1.001, 2.001), 0.01)).toBe(true)
      expect(vec.equals(vec.vec(1, 2), vec.vec(1.1, 2), 0.01)).toBe(false)
    })
  })

  describe('arithmetic', () => {
    test('scales a vector without changing the input', () => {
      const input = vec.vec(2, -3)
      expect(vec.scale(input, -2)).toEqual(vec.vec(-4, 6))
      expect(input).toEqual(vec.vec(2, -3))
    })

    test('adds and subtracts vectors', () => {
      expect(vec.add(vec.vec(2, -3), vec.vec(-5, 7))).toEqual(vec.vec(-3, 4))
      expect(vec.subtract(vec.vec(2, -3), vec.vec(-5, 7))).toEqual(vec.vec(7, -10))
    })

    test('addTo mutates only the first vector', () => {
      const target = vec.vec(2, -3)
      const addition = vec.vec(-5, 7)
      expect(vec.addTo(target, addition)).toBeUndefined()
      expect(target).toEqual(vec.vec(-3, 4))
      expect(addition).toEqual(vec.vec(-5, 7))
    })
  })

  describe('distance and length', () => {
    test('computes magnitude and distance', () => {
      expect(vec.magnitude(vec.vec(3, 4))).toBe(5)
      expect(vec.distance(vec.vec(1, 2), vec.vec(4, 6))).toBe(5)
      expect(vec.distanceSquared(vec.vec(1, 2), vec.vec(4, 6))).toBe(25)
    })

    test('finds the midpoint', () => {
      expect(vec.midpoint(vec.vec(-2, 8), vec.vec(4, 2))).toEqual(
        vec.vec(1, 5)
      )
    })

    test('normalizes to unit length or a requested length', () => {
      const unit = vec.normalize(vec.vec(3, 4))
      expect(unit.x).toBeCloseTo(0.6)
      expect(unit.y).toBeCloseTo(0.8)
      expect(vec.normalize(vec.vec(3, 4), 10)).toEqual(vec.vec(6, 8))
    })
  })

  describe('lines', () => {
    test('calculates slope and evaluates a line', () => {
      const line = vec.slopeIntercept(vec.vec(3, 7), vec.vec(1, 3))
      expect(line).toEqual({ m: 2, b: 1 })
      expect(vec.evaluate(line, 5)).toBe(11)
      expect(vec.slopeIntercept(vec.vec(2, 6))).toEqual({ m: 3, b: 0 })
    })

    test('finds the intersection of crossing lines', () => {
      expect(
        vec.intersect(
          vec.vec(0, 0),
          vec.vec(4, 4),
          vec.vec(0, 4),
          vec.vec(4, 0)
        )
      ).toEqual(vec.vec(2, 2))
    })

    test('finds the intersection of vertical and horizontal lines', () => {
      expect(
        vec.intersect(
          vec.vec(2, -1),
          vec.vec(2, 5),
          vec.vec(-1, 3),
          vec.vec(5, 3)
        )
      ).toEqual(vec.vec(2, 3))
    })

    test('returns null for parallel or coincident lines', () => {
      expect(
        vec.intersect(
          vec.vec(0, 0),
          vec.vec(2, 2),
          vec.vec(0, 1),
          vec.vec(2, 3)
        )
      ).toBeNull()
      expect(
        vec.intersect(
          vec.vec(0, 0),
          vec.vec(2, 2),
          vec.vec(1, 1),
          vec.vec(3, 3)
        )
      ).toBeNull()
    })
  })

  describe('rotation', () => {
    test('measures angles in all quadrants', () => {
      expect(vec.angle(vec.UNIT_X)).toBe(0)
      expect(vec.angle(vec.UNIT_Y)).toBe(Math.PI / 2)
      expect(vec.angle(vec.vec(-1, 0))).toBe(Math.PI)
      expect(vec.angle(vec.vec(0, -1))).toBe(-Math.PI / 2)
    })

    test('rotates by an arbitrary angle', () => {
      const result = vec.rotate(vec.vec(2, 0), Math.PI / 4)
      expect(result.x).toBeCloseTo(Math.SQRT2)
      expect(result.y).toBeCloseTo(Math.SQRT2)
    })

    test('rotates by exact quarter turns', () => {
      const input = vec.vec(2, 3)
      expect(vec.rotate90(input)).toEqual(vec.vec(-3, 2))
      expect(vec.rotate180(input)).toEqual(vec.vec(-2, -3))
      expect(vec.rotate270(input)).toEqual(vec.vec(3, -2))
      expect(input).toEqual(vec.vec(2, 3))
    })
  })

  describe('projection', () => {
    test('computes dot product and vector projection', () => {
      expect(vec.dot(vec.vec(3, 4), vec.vec(2, -1))).toBe(2)
      expect(vec.projectOnto(vec.vec(3, 4), vec.vec(2, 0))).toEqual(
        vec.vec(3, 0)
      )
    })

    test('returns a signed projection length', () => {
      expect(vec.projectLength(vec.vec(-3, 4), vec.vec(2, 0))).toBe(-3)
    })
  })

  describe('coordinate conversion', () => {
    test('round trips through polar coordinates', () => {
      const polar = vec.toPolar(vec.vec(3, 4))
      expect(polar.r).toBe(5)
      expect(polar.a).toBeCloseTo(Math.atan2(4, 3))
      const result = vec.fromPolar(polar)
      expect(result.x).toBeCloseTo(3)
      expect(result.y).toBeCloseTo(4)
    })

    test('converts DOM points and pointer event coordinates', () => {
      expect(vec.fromDomPoint({ x: 4, y: -2 } as DOMPoint)).toEqual(
        vec.vec(4, -2)
      )
      expect(vec.fromClientXY({ clientX: 5, clientY: 6 })).toEqual(
        vec.vec(5, 6)
      )
      expect(vec.fromDeltaXY({ deltaX: -1, deltaY: 2 })).toEqual(
        vec.vec(-1, 2)
      )
      expect(vec.fromMovementXY({ movementX: 3, movementY: -4 })).toEqual(
        vec.vec(3, -4)
      )
    })

    test('reads an element position and window size', () => {
      const element = {
        getBoundingClientRect: () => ({ x: 7, y: 8 }),
      } as HTMLElement
      vi.stubGlobal('window', { innerWidth: 1024, innerHeight: 768 })

      expect(vec.fromElementTopLeft(element)).toEqual(vec.vec(7, 8))
      expect(vec.fromWindow()).toEqual(vec.vec(1024, 768))
    })
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
})
