import { areClose } from '@bschlenk/util'

/**
 * A 2D vector with an x and y component.
 *
 * Vectors can also represent points, although usually you will have
 * to subtract two points before these methods conceptually make sense.
 */
export interface Vector {
  x: number
  y: number
}

/**
 * A 2D vector in polar coordinates.
 *
 * Polar coordinates store the angle the vector makes with the x axis (`a`)
 * in radians, and the length of that vector (`r`).
 */
export interface Polar {
  /** The magnitude of the vector. Never negative. */
  r: number
  /**
   * The angle of the vector in radians. On paper this is typically θ.
   * The angle is in terms of atan2, so it ranges from (-π to π].
   */
  a: number
}

/**
 * Slope-intercept is a concise way to represent an infinite straight line.
 *
 * TODO: does this belong in a `line` module?
 */
export interface SlopeIntercept {
  /** The slope of the line. */
  m: number
  /** The point where the line crosses the y axis. */
  b: number
}

export const ZERO: Readonly<Vector> = vec(0, 0)
export const UNIT_X: Readonly<Vector> = vec(1, 0)
export const UNIT_Y: Readonly<Vector> = vec(0, 1)

/**
 * Create a new vector with the given x and y components.
 *
 * TODO: check if using the function is more performant than creating
 * an object literal. Something to do with v8 hidden classes.
 */
export function vec(x: number, y: number): Vector {
  return { x, y }
}

/**
 * Return true if `a` and `b` are the same vector.
 * `epsilon` can be used to account for floating point rounding errors.
 */
export function equals(a: Vector, b: Vector, epsilon = Number.EPSILON) {
  return areClose(a.x, b.x, epsilon) && areClose(a.y, b.y, epsilon)
}

/**
 * Scale the vector by the given scalar.
 *
 * Note there is no `divide` function, `scale` by 1 / `scalar` instead.
 */
export function scale(v: Vector, scalar: number) {
  return vec(v.x * scalar, v.y * scalar)
}

/** Adds two vectors together. */
export function add(a: Vector, b: Vector) {
  return vec(a.x + b.x, a.y + b.y)
}

/**
 * Adds `b` to `a`, mutating `a`.
 *
 * TODO: this method is an odd one out, consider for removal.
 */
export function addTo(a: Vector, b: Vector) {
  a.x += b.x
  a.y += b.y
}

/**
 * Subtracts vector `b` from vector `a`.
 *
 * TODO: I considered calling this `sub` but that felt like it could mean
 * substitute or something, which probably doesn't have a meaning here, but
 * could confuse first timers.
 */
export function subtract(a: Vector, b: Vector) {
  return vec(a.x - b.x, a.y - b.y)
}

/** Computes the magnitude, or length, of the given vector. */
export function magnitude(vec: Vector) {
  return Math.hypot(vec.x, vec.y)
}

/**
 * Computes the squared distance between `a` and `b`. This can be marginally
 * faster than `distance` because it avoids the relatively expensive square
 * root. This is mostly useful for comparing distances.
 */
export function distanceSquared(a: Vector, b: Vector) {
  return (a.x - b.x) ** 2 + (a.y - b.y) ** 2
}

/** Computes the distance between two points. */
export function distance(a: Vector, b: Vector) {
  return magnitude(subtract(a, b))
}

/** Find the point in the middle of a and b. */
export function midpoint(a: Vector, b: Vector) {
  return scale(add(a, b), 0.5)
}

/**
 * Computes the slope-intercept form of a line from `p1` to `p2`.
 * For convenience, passing just `p1` gets the line from the origin.
 */
export function slopeIntercept(p1: Vector, p2: Vector = ZERO): SlopeIntercept {
  const v = subtract(p1, p2)
  const m = v.y / v.x
  const b = p1.y - m * p1.x
  return { m, b }
}

/**
 * Determine the `y` value of `line` at a given `x` value.
 *
 * TODO: could be part of the `line` module.
 */
export function evaluate(line: SlopeIntercept, x: number) {
  return line.m * x + line.b
}

/**
 * Find the point that the lines formed by a -> b and c -> d intersect.
 * If the lines are parallel they won't intersect, and null is returned.
 */
