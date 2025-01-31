import placeholder from '../../assets/placeholder.webp?inline';
import getThemeValue from '../../utility/get-theme-value.ts';
import { containImage, coverTarget, ObjectFit } from '../../utility/object-fit.ts';
import CanvasControl from './canvas-control.ts';
import CanvasImage from './canvas-image.ts';
import CanvasText from './canvas-text.ts';

export default class EditorService {
  private readonly context: CanvasRenderingContext2D;
  private isEditing = false;
  private background?: string;
  private controls: CanvasControl[] = [];

  constructor(private canvas: HTMLCanvasElement) {
    const context = this.canvas.getContext('2d');

    if (!context) {
      throw Error('No canvas context!');
    }

    this.context = context;
  }

  drawEmptyBackground() {
    this.context.fillStyle = getThemeValue('--color-black-50');
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  async addImage(src: string) {
    this.isEditing = true;

    const img = new CanvasImage(this.context, {
      x: 200,
      y: 200,
    });
    await img.setImage(src);
    img.setEditable(true);

    this.controls.push(img);

    await this.draw();
  }

  async addText() {
    this.isEditing = true;

    const text = new CanvasText(this.context, {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '32px',
      lineHeight: '48px',
      fontWeight: '700',
      color: getThemeValue('--color-black-75'),
      x: 200,
      y: 200,
    });
    text.setEditable(true);

    this.controls.push(text);

    await this.draw();
  }

  async setBackground(src: string) {
    this.isEditing = true;
    this.background = src;
    await this.draw();
  }

  async draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (!this.isEditing) {
      await this.drawImage(placeholder, ObjectFit.Contain);
    } else if (this.background) {
      await this.drawImage(this.background);
    } else {
      this.drawEmptyBackground();
    }

    for (const control of this.controls) {
      await control.draw();
    }
  }

  async reset() {
    this.background = undefined;
    this.isEditing = false;
    this.controls.length = 0;
    await this.draw();
  }

  private drawImage(src: string, objectFit = ObjectFit.Cover) {
    const image = new Image();

    return new Promise<void>((resolve) => {
      image.addEventListener('load', () => {
        const params =
          objectFit === ObjectFit.Cover
            ? coverTarget(image.width, image.height, this.canvas.width, this.canvas.height)
            : containImage(image.width, image.height, this.canvas.width, this.canvas.height);

        this.context.drawImage(image, ...params);

        resolve();
      });

      image.src = src;
    });
  }
}
