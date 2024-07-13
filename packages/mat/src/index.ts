import { areClose, DEG2RAD } from '@bschlenk/util'
import type { Vector } from '@bschlenk/vec'

interface MatrixMut {
  xx: number
  xy: number
  yx: number
  yy: number
  dx: number
  dy: number
}

/**
 * A 2D affine transformation matrix.
 */
export type Matrix = Readonly<MatrixMut>

/**
 * The identity matrix.
 */
export const IDENTITY: Matrix = mat(1, 0, 0, 1, 0, 0)

/**
 * Create a new Matrix, passing values in column-major order.
 * Some reference material may refer to the values as a, b, c, d, e, f.
 */
export function mat(
  xx: number,
  xy: number,
  yx: number,
  yy: number,
  dx: number,
  dy: number
): Matrix {
  return { xx, xy, yx, yy, dx, dy }
}

/**
 * Create a new matrix that translates by the given values.
 */
export function translate(x: number, y: number): Matrix {
  return mat(1, 0, 0, 1, x, y)
}

/**
 * Create a new matrix that rotates by the given angle, in radians.
 */
export function rotate(angle: number): Matrix {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  return mat(cos, sin, -sin, cos, 0, 0)
}

/**
 * Create a new matrix that rotates by the given angle, in degrees.
 */
export function rotateDeg(angle: number): Matrix {
  return rotate(angle * DEG2RAD)
}

/**
 * Create a new matrix that rotates by the given angle, in radians,
 * around the given point.
 */
export function rotateAt(angle: number, cx: number, cy: number): Matrix {
  return transformAt(rotate(angle), cx, cy)
}

/**
 * Create a new matrix that rotates by the given angle, in degrees,
 * around the given point.
 */
export function rotateDegAt(angle: number, cx: number, cy: number): Matrix {
  return rotateAt(angle * DEG2RAD, cx, cy)
}

/**
 * Determine the rotation of the given matrix.
 *
 * This is the angle in radians that the x axis makes with origin.
 */
export function getRotation(m: Matrix) {
  return Math.atan2(m.xy, m.xx)
}

/**
 * Create a new matrix that scales by the given values. The second argument
 * can be omitted to scale by the same value in both dimensions.
 */
export function scale(x: number, y = x): Matrix {
  return mat(x, 0, 0, y, 0, 0)
}

/**
 * Create a new matrix that scales by the given values, around the given point.
 */
export function scaleAt(x: number, y: number, cx: number, cy: number): Matrix {
  return transformAt(scale(x, y), cx, cy)
}

/**
 * Multiply an arbitrary number of matrices together.
 */
export function mult(...matrices: Matrix[]): Matrix {
  if (matrices.length === 0) return IDENTITY

  let m = matrices[0]
  for (let i = 1; i < matrices.length; ++i) {
    m = mult2(m, matrices[i])
  }

  return m
}

/**
 * Compute the determinant of the given matrix.
 */
export function determinant(m: Matrix) {
  return m.xx * m.yy - m.xy * m.yx
}

/**
 * Invert the given matrix, if possible. If the matrix is not invertible,
 * `null` is returned.
 */
export function invert(m: Matrix) {
  const det = determinant(m)
  if (det === 0) return null

  return mat(
    m.yy / det,
    -m.xy / det,
    -m.yx / det,
    m.xx / det,
    (m.yx * m.dy - m.yy * m.dx) / det,
    (m.xy * m.dx - m.xx * m.dy) / det
  )
}

/**
 * Rounds any values in the given matrix that are within `epsilon` of the value
 * obtained by calling `Math.round` on them.
 */
