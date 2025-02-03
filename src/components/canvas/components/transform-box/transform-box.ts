import DeleteButton from '@components/canvas/components/transform-box/delete-button.ts';
import MoveButton from '@components/canvas/components/transform-box/move-button.ts';
import ResizeButton from '@components/canvas/components/transform-box/resize-button.ts';
import getThemeValue from '@utility/get-theme-value.ts';
import { NCC, NumberCanvasContext } from '@utility/relative-numbers.ts';
import RelativeNumbersConverter from '@utility/relative-numbers-converter.ts';

import CanvasControl, { CanvasControlProps } from '../../models/canvas-control.ts';
import EventManager from '../../models/event-manager.ts';

export interface TransformBoxProps extends CanvasControlProps {
  controls?: CanvasControl;
}

export default class TransformBox extends CanvasControl {
  private readonly moveButton: MoveButton;
  private readonly deleteButton: DeleteButton;
  private readonly resizeButton: ResizeButton;

  constructor(
    context: CanvasRenderingContext2D,
    converter: RelativeNumbersConverter,
    eventManager: EventManager,
    props?: TransformBoxProps,
  ) {
    super(context, converter, eventManager, props);

    this.moveButton = this.factory.create(MoveButton, { controls: props?.controls, boundary: this.boundary });
    this.deleteButton = this.factory.create(DeleteButton, { controls: props?.controls, boundary: this.boundary });
    this.resizeButton = this.factory.create(ResizeButton, { controls: props?.controls, boundary: this.boundary });

    this.children = [this.moveButton, this.deleteButton, this.resizeButton];
  }

  async draw() {
    const oldStyle = this.context.strokeStyle;
    this.context.lineWidth = 2;
    this.context.strokeStyle = getThemeValue('--color-primary');
    this.context.strokeRect(this.x, this.y, this.width, this.height);
    this.context.strokeStyle = oldStyle;

    await super.draw();
  }

  override resize(deltaWidth: NumberCanvasContext, deltaHeight: NumberCanvasContext) {
    this.width = NCC`${this.width + deltaWidth}`;
    this.height = NCC`${this.height + deltaHeight}`;
    this.resizeButton.move(deltaWidth, deltaHeight);
    this.deleteButton.move(deltaWidth, NCC`0`);
    this.dispatchEvent(new Event('change'));
  }
}
