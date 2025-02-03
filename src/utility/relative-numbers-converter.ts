import { Axis } from '@models/axis.ts';
import { NC, NCC, NumberCanvas, NumberCanvasContext, NumberViewport, NV } from '@utility/relative-numbers.ts';

/**
 * Canvas context might be scaled while displaying its content in canvas element, so there is need to convert position,
 * dimensions and other values in pixel units.
 */
export default class RelativeNumbersConverter {
  private readonly scale: number;

  constructor(private canvas: HTMLCanvasElement) {
    this.scale = this.canvas.width / this.canvas.offsetWidth;
  }

  /**
   * Converts value from canvas element units to canvas context units
   *
   * @param value
   */
  fromCanvasToCanvasContext(value: NumberCanvas): NumberCanvasContext {
    return NCC`${this.scale * value}`;
  }

  /**
   * Converts value from canvas context units to canvas element units
   *
   * @param value
   */
  fromCanvasContextToCanvas(value: NumberCanvasContext): NumberCanvas {
    return NC`${this.reversedScale * value}`;
  }

  /**
   * Converts value from canvas context units to viewport units, which are the same as canvas element units.
   * But this method also includes offset of the canvas element.
   *
   * @param value
   * @param axis
   */
  fromCanvasContextToViewport(value: NumberCanvasContext, axis: Axis): NumberViewport {
    const offset = axis === Axis.X ? this.canvas.offsetLeft : this.canvas.offsetTop;
    return NV`${this.fromCanvasContextToCanvas(value) + offset}`;
  }

  private get reversedScale() {
    return 1 / this.scale;
  }
}
