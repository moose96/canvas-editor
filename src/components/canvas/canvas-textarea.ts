import createFontProperty from '@utility/create-font-property.ts';
import { NumberCanvasContext } from '@utility/relative-numbers.ts';
import RelativeNumbersConverter, { Axis } from '@utility/relative-numbers-converter.ts';

import CanvasTextControl, { CanvasTextControlProps } from './canvas-text-control.ts';
import EventManager from './event-manager.ts';

export default class CanvasTextarea extends CanvasTextControl {
  public visible = false;
  private readonly input: HTMLTextAreaElement;

  constructor(
    context: CanvasRenderingContext2D,
    converter: RelativeNumbersConverter,
    eventManager: EventManager,
    props?: CanvasTextControlProps,
  ) {
    super(context, converter, eventManager, props);

    this.input = document.createElement('textarea');
    this.input.placeholder = 'Type your text here';
    this.input.style.setProperty('position', 'absolute');
    this.input.style.setProperty('text-align', 'center');
    this.input.style.setProperty(
      'padding',
      `${this.converter.fromCanvasContextToCanvas(this.paddingY)}px ${this.converter.fromCanvasContextToCanvas(this.paddingX)}px`,
    );

    this.commitStyle();
  }

  get control() {
    return this.input;
  }

  get value() {
    return this.input.value;
  }

  show() {
    if (this.visible) return;

    document.body.appendChild(this.input);
    this.visible = true;
  }

  hide() {
    if (!this.visible) return;

    document.body.removeChild(this.input);
    this.visible = false;
  }

  setColor(color: string) {
    this.color = color;
    this.commitStyle();
  }

  override move(deltaX: NumberCanvasContext, deltaY: NumberCanvasContext) {
    super.move(deltaX, deltaY);
    this.commitStyle();
  }

  override resize(deltaWidth: NumberCanvasContext, deltaHeight: NumberCanvasContext) {
    super.resize(deltaWidth, deltaHeight);
    this.commitStyle();
  }

  private commitStyle() {
    this.input.style.setProperty('left', `${this.converter.fromCanvasContextToViewport(this.x, Axis.X)}px`);
    this.input.style.setProperty('top', `${this.converter.fromCanvasContextToViewport(this.y, Axis.Y)}px`);
    this.input.style.setProperty('width', `${this.converter.fromCanvasContextToCanvas(this.width)}px`);
    this.input.style.setProperty('height', `${this.converter.fromCanvasContextToCanvas(this.height)}px`);
    this.input.style.setProperty('color', this.color);
    this.input.style.setProperty(
      'font',
      createFontProperty(this.fontFamily, this.fontSize, this.lineHeight, this.fontWeight),
    );
  }
}
