import fromEuclideanToPolar from '@utility/from-euclidean-to-polar.ts';
import getThemeValue from '@utility/get-theme-value.ts';
import { NC, NCC, NumberCanvasContext } from '@utility/relative-numbers.ts';
import RelativeNumbersConverter from '@utility/relative-numbers-converter.ts';

import CanvasControl, { CanvasControlProps } from './canvas-control.ts';
import CanvasToggleButton from './canvas-toggle-button.ts';
import EventManager from './event-manager.ts';

export default class TextColorPicker extends CanvasControl {
  public value?: string;

  constructor(
    context: CanvasRenderingContext2D,
    converter: RelativeNumbersConverter,
    eventManager: EventManager,
    props?: CanvasControlProps,
  ) {
    super(context, converter, eventManager, props);

    this.children = [
      this.createButton(getThemeValue('--color-black-100'), 0),
      this.createButton(getThemeValue('--color-white'), 1),
      this.createButton(getThemeValue('--color-red'), 2),
      this.createButton(getThemeValue('--color-blue'), 3),
      this.createButton(getThemeValue('--color-light-green'), 4),
    ];
  }

  setValue(value: string) {
    this.children.forEach((child) => {
      if (child instanceof CanvasToggleButton) {
        child.value = child.name === value;
      }
    });
    this.value = value;
    this.dispatchEvent(new Event('change'));
  }

  private createButton(color: string, index: number) {
    const gap = NC`4`;

    const button = this.factory.create(
      CanvasToggleButton,
      {
        name: color,
        x: (this.x + index * this.converter.fromCanvasToCanvasContext(NC`${24 + gap}`)) as NumberCanvasContext,
        y: this.y,
        width: this.converter.fromCanvasToCanvasContext(NC`${24}`),
        height: this.converter.fromCanvasToCanvasContext(NC`${24}`),
      },
      [
        (control) => {
          const childWidth = this.converter.fromCanvasToCanvasContext(NC`16`);
          const halfWidth = NCC`${(control.width - childWidth) / 2}`;

          const { x, y, radius } = fromEuclideanToPolar(
            control.x + halfWidth,
            control.y + halfWidth,
            childWidth,
            childWidth,
          );
          this.context.fillStyle = color;
          this.context.beginPath();
          this.context.arc(x, y, radius, 0, 2 * Math.PI);
          this.context.fill();
        },
      ],
    );

    button.value = this.value === color;
    button.addEventListener('click', this.handleClick.bind(this));

    return button;
  }

  private handleClick(event: Event) {
    if (event.target && event.target instanceof CanvasToggleButton) {
      this.setValue(event.target.name);
    }
  }
}
