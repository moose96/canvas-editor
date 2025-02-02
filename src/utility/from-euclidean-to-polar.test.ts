import fromEuclideanToPolar from '@utility/from-euclidean-to-polar.ts';
import { describe, expect, it } from 'vitest';

describe('test fromEuclideanToPolar', () => {
  it('should return correct polar coordinates (x, y to center, radius a half of width)', () => {
    const { x, y, radius } = fromEuclideanToPolar(0, 0, 100, 100);

    expect(x).toEqual(50);
    expect(y).toEqual(50);
    expect(radius).toEqual(50);
  });

  it('should throw error when width and height are not equal', () => {
    expect(() => fromEuclideanToPolar(0, 0, 100, 200)).toThrowError('At the moment only squares are supported');
  });
});
