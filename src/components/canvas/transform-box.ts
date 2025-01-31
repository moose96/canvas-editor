import deleteIcon from '../../assets/icons/delete.svg?raw';
import moveIcon from '../../assets/icons/move.svg?raw';
import fromEuclideanToPolar from '../../utility/from-euclidean-to-polar.ts';
import getThemeValue from '../../utility/get-theme-value.ts';
import CanvasButton from './canvas-button.ts';
import CanvasControl, { CanvasControlProps } from './canvas-control.ts';
import CanvasIcon from './canvas-icon.ts';

export default class TransformBox extends CanvasControl {
  constructor(context: CanvasRenderingContext2D, props?: CanvasControlProps) {
    super(context, props);

    this.children = [
      this.factory.create(
        CanvasButton,
        { x: this.boundary.left - 20, y: this.boundary.top - 20, width: 40, height: 40 },
        [this.factory.create(CanvasIcon, { content: moveIcon, color: getThemeValue('--color-primary') })],
      ),
      this.factory.create(
        CanvasButton,
        { x: this.boundary.right - 12, y: this.boundary.top - 12, width: 24, height: 24 },
        [
          this.factory.create(CanvasIcon, {
            content: deleteIcon,
            color: getThemeValue('--color-red'),
            width: 18,
            height: 18,
          }),
        ],
      ),
      this.factory.create(
        CanvasButton,
        {
          x: this.boundary.right - 12,
          y: this.boundary.bottom - 12,
          width: 24,
          height: 24,
        },
        [
          (control) => {
            const { x, y, radius } = fromEuclideanToPolar(control.x + 4, control.y + 4, 16, 16);
            context.fillStyle = getThemeValue('--color-primary');
            context.beginPath();
            context.arc(x, y, radius, 0, 2 * Math.PI);
            context.fill();
          },
        ],
      ),
    ];
  }

  async draw() {
    const oldStyle = this.context.strokeStyle;
    this.context.lineWidth = 2;
    this.context.strokeStyle = getThemeValue('--color-primary');
    this.context.strokeRect(this.x, this.y, this.width, this.height);
    this.context.strokeStyle = oldStyle;

    await super.draw();
  }
}
