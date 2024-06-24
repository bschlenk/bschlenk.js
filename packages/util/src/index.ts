export function areClose(a: number, b: number, epsilon = Number.EPSILON) {
  return Math.abs(a - b) < epsilon
}

export const RAD2DEG = 180 / Math.PI
export const DEG2RAD = Math.PI / 180
