import EventManager from '@components/canvas/models/event-manager.ts';
import { HTMLCanvasElement } from '@playcanvas/canvas-mock';
import RelativeNumbersConverter from '@utility/relative-numbers-converter.ts';

export default function mockCanvasControlDeps() {
  const canvas = new HTMLCanvasElement(640, 480);
  const converter = {} as RelativeNumbersConverter;

  return {
    canvas,
    context: canvas.getContext('2d')! as unknown as CanvasRenderingContext2D,
    converter,
    eventManager: new EventManager(canvas as unknown as globalThis.HTMLCanvasElement, converter),
  };
}
