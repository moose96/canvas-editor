import center from '@utility/center.ts';
import { describe, expect, it } from 'vitest';

describe('test center', () => {
  it('should return correct x and y position for child smaller than parent', () => {
    const { x, y } = center({ x: 0, y: 0, width: 100, height: 200 }, 50, 100);

    expect(x).toEqual(25);
    expect(y).toEqual(50);
  });
  it('should return correct x and y position for child bigger than parent', () => {
    const { x, y } = center({ x: 0, y: 0, width: 100, height: 50 }, 200, 300);

    expect(x).toEqual(50);
    expect(y).toEqual(125);
  });
});
