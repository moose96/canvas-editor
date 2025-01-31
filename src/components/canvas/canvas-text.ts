import CanvasControl, { CanvasControlProps } from './canvas-control.ts';
import TransformBox from './transform-box.ts';

export interface CanvasTextProps extends CanvasControlProps {
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
  fontWeight: string;
  color: string;
}

export default class CanvasText extends CanvasControl {
  public fontFamily: string;
  public fontSize: string;
  public lineHeight: string;
  public fontWeight: string;
  private color: string;
  private content: string = 'Type your text here';

  constructor(
    protected context: CanvasRenderingContext2D,
    props: CanvasTextProps,
  ) {
    super(context, props);

    this.fontFamily = props.fontFamily;
    this.fontSize = props.fontSize;
    this.lineHeight = props.lineHeight;
    this.fontWeight = props.fontWeight;
    this.color = props.color;

    this.context.font = `${this.fontWeight} ${this.fontSize}/${this.lineHeight} ${this.fontFamily}`;
    this.context.textBaseline = 'top';

    this.width = this.context.measureText(this.content).width;
    this.height = parseInt(this.fontSize);
  }

  setContent(text: string) {
    this.content = text;
    this.width = this.context.measureText(this.content).width;
  }

  setColor(color: string) {
    this.color = color;
  }

  setEditable(editable: boolean) {
    const paddingX = 24;
    const paddingY = 12;

    if (editable) {
      this.children.push(
        new TransformBox(this.context, {
          x: this.x - paddingX,
          y: this.y - paddingY,
          width: this.context.measureText(this.content).width + 2 * paddingX,
          height: parseInt(this.fontSize) + 2 * paddingY,
        }),
      );
    } else {
      this.children.length = 0;
    }
  }

  async draw() {
    this.context.fillStyle = this.color;
    this.context.fillText(this.content, this.x, this.y);
    await super.draw();
  }
}
