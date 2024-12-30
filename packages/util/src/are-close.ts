/** Check if `a` and `b` are within `epsilon` of each other. */
export function areClose(a: number, b: number, epsilon = Number.EPSILON) {
  return Math.abs(a - b) < epsilon
}
