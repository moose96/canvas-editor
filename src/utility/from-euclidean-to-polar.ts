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
