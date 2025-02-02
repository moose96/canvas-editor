import { NC, NCC, NV } from '@utility/relative-numbers.ts';
import { describe, expect, test } from 'vitest';

describe('test template literals', () => {
  test.each([
    [NCC`5`, 5],
    [NCC`0`, 0],
    [NC`5`, 5],
    [NC`0`, 0],
    [NV`5`, 5],
    [NV`0`, 0],
  ])('with strings (to be %i)', (value, expected) => {
    expect(value).toBe(expected);
  });
  test('with expressions', () => {
    expect(NCC`${1 + 1}`).toBe(2);
  });
});
