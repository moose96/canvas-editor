import CanvasControl, { CanvasControlProps } from './canvas-control.ts';

interface CanvasControlConstructor {
  new (context: CanvasRenderingContext2D, props?: CanvasControlProps): CanvasControl;
  prototype: CanvasControl;
}

export default class CanvasControlFactory {
  constructor(private context: CanvasRenderingContext2D) {}

  create(control: CanvasControlConstructor, props?: CanvasControlProps, children?: CanvasControl['children']) {
    const instance = new control(this.context, props);

    if (children) {
      instance.children = children;
    }

    instance.dispatchEvent(new Event('created'));

    return instance;
  }
}
