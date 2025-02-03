import distanceBetween from '@utility/distance-between.ts';
import { describe, expect, it } from 'vitest';

describe('test distanceBetween', () => {
  it('should return correct distance', () => {
    expect(distanceBetween({ x: 0, y: 0 }, { x: 100, y: 100 })).toEqual(141.4213562373095);
  });
});
