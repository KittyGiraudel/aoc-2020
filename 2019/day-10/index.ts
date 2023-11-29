import $ from '../../helpers'
import { Coords, CoordsObj, Grid, Point } from '../../types'

type CoordsWithAngle = CoordsObj & { angle?: number }
type Group = { angle: number; items: CoordsObj[] }

export const mapOutSpace = (rows: string[]) => {
  const map: Map<Point, Point[]> = $.grid.reduce(
    $.grid.create<string>(rows),
    (acc, v, ri, ci) => (v === '#' ? acc.set(`${ci},${ri}`, []) : acc),
    new Map() as Map<Point, Point[]>
  )

  const keys: Point[] = Array.from(map.keys())

  keys.forEach(current => {
    const [xC, yC] = $.toCoords(current)
    const asteroids: Point[] = keys.filter(key => current !== key)
    const vectors: Point[] = asteroids.map((asteroid: Point) => {
      const [xD, yD] = $.toCoords(asteroid)
      const vector: Coords = [xD - xC, yD - yC]
      const gcd = $.gcd(vector[0], vector[1])

      return $.toPoint(vector.map(value => value / Math.abs(gcd)) as Coords)
    })

    map.set(current, vectors)
  })

  return map
}

export const findBestSpot = (grid: string[]): [Point, number] => {
  const map = mapOutSpace(grid)

  return Array.from(map.keys()).reduce((acc, key: Point) => {
    const value = new Set(map.get(key)).size
    return !acc || acc[1] < value ? [key, value] : acc
  }, null as [Point, number] | null)
}

const toObj = (point: Point) => {
  const points = $.toCoords(point)

  return { x: points[0], y: points[1] } as CoordsWithAngle
}

const getAngleFromPoint = (pointA: CoordsObj) => (pointB: CoordsObj) =>
  90 + (Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x) * 180) / Math.PI

export const vaporize = grid => {
  const map = mapOutSpace(grid)
  const [spot] = findBestSpot(grid)
  const center = toObj(spot)
  const getAngleFromCenter = getAngleFromPoint(center)
  const asteroids = Array.from(map.keys())
    .filter(asteroid => asteroid !== spot)
    .map(coords => {
      const point = toObj(coords)
      const angle = getAngleFromCenter(point)
      point.angle = angle < 0 ? angle + 360 : angle
      return point
    })
    .sort((a, b) =>
      a.angle !== b.angle
        ? a.angle - b.angle
        : $.manhattan(center, a) - $.manhattan(center, b)
    )

  // Group asteroids per angle, so that we end up with an array of groups in
  // ascending order, each group holding coordinates of all asteroids sitting
  // on the same line to the center (thus same angle).
  const groups: Group[] = asteroids.reduce((acc, { angle, x, y }) => {
    const group = acc.find(group => group.angle === angle)
    if (!group) acc.push({ angle, items: [{ x, y }] })
    else group.items.push({ x, y })
    return acc
  }, [])

  const max = Math.max(...groups.map(({ items }) => items.length))

  // Iterate as many times as there are items in the largest group (which
  // corresponds to the line on which there are the most asteroids in a row).
  // At each iteration, take the first item of each group (if there is any item
  // left in groups), and push it onto the final order. This corresponds to the
  // canon rotations.
  return $.array(max).reduce(order => {
    groups
      .filter(group => group.items.length)
      .forEach(group => order.push(group.items.shift()))

    return order
  }, [])
}
