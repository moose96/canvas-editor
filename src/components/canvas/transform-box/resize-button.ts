import CanvasButton from '@components/canvas/canvas-button.ts';
import CanvasControl, { CanvasControlProps } from '@components/canvas/canvas-control.ts';
import EventManager from '@components/canvas/event-manager.ts';
import fromEuclideanToPolar from '@utility/from-euclidean-to-polar.ts';
import getThemeValue from '@utility/get-theme-value.ts';
import { NC, NCC } from '@utility/relative-numbers.ts';
import RelativeNumbersConverter from '@utility/relative-numbers-converter.ts';

export interface ResizeButtonProps extends CanvasControlProps {
  controls?: CanvasControl;
  boundary?: DOMRect;
}

export default class ResizeButton extends CanvasButton {
  private readonly controls?: CanvasControl;

  constructor(
    context: CanvasRenderingContext2D,
    converter: RelativeNumbersConverter,
    eventManager: EventManager,
    props?: ResizeButtonProps,
  ) {
    super(context, converter, eventManager, props);

    this.controls = props?.controls;

    const buttonSize = this.converter.fromCanvasToCanvasContext(NC`24`);
    const right = props?.boundary?.right ?? 0;
    const bottom = props?.boundary?.bottom ?? 0;

    this.x = NCC`${right - buttonSize / 2}`;
    this.y = NCC`${bottom - buttonSize / 2}`;
    this.width = buttonSize;
    this.height = buttonSize;

    this.children = [
      (control) => {
        const controlSize = this.converter.fromCanvasToCanvasContext(NC`16`);
        const halfWidth = NCC`${(control.width - controlSize) / 2}`;

        const { x, y, radius } = fromEuclideanToPolar(
          control.x + halfWidth,
          control.y + halfWidth,
          controlSize,
          controlSize,
        );
        context.fillStyle = getThemeValue('--color-primary');
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI);
        context.fill();
      },
    ];

    this.handleResizeMove = this.handleResizeMove.bind(this);
    this.addEventListener('pointerdown', this.handleResizeDown.bind(this));
  }

  private handleResizeDown() {
    this.eventManager.canvas.addEventListener('pointermove', this.handleResizeMove);
    this.eventManager.canvas.addEventListener('pointerup', this.handleResizeUp.bind(this), { once: true });
    this.controls?.dispatchEvent(new Event('transformstart'));
  }

  private handleResizeMove(event: PointerEvent) {
    if (!this.controls) {
      return;
    }

    this.controls.resize(
      this.converter.fromCanvasToCanvasContext(NC`${event.movementX}`),
      this.converter.fromCanvasToCanvasContext(NC`${event.movementY}`),
    );
  }

  private handleResizeUp() {
    this.eventManager.canvas.removeEventListener('pointermove', this.handleResizeMove);
    this.controls?.dispatchEvent(new Event('transformend'));
  }
}
