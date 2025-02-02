export interface Point2D<T extends number = number> {
  x: T;
  y: T;
}

export default function distanceBetween(a: Point2D, b: Point2D) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}
