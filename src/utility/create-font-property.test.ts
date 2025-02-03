import createFontProperty from '@utility/create-font-property.ts';
import { describe, expect, it } from 'vitest';

describe('test createFontProperty', () => {
  it('should return correct font property', () => {
    expect(createFontProperty('Arial', 16, 1.2, 'normal')).toEqual('normal 16px/1.2px Arial');
  });
});
