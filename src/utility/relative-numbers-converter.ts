import { NC, NCC, NumberCanvas, NumberCanvasContext, NumberViewport, NV } from '@utility/relative-numbers.ts';

export enum Axis {
  X,
  Y,
}

export default class RelativeNumbersConverter {
  private readonly scale: number;

  constructor(private canvas: HTMLCanvasElement) {
    this.scale = this.canvas.width / this.canvas.offsetWidth;
  }

  fromCanvasToCanvasContext(value: NumberCanvas): NumberCanvasContext {
    return NCC`${this.scale * value}`;
  }

  fromCanvasContextToCanvas(value: NumberCanvasContext): NumberCanvas {
    return NC`${this.reversedScale * value}`;
  }
  fromCanvasContextToViewport(value: NumberCanvasContext, axis: Axis): NumberViewport {
    const offset = axis === Axis.X ? this.canvas.offsetLeft : this.canvas.offsetTop;
    return NV`${this.fromCanvasContextToCanvas(value) + offset}`;
  }

  private get reversedScale() {
    return 1 / this.scale;
  }
}
