import CanvasTextControl, { CanvasTextControlProps } from './canvas-text-control.ts';
import EventManager from './event-manager.ts';

export default class CanvasTextarea extends CanvasTextControl {
  public visible = false;
  private readonly input: HTMLTextAreaElement;

  constructor(context: CanvasRenderingContext2D, eventManager: EventManager, props?: CanvasTextControlProps) {
    super(context, eventManager, props);

    this.input = document.createElement('textarea');
    this.input.placeholder = 'Type your text here';
    this.input.style.setProperty('position', 'absolute');
    this.input.style.setProperty('text-align', 'center');
    this.input.style.setProperty('padding', `${this.paddingY}px ${this.paddingX}px`);

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

  override move(deltaX: number, deltaY: number) {
    super.move(deltaX, deltaY);
    this.commitStyle();
  }

  override resize(deltaWidth: number, deltaHeight: number) {
    super.resize(deltaWidth, deltaHeight);
    this.commitStyle();
  }

  private commitStyle() {
    this.input.style.setProperty('left', `${this.x + this.eventManager.canvas.offsetLeft}px`);
    this.input.style.setProperty('top', `${this.y + this.eventManager.canvas.offsetTop}px`);
    this.input.style.setProperty('width', `${this.width}px`);
    this.input.style.setProperty('height', `${this.height}px`);
    this.input.style.setProperty('color', this.color);
    this.input.style.setProperty('font', `${this.fontWeight} ${this.fontSize}/${this.lineHeight} ${this.fontFamily}`);
  }
}
