import CanvasTextControl, { CanvasTextControlProps } from './canvas-text-control.ts';
import CanvasTextarea from './canvas-textarea.ts';
import EventManager from './event-manager.ts';
import TextColorPicker from './text-color-picker.ts';
import TransformBox from './transform-box.ts';

export default class CanvasText extends CanvasTextControl {
  private isEditable: boolean = false;
  private content: string[][] = [];
  private input: CanvasTextarea;
  private transformBox?: TransformBox;
  private textColorPicker?: TextColorPicker;

  constructor(context: CanvasRenderingContext2D, eventManager: EventManager, props: CanvasTextControlProps) {
    super(context, eventManager, props);

    this.context.font = `${this.fontWeight} ${this.fontSize}/${this.lineHeight} ${this.fontFamily}`;
    this.context.textAlign = 'center';
    this.context.textBaseline = 'top';

    this.input = this.factory.create(CanvasTextarea, props);

    this.handleTransformStart = this.handleTransformStart.bind(this);
  }

  destructor() {
    this.input.hide();
    super.destructor();
  }

  setEditable(editable: boolean) {
    if (editable) {
      this.transformBox = this.factory.create(TransformBox, {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
        controls: this,
      });

      this.textColorPicker = this.factory.create(TextColorPicker, {
        x: this.x,
        y: this.transformBox.boundary.bottom + 8,
      });
      this.textColorPicker.addEventListener('change', async (event) => {
        if (event.target && event.target instanceof TextColorPicker && event.target.value) {
          this.color = event.target.value;
          this.input.setColor(event.target.value);
          this.dispatchEvent(new Event('change'));
        }
      });

      this.transformBox.children.push(this.textColorPicker);
      this.transformBox.addEventListener('transformstart', this.handleTransformStart);

      this.children.push(this.transformBox);
      this.input.show();
      this.isEditable = true;
    } else {
      this.content = this.fitText(this.input.value);
      this.transformBox?.removeEventListener('transformstart', this.handleTransformStart);
      this.children.length = 0;
      this.input.hide();
      this.isEditable = false;
    }
  }

  async draw() {
    if (this.isEditable) {
      await this.input.draw();
    } else {
      for (let i = 0; i < this.content.length; i++) {
        const line = this.content[i];
        const text = line.join(' ');
        const textMetrics = this.context.measureText(text);
        const y = this.y + this.paddingY + textMetrics.fontBoundingBoxAscent + i * parseInt(this.lineHeight);

        if (y >= this.boundary.bottom) {
          break;
        }

        this.context.fillStyle = this.color;
        this.context.fillText(text, this.x + this.width / 2, y);
      }
    }
    await super.draw();
  }

  override move(deltaX: number, deltaY: number) {
    super.move(deltaX, deltaY);
    this.input.move(deltaX, deltaY);
  }

  override resize(deltaWidth: number, deltaHeight: number) {
    super.resize(deltaWidth, deltaHeight);
    this.input.resize(deltaWidth, deltaHeight);

    if (this.transformBox && this.textColorPicker) {
      this.textColorPicker.move(0, deltaHeight);
    }
  }

  private handleTransformStart(event: Event) {
    this.input.control.style.setProperty('pointer-events', 'none');

    event.target?.addEventListener(
      'trasnformend',
      () => {
        this.input.control.style.removeProperty('pointer-events');
      },
      { once: true },
    );
  }

  private fitText(text: string) {
    const content = text.split('\n').map((line) => line.split(' '));
    let wordBreaking = false;

    for (let i = 0; i < content.length; i++) {
      const line = content[i];
      wordBreaking = false;

      while (this.context.measureText(line.join(' ')).width > this.width - this.paddingX * 2) {
        if (!content[i + 1]) {
          content[i + 1] = [];
        }

        if (line.length === 1) {
          const letters = line[0].split('');

          if (!wordBreaking) {
            content.splice(i + 1, 0, [letters.pop()!]);
            wordBreaking = true;
          } else {
            content[i + 1][0] = `${letters.pop()!}${content[i + 1][0]}`;
          }

          line[0] = letters.join('');
          continue;
        }

        content[i + 1].unshift(line.pop()!);
      }
    }

    return content;
  }
}
