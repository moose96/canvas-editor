import CanvasControl from '@components/canvas/models/canvas-control.ts';
import { CollisionShape } from '@components/canvas/models/event-manager.ts';
import mockCanvasControlDeps from '@utility/mock-canvas-control-deps.ts';
import { NCC } from '@utility/relative-numbers.ts';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('test CanvasControl', () => {
  it('should create default CanvasControl', () => {
    const { context, converter, eventManager } = mockCanvasControlDeps();
    const canvasControl = new CanvasControl(context, converter, eventManager);

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
    const { context, converter, eventManager } = mockCanvasControlDeps();
    const props = {
      x: NCC`100`,
      y: NCC`200`,
      width: NCC`300`,
      height: NCC`400`,
      paddingX: NCC`50`,
      paddingY: NCC`100`,
    };
    const canvasControl = new CanvasControl(context, converter, eventManager, props);

    for (const key in props) {
      expect(canvasControl[key]).toEqual(props[key]);
    }
  });

  it('should register the control to the EventManager', () => {
    const { context, converter, eventManager } = mockCanvasControlDeps();
    const registerMock = vi.spyOn(eventManager, 'register');
    const canvasControl = new CanvasControl(context, converter, eventManager);

    expect(registerMock).toHaveBeenCalledWith(canvasControl);
  });

  it('should unregister the control from the EventManager', () => {
    const { context, converter, eventManager } = mockCanvasControlDeps();
    const unregisterMock = vi.spyOn(eventManager, 'unregister');
    const canvasControl = new CanvasControl(context, converter, eventManager);
    canvasControl.destructor();

    expect(unregisterMock).toHaveBeenCalledWith(canvasControl);
  });

  it('should provide boundary property', () => {
    const { context, converter, eventManager } = mockCanvasControlDeps();
    const canvasControl = new CanvasControl(context, converter, eventManager, {
      x: NCC`100`,
      y: NCC`100`,
      width: NCC`200`,
      height: NCC`200`,
    });

    expect(canvasControl.boundary).toEqual(new DOMRect(100, 100, 200, 200));
  });

  it('should draw children', () => {
    const { context, converter, eventManager } = mockCanvasControlDeps();
    const canvasControl = new CanvasControl(context, converter, eventManager);

    const functionChildren = vi.fn();
    const objectChildren = { draw: vi.fn() };

    canvasControl.children = [functionChildren, objectChildren as unknown as CanvasControl];
    canvasControl.draw();

    expect(functionChildren).toHaveBeenCalledTimes(1);
    expect(objectChildren.draw).toHaveBeenCalledTimes(1);
  });

  describe.each([
    {
      method: 'move' as const,
      args: [NCC`10`, NCC`10`],
      expected: [NCC`10`, NCC`10`],
      testedParams: ['x', 'y'] as const,
    },
    {
      method: 'resize' as const,
      args: [NCC`10`, NCC`10`],
      expected: [NCC`10`, NCC`10`],
      testedParams: ['width', 'height'] as const,
    },
  ])('test $method', ({ method, args, expected, testedParams }) => {
    let canvasControl: CanvasControl;
    const eventCallbackMock = vi.fn();

    beforeEach(() => {
      const { context, converter, eventManager } = mockCanvasControlDeps();

      canvasControl = new CanvasControl(context, converter, eventManager);
      const child = new CanvasControl(context, converter, eventManager);

      canvasControl.children = [child];
      canvasControl.addEventListener('change', eventCallbackMock);

      canvasControl[method](args[0], args[1]);
    });

    it(`should ${method} component`, () => {
      expect(canvasControl[testedParams[0]]).toEqual(expected[0]);
      expect(canvasControl[testedParams[1]]).toEqual(expected[1]);
    });

    it(`should ${method} children`, () => {
      expect((canvasControl.children[0] as CanvasControl)[testedParams[0]]).toEqual(expected[0]);
      expect((canvasControl.children[0] as CanvasControl)[testedParams[1]]).toEqual(expected[1]);
    });

    it('should dispatch event', () => {
      expect(eventCallbackMock).toHaveBeenCalled();
    });
  });
});
