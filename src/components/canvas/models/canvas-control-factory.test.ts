import CanvasControl from '@components/canvas/models/canvas-control.ts';
import CanvasControlFactory from '@components/canvas/models/canvas-control-factory.ts';
import mockCanvasControlDeps from '@utility/mock-canvas-control-deps.ts';
import { NCC } from '@utility/relative-numbers.ts';
import { describe, expect, it } from 'vitest';

describe('test CanvasControlFactory', () => {
  it('should create CanvasControl', () => {
    const { context, converter, eventManager } = mockCanvasControlDeps();
    const factory = new CanvasControlFactory(context, converter, eventManager);
    expect(factory.create(CanvasControl)).toBeInstanceOf(CanvasControl);
  });

  it('should create CanvasControl with props', () => {
    const { context, converter, eventManager } = mockCanvasControlDeps();
    const factory = new CanvasControlFactory(context, converter, eventManager);
    const canvasControl = factory.create(CanvasControl, { x: NCC`100`, y: NCC`100` });

    expect(canvasControl.x).toEqual(100);
    expect(canvasControl.y).toEqual(100);
  });

  it('should create CanvasControl with props and children', () => {
    const { context, converter, eventManager } = mockCanvasControlDeps();
    const factory = new CanvasControlFactory(context, converter, eventManager);
    const canvasControl = factory.create(CanvasControl, { x: NCC`100`, y: NCC`100` }, [factory.create(CanvasControl)]);

    expect(canvasControl.x).toEqual(100);
    expect(canvasControl.y).toEqual(100);
    expect(canvasControl.children).toHaveLength(1);
    expect(canvasControl.children[0]).toBeInstanceOf(CanvasControl);
  });
});
