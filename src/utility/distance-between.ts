import { Point2D } from '@models/point-2d.ts';

export default function distanceBetween(a: Point2D, b: Point2D) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}
