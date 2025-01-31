import CanvasControl, { CanvasControlProps } from './canvas-control.ts';
import TransformBox from './transform-box.ts';

export default class CanvasImage extends CanvasControl {
  private image?: HTMLImageElement;

  constructor(
    protected context: CanvasRenderingContext2D,
    props: CanvasControlProps,
  ) {
    super(context, props);
  }

  async setImage(src: string) {
    return new Promise<void>((resolve) => {
      this.image = new Image();

      this.image.addEventListener('load', () => {
        if (!this.image) {
          return;
        }

        this.width = this.image.width;
        this.height = this.image.height;

        resolve();
      });

      this.image.src = src;
    });
  }

  setEditable(editable: boolean) {
    if (editable) {
      this.children.push(
        new TransformBox(this.context, {
          x: this.x,
          y: this.y,
          width: this.width,
          height: this.height,
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

    this.context.drawImage(this.image, this.x, this.y);
    await super.draw();
  }
}