export function round(m: Matrix, epsilon = Number.EPSILON) {
  const xx = roundEpsilon(m.xx, epsilon)
  const xy = roundEpsilon(m.xy, epsilon)
  const yx = roundEpsilon(m.yx, epsilon)
  const yy = roundEpsilon(m.yy, epsilon)
  const dx = roundEpsilon(m.dx, epsilon)
  const dy = roundEpsilon(m.dy, epsilon)

  if (
    xx === m.xx &&
    xy === m.xy &&
    yx === m.yx &&
    yy === m.yy &&
    dx === m.dx &&
    dy === m.dy
  ) {
    return m
  }

  return mat(xx, xy, yx, yy, dx, dy)
}

/**
 * Transform a point by the given matrix.
 *
 * Essentially converts a "matrix space" point to "world space".
 */
export function transformPoint(m: Matrix, v: Vector) {
  return {
    x: m.xx * v.x + m.yx * v.y + m.dx,
    y: m.xy * v.x + m.yy * v.y + m.dy,
  }
}

/**
 * Transform a point by the inverse of the given matrix. If the matrix is not
 * invertible, returns `null`.
 *
 * Essentially converts a "world space" point to "matrix space".
 */
export function inverseTransformPoint(m: Matrix, v: Vector) {
  const mi = invert(m)
  return mi ? transformPoint(mi, v) : null
}

export function equals(a: Matrix, b: Matrix, epsilon = Number.EPSILON) {
  return (
    areClose(a.xx, b.xx, epsilon) &&
    areClose(a.xy, b.xy, epsilon) &&
    areClose(a.yx, b.yx, epsilon) &&
    areClose(a.yy, b.yy, epsilon) &&
    areClose(a.dx, b.dx, epsilon) &&
    areClose(a.dy, b.dy, epsilon)
  )
}

export function isIdentity(m: Matrix) {
  return equals(m, IDENTITY)
}

/**
 * Check if all values in the given matrix are not NaN or Infinity.
 */
export function isValid(m: Matrix) {
  return Object.values(m).every((v) => !Number.isNaN(v) && Number.isFinite(v))
}

/**
 * Generate a css transform property value from a Matrix.
 *
 * The only difference between this and `toSvg` is that the values
 * are separated by commas instead of spaces.
 */
export function toCss(m: Matrix) {
  return `matrix(${m.xx}, ${m.xy}, ${m.yx}, ${m.yy}, ${m.dx}, ${m.dy})`
}

/**
 * Generate an SVG transform attribute from a Matrix.
 *
 * The only difference between this and `toCss` is that the values
 * are separated by spaces instead of commas.
 */
export function toSvg(m: Matrix) {
  return `matrix(${m.xx} ${m.xy} ${m.yx} ${m.yy} ${m.dx} ${m.dy})`
}

/**
 * Calls the given canvas context's `transform` method
 * with the values from the given matrix.
 */
export function toCanvas(m: Matrix, ctx: CanvasRenderingContext2D) {
  ctx.transform(m.xx, m.xy, m.yx, m.yy, m.dx, m.dy)
}

/**
 * Create a new matrix from an instance of a DOMMatrix object. These can be
 * obtained by calling `getTransform()` on a canvas context.
 */
export function fromDomMatrix(m: DOMMatrixReadOnly): Matrix {
  return mat(m.a, m.b, m.c, m.d, m.e, m.f)
}

// Helpers

function mult2(a: Matrix, b: Matrix): Matrix {
  return mat(
    a.xx * b.xx + a.xy * b.yx,
    a.xx * b.xy + a.xy * b.yy,
    a.yx * b.xx + a.yy * b.yx,
    a.yx * b.xy + a.yy * b.yy,
    a.dx * b.xx + a.dy * b.yx + b.dx,
    a.dx * b.xy + a.dy * b.yy + b.dy
  )
}

function transformAt(m: Matrix, centerX: number, centerY: number): Matrix {
  return mult(translate(centerX, centerY), m, translate(-centerX, -centerY))
}

/**
 * Rounds the given value if it is within `epsilon` of the value obtained by
 * calling `Math.round` on it.
 */
function roundEpsilon(value: number, epsilon = Number.EPSILON) {
  const r = Math.round(value)
  return Math.abs(value - r) < epsilon ? r : value
}
