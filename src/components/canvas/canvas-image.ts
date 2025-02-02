import { IEditable } from '@components/canvas/editable.ts';
import { NCC, NumberCanvasContext } from '@utility/relative-numbers.ts';

import CanvasControl from './canvas-control.ts';
import TransformBox from './transform-box/transform-box.ts';

const initialWidth = NCC`${300}`;

export default class CanvasImage extends CanvasControl implements IEditable {
  private image?: HTMLImageElement;
  private aspectRatio: number = 1;

  async setImage(src: string) {
    return new Promise<void>((resolve) => {
      this.image = new Image();

      this.image.addEventListener('load', () => {
        if (!this.image) {
          return;
        }

        this.aspectRatio = this.image.width / this.image.height;

        this.width = initialWidth;
        this.height = NCC`${initialWidth / this.aspectRatio}`;

        resolve();
      });

      this.image.crossOrigin = 'anonymous';
      this.image.src = src;
    });
  }

  setEditable(editable: boolean) {
    if (editable) {
      this.children.push(
        new TransformBox(this.context, this.converter, this.eventManager, {
          x: this.x,
          y: this.y,
          width: this.width,
          height: this.height,
          controls: this,
        }),
      );
    } else {
      this.children.length = 0;
    }
  }

  async draw() {
    if (!this.image) {
      return;
    }

    this.context.drawImage(this.image, this.x, this.y, this.width, this.height);
    await super.draw();
  }

  override resize(deltaWidth: NumberCanvasContext, deltaHeight: NumberCanvasContext) {
    super.resize(deltaWidth, deltaHeight);
    const newHeight = this.width / this.aspectRatio;
    super.resize(NCC`0`, NCC`${newHeight - this.height}`);
  }
}
