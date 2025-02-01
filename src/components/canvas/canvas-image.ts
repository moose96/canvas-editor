import CanvasControl, { CanvasControlProps } from './canvas-control.ts';
import EventManager from './event-manager.ts';
import TransformBox from './transform-box.ts';

export default class CanvasImage extends CanvasControl {
  private image?: HTMLImageElement;

  constructor(context: CanvasRenderingContext2D, eventManager: EventManager, props: CanvasControlProps) {
    super(context, eventManager, props);
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
        new TransformBox(this.context, this.eventManager, {
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
}
