import CanvasControl, { CanvasControlProps } from './canvas-control.ts';
import EventManager from './event-manager.ts';
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
  private content: string[][] = [['Type', 'your', 'text', 'here']];

  constructor(context: CanvasRenderingContext2D, eventManager: EventManager, props: CanvasTextProps) {
    super(context, eventManager, props);

    this.fontFamily = props.fontFamily;
    this.fontSize = props.fontSize;
    this.lineHeight = props.lineHeight;
    this.fontWeight = props.fontWeight;
    this.color = props.color;

    this.context.font = `${this.fontWeight} ${this.fontSize}/${this.lineHeight} ${this.fontFamily}`;
    this.context.textAlign = 'center';
    this.context.textBaseline = 'top';

    this.width = this.context.measureText(this.content.join(' ')).width;
    this.height = parseInt(this.fontSize);
  }

  getContent() {
    return this.content.flat().join(' ');
  }

  setContent(text: string) {
    this.content = this.fitText(text);
  }

  setColor(color: string) {
    this.color = color;
  }

  setEditable(editable: boolean) {
    const paddingX = 24;
    const paddingY = 12;

    if (editable) {
      this.children.push(
        new TransformBox(this.context, this.eventManager, {
          x: this.x - paddingX,
          y: this.y - paddingY,
          width: this.width + 2 * paddingX,
          height: parseInt(this.fontSize) + 2 * paddingY,
          controls: this,
        }),
      );
    } else {
      this.children.length = 0;
    }
  }

  async draw() {
    this.context.fillStyle = this.color;

    this.content.forEach((line, index) => {
      this.context.fillText(line.join(' '), this.x + this.width / 2, this.y + index * parseInt(this.lineHeight));
    });

    await super.draw();
  }

  override resize(deltaWidth: number, deltaHeight: number) {
    this.setContent(this.getContent());
    super.resize(deltaWidth, deltaHeight);
  }

  private fitText(text: string) {
    const content = [text.split(' ')];

    for (let i = 0; i < content.length; i++) {
      const line = content[i];
      while (this.context.measureText(line.join(' ')).width > this.width) {
        if (!content[i + 1]) {
          content[i + 1] = [];
        }
        const word = line.pop();

        if (!word) {
          // should break word
          break;
        }

        content[i + 1].unshift(word);
      }
    }

    return content;
  }
}
