import deleteIcon from '@assets/icons/delete.svg?raw';
import moveIcon from '@assets/icons/move.svg?raw';
import fromEuclideanToPolar from '@utility/from-euclidean-to-polar.ts';
import getThemeValue from '@utility/get-theme-value.ts';

import CanvasButton from './canvas-button.ts';
import CanvasControl, { CanvasControlProps } from './canvas-control.ts';
import CanvasIcon from './canvas-icon.ts';
import EventManager from './event-manager.ts';

export interface TransformBoxProps extends CanvasControlProps {
  controls?: CanvasControl;
}

export default class TransformBox extends CanvasControl {
  private readonly controls?: CanvasControl;

  constructor(context: CanvasRenderingContext2D, eventManager: EventManager, props?: TransformBoxProps) {
    super(context, eventManager, props);

    if (props?.controls) {
      this.controls = props.controls;
    }

    this.handleMoveMove = this.handleMoveMove.bind(this);
    this.handleResizeMove = this.handleResizeMove.bind(this);

    const moveButton = this.factory.create(
      CanvasButton,
      { x: this.boundary.left - 20, y: this.boundary.top - 20, width: 40, height: 40 },
      [this.factory.create(CanvasIcon, { content: moveIcon, color: getThemeValue('--color-primary') })],
    );

    const deleteButton = this.factory.create(
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
    );

    const resizeButton = this.factory.create(
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
    );

    this.children = [moveButton, deleteButton, resizeButton];

    moveButton.addEventListener('pointerdown', this.handleMoveDown.bind(this));
    deleteButton.addEventListener('click', this.handleDelete.bind(this));
    resizeButton.addEventListener('pointerdown', this.handleResizeDown.bind(this));
  }

  async draw() {
    const oldStyle = this.context.strokeStyle;
    this.context.lineWidth = 2;
    this.context.strokeStyle = getThemeValue('--color-primary');
    this.context.strokeRect(this.x, this.y, this.width, this.height);
    this.context.strokeStyle = oldStyle;

    await super.draw();
  }

  override resize(deltaWidth: number, deltaHeight: number) {
    this.width += deltaWidth;
    this.height += deltaHeight;
    this.children[2].move(deltaWidth, deltaHeight);
    this.children[1].move(deltaWidth, 0);
    this.dispatchEvent(new Event('change'));
  }

  private handleMoveDown() {
    this.eventManager.canvas.addEventListener('pointermove', this.handleMoveMove);
    this.eventManager.canvas.addEventListener('pointerup', this.handleMoveUp.bind(this), { once: true });
    this.dispatchEvent(new Event('transformstart'));
  }

  private handleMoveMove(event: PointerEvent) {
    if (!this.controls) {
      return;
    }

    this.controls.move(event.movementX, event.movementY);
  }

  private handleMoveUp() {
    this.eventManager.canvas.removeEventListener('pointermove', this.handleMoveMove);
    this.dispatchEvent(new Event('transformend'));
  }

  private handleResizeDown() {
    this.eventManager.canvas.addEventListener('pointermove', this.handleResizeMove);
    this.eventManager.canvas.addEventListener('pointerup', this.handleResizeUp.bind(this), { once: true });
    this.dispatchEvent(new Event('transformstart'));
  }

  private handleResizeMove(event: PointerEvent) {
    if (!this.controls) {
      return;
    }

    this.controls.resize(event.movementX, event.movementY);
  }

  private handleResizeUp() {
    this.eventManager.canvas.removeEventListener('pointermove', this.handleResizeMove);
    this.dispatchEvent(new Event('transformend'));
  }

  private handleDelete() {
    this.controls?.dispatchEvent(new Event('remove'));
  }
}