export function intersect(
  p1: Vector,
  p2: Vector,
  p3: Vector,
  p4: Vector
): Vector | null {
  const l1 = slopeIntercept(p1, p2)
  const l2 = slopeIntercept(p3, p4)

  if (l1.m === l2.m) return null

  // Set the two equations equal to each other and solve for x.
  const x = (l2.b - l1.b) / (l1.m - l2.m)

  // Plug the x value back into either line equation.
  const y = evaluate(l1, x)

  return vec(x, y)
}

/**
 * Get the angle in radians. The angle will be in the range (-π, π].
 */
export function angle(vec: Vector) {
  return Math.atan2(vec.y, vec.x)
}

/**
 * Scale the vector's length (or magnitude) down to 1.
 *
 * For convenience, the second parameter can be used to scale the vector
 * to the given `length`.
 */
export function normalize(vec: Vector, length = 1) {
  return scale(vec, length / magnitude(vec))
}

/**
 * Rotate the vector by the given angle in radians.
 */
export function rotate(v: Vector, radians: number) {
  const x = v.x * Math.cos(radians) - v.y * Math.sin(radians)
  const y = v.x * Math.sin(radians) + v.y * Math.cos(radians)
  return vec(x, y)
}

/**
 * Rotate the vector by 90 degrees in the counter-clockwise direction.
 *
 * If you know you need to rotate by 90 degrees, this is much faster than using
 * `rotate` with `Math.PI / 2` because it is a simple flip and negate.
 */
export function rotate90(v: Vector) {
  return vec(-v.y, v.x)
}

/**
 * Rotate the vector by 180 degrees.
 *
 * If you know you need to rotate by 180 degrees, this is much faster than using
 * `rotate` with `Math.PI` because it is a simple negate.
 */
export function rotate180(v: Vector) {
  return vec(-v.x, -v.y)
}

/**
 * Rotate the vector by 270 degrees in the counter-clockwise direction.
 *
 * If you know you need to rotate by 270 degrees, this is much faster than using
 * `rotate` with `Math.PI * 1.5` because it is a simple flip and negate.
 */
export function rotate270(v: Vector) {
  return vec(v.y, -v.x)
}

/**
 * Returns the dot product of `a` and `b`.
 */
export function dot(a: Vector, b: Vector) {
  return a.x * b.x + a.y * b.y
}

/**
 * Projects vector `v` onto vector `onto`.
 *
 * Think of this as the shadow of `v` when cast onto `onto`, with a light source
 * exactly perpendicular to `onto`.
 */
export function projectOnto(v: Vector, onto: Vector) {
  return scale(onto, dot(v, onto) / dot(onto, onto))
}

/**
 * Like `projectOnto`, but returns the length of the projection.
 *
 * This involves much fewer operations than `magnitude(projectOnto(v, onto))`,
 * so prefer it when you know you only need the length.
 */
export function projectLength(v: Vector, onto: Vector) {
  return dot(v, onto) / magnitude(onto)
}

/**
 * Convert vector `v` to polar coordinates.
 */
export function toPolar(v: Vector): Polar {
  const r = magnitude(v)
  const a = angle(v)

  return { r, a }
}

/**
 * Convert polar coordinates to an [x, y] vector.
 */
export function fromPolar({ r, a }: Polar): Vector {
  const x = r * Math.cos(a)
  const y = r * Math.sin(a)

  return vec(x, y)
}

interface HasClientXY {
  clientX: number
  clientY: number
}

/**
 * Get a vector from an event with `clientX` and `clientY` properties,
 * such as a PointerEvent.
 */
export function fromClient(e: HasClientXY): Vector {
  return vec(e.clientX, e.clientY)
}

interface HasDeltaXY {
  deltaX: number
  deltaY: number
}

/**
 * Get a vector from an event with `deltaX` and `deltaY` properties,
 * such as a WheelEvent.
 */
export function fromDelta(e: HasDeltaXY): Vector {
  return vec(e.deltaX, e.deltaY)
}

interface HasMovementXY {
  movementX: number
  movementY: number
}

/**
 * Get a vector from an event with `movementX` and `movementY` properties,
 * such as a PointerEvent during `requestPointerLock`.
 */
export function fromMovement(e: HasMovementXY): Vector {
  return vec(e.movementX, e.movementY)
}
