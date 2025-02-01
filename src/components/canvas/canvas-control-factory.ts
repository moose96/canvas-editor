import CanvasControl, { CanvasControlProps } from './canvas-control.ts';
import EventManager from './event-manager.ts';

interface CanvasControlConstructor {
  new (context: CanvasRenderingContext2D, eventManager: EventManager, props?: CanvasControlProps): CanvasControl;
  prototype: CanvasControl;
}

export default class CanvasControlFactory {
  constructor(
    private context: CanvasRenderingContext2D,
    private eventManager: EventManager,
  ) {}

  create(control: CanvasControlConstructor, props?: CanvasControlProps, children?: CanvasControl['children']) {
    const instance = new control(this.context, this.eventManager, props);

    if (children) {
      instance.children = children;
    }

    instance.dispatchEvent(new Event('created'));

    return instance;
  }
}
