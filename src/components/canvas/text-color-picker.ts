import fromEuclideanToPolar from '../../utility/from-euclidean-to-polar.ts';
import getThemeValue from '../../utility/get-theme-value.ts';
import CanvasControl, { CanvasControlProps } from './canvas-control.ts';
import CanvasToggleButton from './canvas-toggle-button.ts';
import EventManager from './event-manager.ts';

export default class TextColorPicker extends CanvasControl {
  public value?: string;

  constructor(context: CanvasRenderingContext2D, eventManager: EventManager, props?: CanvasControlProps) {
    super(context, eventManager, props);

    this.children = [
      this.createButton(getThemeValue('--color-black-100'), 0),
      this.createButton(getThemeValue('--color-white'), 1),
      this.createButton(getThemeValue('--color-red'), 2),
      this.createButton(getThemeValue('--color-blue'), 3),
      this.createButton(getThemeValue('--color-light-green'), 4),
    ];
  }

  private createButton(color: string, index: number) {
    const gap = 4;

    const button = this.factory.create(
      CanvasToggleButton,
      { name: color, x: this.x + index * (24 + gap), y: this.y, width: 24, height: 24 },
      [
        (control) => {
          const { x, y, radius } = fromEuclideanToPolar(control.x + 4, control.y + 4, 16, 16);
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
      this.children.forEach((child) => {
        if (child instanceof CanvasToggleButton) {
          child.value = false;
        }
      });
      event.target.value = true;
      this.value = event.target.name;
      this.dispatchEvent(new Event('change'));
    }
  }
}
