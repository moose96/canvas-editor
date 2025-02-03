import { Axis } from '@models/axis.ts';
import { NC, NCC } from '@utility/relative-numbers.ts';
import RelativeNumbersConverter from '@utility/relative-numbers-converter.ts';
import { beforeEach, describe, expect, it } from 'vitest';

let converter: RelativeNumbersConverter;

describe('test RelativeNumbersConverter', () => {
  beforeEach(() => {
    const canvas = {
      width: 200,
      offsetWidth: 100,
      offsetLeft: 100,
      offsetTop: 50,
    };
    converter = new RelativeNumbersConverter(canvas as HTMLCanvasElement);
  });

  it('should convert from canvas context units to canvas units', () => {
    expect(converter.fromCanvasContextToCanvas(NCC`100`)).toEqual(50);
  });
  it('should convert from canvas units to canvas context units', () => {
    expect(converter.fromCanvasToCanvasContext(NC`100`)).toEqual(200);
  });
  it('should convert from canvas context to viewport units', () => {
    expect(converter.fromCanvasContextToViewport(NCC`100`, Axis.X)).toEqual(150);
    expect(converter.fromCanvasContextToViewport(NCC`100`, Axis.Y)).toEqual(100);
  });
});
