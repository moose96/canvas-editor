import RelativeNumbersConverter from '@utility/relative-numbers-converter.ts';

import CanvasControl, { CanvasControlProps } from './canvas-control.ts';
import EventManager from './event-manager.ts';

export interface CanvasControlConstructor<Props extends CanvasControlProps, Return extends CanvasControl> {
  new (
    context: CanvasRenderingContext2D,
    converter: RelativeNumbersConverter,
    eventManager: EventManager,
    props?: Props,
  ): Return;
  prototype: CanvasControl;
}

export default class CanvasControlFactory {
  constructor(
    private context: CanvasRenderingContext2D,
    private converter: RelativeNumbersConverter,
    private eventManager: EventManager,
  ) {}

  create<Props extends CanvasControlProps, Return extends CanvasControl>(
    control: CanvasControlConstructor<Props, Return>,
    props?: Props,
    children?: CanvasControl['children'],
  ) {
    const instance = new control(this.context, this.converter, this.eventManager, props);

    if (children) {
      instance.children = children;
    }

    instance.dispatchEvent(new Event('created'));

    return instance;
  }
}
