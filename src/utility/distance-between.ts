import { Point2D } from '@models/point-2d.ts';

/**
 * Calculates the distance between two points on Euclidean plane
 *
 * @param a
 * @param b
 */
export default function distanceBetween(a: Point2D, b: Point2D) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}
