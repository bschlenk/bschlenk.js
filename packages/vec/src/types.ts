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

export interface HasClientXY {
  clientX: number
  clientY: number
}

export interface HasDeltaXY {
  deltaX: number
  deltaY: number
}

export interface HasMovementXY {
  movementX: number
  movementY: number
}
