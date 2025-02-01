import CanvasControl, { CanvasControlProps } from './canvas-control.ts';
import EventManager from './event-manager.ts';

interface CanvasControlConstructor<Props extends CanvasControlProps, Return extends CanvasControl> {
  new (context: CanvasRenderingContext2D, eventManager: EventManager, props?: Props): Return;
  prototype: CanvasControl;
}

export default class CanvasControlFactory {
  constructor(
    private context: CanvasRenderingContext2D,
    private eventManager: EventManager,
  ) {}

  create<Props extends CanvasControlProps, Return extends CanvasControl>(
    control: CanvasControlConstructor<Props, Return>,
    props?: Props,
    children?: CanvasControl['children'],
  ) {
    const instance = new control(this.context, this.eventManager, props);

    if (children) {
      instance.children = children;
    }

    instance.dispatchEvent(new Event('created'));

    return instance;
  }
}
