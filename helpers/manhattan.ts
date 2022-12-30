import { Coords, CoordsObj } from '../types'

// Return the manhattan distance between two coordinates, expressed either as
// objects with x, y (and possibly z and even t) or arrays of numbers.
// @param a - First point
// @param a - Second point
// @return {Number}
const manhattan = (
  a: Coords | CoordsObj,
  b: Coords | CoordsObj = [0, 0, 0, 0]
): number => {
  const aX = Array.isArray(a) ? a[0] : a.x
  const aY = Array.isArray(a) ? a[1] : a.y
  const aZ = (Array.isArray(a) ? a[2] : a.z) || 0
  const aT = (Array.isArray(a) ? a[3] : a.t) || 0
  const bX = Array.isArray(b) ? b[0] : b.x
  const bY = Array.isArray(b) ? b[1] : b.y
  const bZ = (Array.isArray(b) ? b[2] : b.z) || 0
  const bT = (Array.isArray(b) ? b[3] : b.t) || 0

  return (
    Math.abs(bX - aX) +
    Math.abs(bY - aY) +
    Math.abs(bZ - aZ) +
    Math.abs(bT - aT)
  )
}

export default manhattan
