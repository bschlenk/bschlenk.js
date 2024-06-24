import { areClose } from '@bschlenk/util'

export interface Vector {
  x: number
  y: number
}

export const ZERO: Vector = { x: 0, y: 0 }

export function vec(x: number, y: number): Vector {
  return { x, y }
}

/**
 * Return true if this and other are the same vector.
 * Takes PRECISION into account due to floating point rounding errors.
 */
export function equals(a: Vector, b: Vector, epsilon = Number.EPSILON) {
  return areClose(a.x, b.x, epsilon) && areClose(a.y, b.y, epsilon)
}

export function scale(vec: Vector, scalar: number) {
  return { x: vec.x * scalar, y: vec.y * scalar }
}

export function add(a: Vector, b: Vector) {
  return { x: a.x + b.x, y: a.y + b.y }
}

export function addTo(a: Vector, b: Vector) {
  a.x += b.x
  a.y += b.y
}

export function subtract(a: Vector, b: Vector) {
  return { x: a.x - b.x, y: a.y - b.y }
}

export function distanceSquared(a: Vector, b: Vector) {
  return (a.x - b.x) ** 2 + (a.y - b.y) ** 2
}

export function distance(a: Vector, b: Vector) {
  return Math.sqrt(distanceSquared(a, b))
}

export function magnitude(vec: Vector) {
  return distance(ZERO, vec)
}

/**
 * Get the angle in radians of this vector.
 */
export function angle(vec: Vector) {
  return Math.atan2(vec.y, vec.x)
}

/**
 * Returns a vector of magnitude `length`, pointing in the original direction.
 *
 * @param vec The vector to normalize.
 * @param length The length of the new vector. Defaults to 1.
 */
export function normalize(vec: Vector, length = 1) {
  return scale(vec, length / magnitude(vec))
}

export function rotate90(vec: Vector) {
  return { x: -vec.y, y: vec.x }
}

export function rotate(vec: Vector, radians: number) {
  const x = vec.x * Math.cos(radians) - vec.y * Math.sin(radians)
  const y = vec.x * Math.sin(radians) + vec.y * Math.cos(radians)
  return { x, y }
}

/**
 * Returns the dot product of this vector and `other`.
 */
export function dot(a: Vector, b: Vector) {
  return a.x * b.x + a.y * b.y
}

export function projectOnto(a: Vector, b: Vector) {
  return scale(b, dot(a, b) / dot(b, b))
}

export function projectLength(a: Vector, b: Vector) {
  return dot(a, b) / magnitude(b)
}
