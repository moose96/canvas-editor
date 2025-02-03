/**
 * Converts Euclidean coordinates to polar coordinates. Useful for drawing circles - their center points and radius
 *
 * @param x - x coordinate of left tangent to the circle
 * @param y - y coordinate of top tangent to the circle
 * @param width - horizontal diameter of the circle
 * @param height - vertical diameter of the circle
 */
export default function fromEuclideanToPolar(x: number, y: number, width: number, height: number) {
  if (width !== height) {
    throw Error('At the moment only squares are supported');
  }

  return {
    radius: width / 2,
    x: x + width / 2,
    y: y + height / 2,
  };
}
