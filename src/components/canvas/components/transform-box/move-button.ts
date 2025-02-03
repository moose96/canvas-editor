import moveIcon from '@assets/icons/move.svg?raw';
import CanvasButton from '@components/canvas/components/canvas-button.ts';
import CanvasIcon from '@components/canvas/components/canvas-icon.ts';
import CanvasControl, { CanvasControlProps } from '@components/canvas/models/canvas-control.ts';
import EventManager from '@components/canvas/models/event-manager.ts';
import getThemeValue from '@utility/get-theme-value.ts';
import { NC, NCC } from '@utility/relative-numbers.ts';
import RelativeNumbersConverter from '@utility/relative-numbers-converter.ts';

export interface MoveButtonProps extends CanvasControlProps {
  controls?: CanvasControl;
  boundary?: DOMRect;
}

export default class MoveButton extends CanvasButton {
  private readonly controls?: CanvasControl;

  constructor(
    context: CanvasRenderingContext2D,
    converter: RelativeNumbersConverter,
    eventManager: EventManager,
    props?: MoveButtonProps,
  ) {
    super(context, converter, eventManager, props);

    this.controls = props?.controls;

    const buttonSize = this.converter.fromCanvasToCanvasContext(NC`40`);
    const iconSize = this.converter.fromCanvasToCanvasContext(NC`32`);
    const left = props?.boundary?.left ?? 0;
    const top = props?.boundary?.top ?? 0;

    this.x = NCC`${left - buttonSize / 2}`;
    this.y = NCC`${top - buttonSize / 2}`;
    this.width = buttonSize;
    this.height = buttonSize;
    this.children = [
      this.factory.create(CanvasIcon, {
        content: moveIcon,
        width: iconSize,
        height: iconSize,
        color: getThemeValue('--color-primary'),
      }),
    ];

    this.handleMoveMove = this.handleMoveMove.bind(this);
    this.addEventListener('pointerdown', this.handleMoveDown.bind(this));
  }

  private handleMoveDown() {
    this.eventManager.canvas.addEventListener('pointermove', this.handleMoveMove);
    this.eventManager.canvas.addEventListener('pointerup', this.handleMoveUp.bind(this), { once: true });
    this.controls?.dispatchEvent(new Event('transformstart'));
  }

  private handleMoveMove(event: PointerEvent) {
    if (!this.controls) {
      return;
    }

    this.controls.move(
      this.converter.fromCanvasToCanvasContext(NC`${event.movementX}`),
      this.converter.fromCanvasToCanvasContext(NC`${event.movementY}`),
    );
  }

  private handleMoveUp() {
    this.eventManager.canvas.removeEventListener('pointermove', this.handleMoveMove);
    this.controls?.dispatchEvent(new Event('transformend'));
  }
}
