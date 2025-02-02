import CanvasControl from '@components/canvas/canvas-control.ts';
import EventManager, { CollisionShape } from '@components/canvas/event-manager.ts';
import { HTMLCanvasElement } from '@playcanvas/canvas-mock';
import { NCC } from '@utility/relative-numbers.ts';
import RelativeNumbersConverter from '@utility/relative-numbers-converter.ts';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const converter = {} as RelativeNumbersConverter;
let canvas: HTMLCanvasElement;
let eventManager: EventManager;

describe('test CanvasControl', () => {
  beforeEach(() => {
    canvas = new HTMLCanvasElement(640, 480);
    eventManager = new EventManager(canvas as unknown as globalThis.HTMLCanvasElement, converter);
  });

  it('should create default CanvasControl', () => {
    const canvasControl = new CanvasControl(
      canvas.getContext('2d')! as unknown as CanvasRenderingContext2D,
      {} as RelativeNumbersConverter,
      eventManager,
    );

    expect(canvasControl.x).toEqual(0);
    expect(canvasControl.y).toEqual(0);
    expect(canvasControl.width).toEqual(0);
    expect(canvasControl.height).toEqual(0);
    expect(canvasControl.paddingX).toEqual(0);
    expect(canvasControl.paddingY).toEqual(0);
    expect(canvasControl.children).toHaveLength(0);
    expect(canvasControl.collisionShape).toEqual(CollisionShape.Rectangle);
  });

  it('should create CanvasControl with props', () => {
    const props = {
      x: NCC`100`,
      y: NCC`200`,
      width: NCC`300`,
      height: NCC`400`,
      paddingX: NCC`50`,
      paddingY: NCC`100`,
    };
    const canvasControl = new CanvasControl(
      canvas.getContext('2d')! as unknown as CanvasRenderingContext2D,
      {} as RelativeNumbersConverter,
      eventManager,
      props,
    );

    for (const key in props) {
      expect(canvasControl[key]).toEqual(props[key]);
    }
  });

  it('should register the control to the EventManager', () => {
    const registerMock = vi.spyOn(eventManager, 'register');
    const canvasControl = new CanvasControl(
      canvas.getContext('2d')! as unknown as CanvasRenderingContext2D,
      {} as RelativeNumbersConverter,
      eventManager,
    );

    expect(registerMock).toHaveBeenCalledWith(canvasControl);
  });

  it('should unregister the control from the EventManager', () => {
    const unregisterMock = vi.spyOn(eventManager, 'unregister');
    const canvasControl = new CanvasControl(
      canvas.getContext('2d')! as unknown as CanvasRenderingContext2D,
      {} as RelativeNumbersConverter,
      eventManager,
    );
    canvasControl.destructor();

    expect(unregisterMock).toHaveBeenCalledWith(canvasControl);
  });

  it('should provide boundary property', () => {
    const canvasControl = new CanvasControl(
      canvas.getContext('2d')! as unknown as CanvasRenderingContext2D,
      {} as RelativeNumbersConverter,
      eventManager,
      {
        x: NCC`100`,
        y: NCC`100`,
        width: NCC`200`,
        height: NCC`200`,
      },
    );

    expect(canvasControl.boundary).toEqual(new DOMRect(100, 100, 200, 200));
  });

  it('should draw children', () => {
    const canvasControl = new CanvasControl(
      canvas.getContext('2d')! as unknown as CanvasRenderingContext2D,
      {} as RelativeNumbersConverter,
      eventManager,
    );

    const functionChildren = vi.fn();
    const objectChildren = { draw: vi.fn() };

    canvasControl.children = [functionChildren, objectChildren as unknown as CanvasControl];
    canvasControl.draw();

    expect(functionChildren).toHaveBeenCalledTimes(1);
    expect(objectChildren.draw).toHaveBeenCalledTimes(1);
  });
});
