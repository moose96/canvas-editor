import center from '@utility/center.ts';
import fromEuclideanToPolar from '@utility/from-euclidean-to-polar.ts';
import getThemeValue from '@utility/get-theme-value.ts';
import { NCC } from '@utility/relative-numbers.ts';
import RelativeNumbersConverter from '@utility/relative-numbers-converter.ts';

import CanvasControl, { CanvasControlProps } from './canvas-control.ts';
import EventManager from './event-manager.ts';

export default class CanvasButton extends CanvasControl {
  constructor(
    context: CanvasRenderingContext2D,
    converter: RelativeNumbersConverter,
    eventManager: EventManager,
    props?: CanvasControlProps,
  ) {
    super(context, converter, eventManager, props);

    this.addEventListener('created', this.handleCreated.bind(this));
  }

  async draw() {
    const { x, y, radius } = fromEuclideanToPolar(this.x, this.y, this.width, this.height);
    this.context.fillStyle = getThemeValue('--color-white');
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, 2 * Math.PI);
    this.context.fill();

    await super.draw();
  }

  private handleCreated() {
    for (const child of this.children) {
      if (typeof child === 'function') {
        continue;
      }

      const { x, y } = center(this, child.width, child.height);

      child.x = NCC`${x}`;
      child.y = NCC`${y}`;
    }
  }
}
