import { IEditable } from '@components/canvas/models/editable.ts';
import createFontProperty from '@utility/create-font-property.ts';
import getThemeValue from '@utility/get-theme-value.ts';
import { NC, NCC, NumberCanvasContext } from '@utility/relative-numbers.ts';
import RelativeNumbersConverter from '@utility/relative-numbers-converter.ts';

import CanvasTextControl, { CanvasTextControlProps } from '../models/canvas-text-control.ts';
import EventManager from '../models/event-manager.ts';
import CanvasTextarea from './canvas-textarea.ts';
import TextColorPicker from './text-color-picker.ts';
import TransformBox from './transform-box/transform-box.ts';

export default class CanvasText extends CanvasTextControl implements IEditable {
  private isEditable: boolean = false;
  private content: string[][] = [];
  private input: CanvasTextarea;
  private transformBox?: TransformBox;
  private textColorPicker?: TextColorPicker;

  constructor(
    context: CanvasRenderingContext2D,
    converter: RelativeNumbersConverter,
    eventManager: EventManager,
    props: CanvasTextControlProps,
  ) {
    super(context, converter, eventManager, props);

    this.context.font = createFontProperty(this.fontFamily, this.fontSize, this.lineHeight, this.fontWeight);
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
        y: NCC`${this.transformBox.boundary.bottom + this.converter.fromCanvasToCanvasContext(NC`8`)}`,
      });
      this.textColorPicker.addEventListener('change', async (event) => {
        if (event.target && event.target instanceof TextColorPicker && event.target.value) {
          this.color = event.target.value;
          this.input.setColor(event.target.value);
          this.dispatchEvent(new Event('change'));
        }
      });
      this.textColorPicker.setValue(getThemeValue('--color-black-100'));

      this.transformBox.children.push(this.textColorPicker);
      this.addEventListener('transformstart', this.handleTransformStart);

      this.children.push(this.transformBox);
      this.input.show();
      this.isEditable = true;
    } else {
      this.content = this.fitText(this.input.value);
      this.removeEventListener('transformstart', this.handleTransformStart);
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
        const y =
          this.y +
          this.paddingY +
          textMetrics.fontBoundingBoxAscent +
          i * this.converter.fromCanvasToCanvasContext(this.lineHeight);

        if (y >= this.boundary.bottom) {
          break;
        }

        this.context.fillStyle = this.color;
        this.context.fillText(text, this.x + this.width / 2, y);
      }
    }
    await super.draw();
  }

  override move(deltaX: NumberCanvasContext, deltaY: NumberCanvasContext) {
    super.move(deltaX, deltaY);
    this.input.move(deltaX, deltaY);
  }

  override resize(deltaWidth: NumberCanvasContext, deltaHeight: NumberCanvasContext) {
    super.resize(deltaWidth, deltaHeight);
    this.input.resize(deltaWidth, deltaHeight);

    if (this.transformBox && this.textColorPicker) {
      this.textColorPicker.move(NCC`0`, deltaHeight);
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
