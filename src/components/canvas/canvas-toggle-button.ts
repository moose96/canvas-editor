import fromEuclideanToPolar from '../../utility/from-euclidean-to-polar.ts';
import getThemeValue from '../../utility/get-theme-value.ts';
import CanvasControl, { CanvasControlProps } from './canvas-control.ts';
import EventManager from './event-manager.ts';

export interface CanvasToggleButtonProps extends CanvasControlProps {
  name: string;
}

export default class CanvasToggleButton extends CanvasControl {
  public value = false;
  public name: string;

  constructor(context: CanvasRenderingContext2D, eventManager: EventManager, props?: CanvasToggleButtonProps) {
    super(context, eventManager, props);

    this.name = props?.name ?? '';
    this.addEventListener('click', this.handleClick.bind(this));
  }

  async draw() {
    if (this.value) {
      const { x, y, radius } = fromEuclideanToPolar(this.x, this.y, this.width, this.height);
      this.context.strokeStyle = getThemeValue('--color-white');
      this.context.lineWidth = 2;
      this.context.beginPath();
      this.context.arc(x, y, radius, 0, 2 * Math.PI);
      this.context.stroke();
    }
    await super.draw();
  }

  private async handleClick() {
    this.value = !this.value;
    await this.draw();
  }
}
