import deleteIcon from '@assets/icons/delete.svg?raw';
import CanvasButton from '@components/canvas/canvas-button.ts';
import CanvasControl, { CanvasControlProps } from '@components/canvas/canvas-control.ts';
import CanvasIcon from '@components/canvas/canvas-icon.ts';
import EventManager from '@components/canvas/event-manager.ts';
import getThemeValue from '@utility/get-theme-value.ts';
import { NC, NCC } from '@utility/relative-numbers.ts';
import RelativeNumbersConverter from '@utility/relative-numbers-converter.ts';

export interface DeleteButtonProps extends CanvasControlProps {
  controls?: CanvasControl;
  boundary?: DOMRect;
}

export default class DeleteButton extends CanvasButton {
  private readonly controls?: CanvasControl;

  constructor(
    context: CanvasRenderingContext2D,
    converter: RelativeNumbersConverter,
    eventManager: EventManager,
    props?: DeleteButtonProps,
  ) {
    super(context, converter, eventManager, props);

    this.controls = props?.controls;

    const buttonSize = this.converter.fromCanvasToCanvasContext(NC`24`);
    const iconSize = this.converter.fromCanvasToCanvasContext(NC`18`);
    const right = props?.boundary?.right ?? 0;
    const top = props?.boundary?.top ?? 0;

    this.x = NCC`${right - buttonSize / 2}`;
    this.y = NCC`${top - buttonSize / 2}`;
    this.width = buttonSize;
    this.height = buttonSize;

    this.children = [
      this.factory.create(CanvasIcon, {
        content: deleteIcon,
        color: getThemeValue('--color-red'),
        width: iconSize,
        height: iconSize,
      }),
    ];
    this.addEventListener('click', this.handleDelete.bind(this));
  }

  private handleDelete() {
    this.controls?.dispatchEvent(new Event('remove'));
  }
}
