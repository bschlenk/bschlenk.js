export const RAD2DEG = 180 / Math.PI
export const DEG2RAD = Math.PI / 180

export function areClose(a: number, b: number, epsilon = Number.EPSILON) {
  return Math.abs(a - b) < epsilon
}

/**
 * Given an `angle` and a `target` angle, returns the angle that will result in
 * the shortest rotation to reach the target.
 *
 * This is useful when you want to tween between two angles and want to avoid
 * rotating 360 degrees when the angle crosses the 0/360 boundary.
 */
export function correctAngle(angle: number, target: number) {
  const diff = Math.abs(target - angle)
  return diff <= Math.PI
    ? angle
    : angle > target
    ? angle - Math.PI * 2
    : angle + Math.PI * 2
}
