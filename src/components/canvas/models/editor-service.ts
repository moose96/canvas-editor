import placeholder from '@assets/placeholder.webp?inline';
import { isEditable } from '@components/canvas/models/editable.ts';
import getThemeValue from '@utility/get-theme-value.ts';
import { containImage, coverTarget, ObjectFit } from '@utility/object-fit.ts';
import { NC } from '@utility/relative-numbers.ts';
import RelativeNumbersConverter from '@utility/relative-numbers-converter.ts';

import CanvasImage from '../components/canvas-image.ts';
import CanvasText from '../components/canvas-text.ts';
import CanvasControl from './canvas-control.ts';
import EventManager from './event-manager.ts';

export default class EditorService {
  private readonly context: CanvasRenderingContext2D;
  private isEditing = false;
  private placeholder?: HTMLImageElement;
  private background?: HTMLImageElement;
  private controls: Set<CanvasControl> = new Set();
  private readonly converter: RelativeNumbersConverter;
  private readonly eventManager: EventManager;

  private constructor(private canvas: HTMLCanvasElement) {
    const context = this.canvas.getContext('2d');

    if (!context) {
      throw Error('No canvas context!');
    }

    this.context = context;
    this.converter = new RelativeNumbersConverter(this.canvas);
    this.eventManager = new EventManager(this.canvas, this.converter);
  }

  drawEmptyBackground() {
    this.context.fillStyle = getThemeValue('--color-black-50');
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  async addImage(src: string) {
    this.isEditing = true;

    const img = new CanvasImage(this.context, this.converter, this.eventManager, {
      x: this.converter.fromCanvasToCanvasContext(NC`200`),
      y: this.converter.fromCanvasToCanvasContext(NC`200`),
    });
    await img.setImage(src);
    img.setEditable(true);
    img.addEventListener(
      'remove',
      async () => {
        this.controls.delete(img);
        await this.draw();
      },
      { once: true },
    );
    img.addEventListener('change', async () => await this.draw());

    this.controls.add(img);

    await this.draw();
  }

  async addText() {
    this.isEditing = true;

    const text = new CanvasText(this.context, this.converter, this.eventManager, {
      fontFamily: 'Poppins, sans-serif',
      fontSize: NC`${32}`,
      lineHeight: NC`${48}`,
      fontWeight: '700',
      color: getThemeValue('--color-black-75'),
      x: this.converter.fromCanvasToCanvasContext(NC`${200}`),
      y: this.converter.fromCanvasToCanvasContext(NC`${200}`),
      width: this.converter.fromCanvasToCanvasContext(NC`${350}`),
      height: this.converter.fromCanvasToCanvasContext(NC`${120}`),
      paddingX: this.converter.fromCanvasToCanvasContext(NC`${24}`),
      paddingY: this.converter.fromCanvasToCanvasContext(NC`${12}`),
    });
    text.setEditable(true);
    text.addEventListener(
      'remove',
      async () => {
        text.destructor();
        this.controls.delete(text);
        await this.draw();
      },
      { once: true },
    );
    text.addEventListener('change', async () => await this.draw());

    this.controls.add(text);

    await this.draw();
  }

  async setBackground(src: string) {
    this.isEditing = true;
    this.background = await this.loadImage(src);
    await this.draw();
  }

  async draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (!this.isEditing && this.placeholder) {
      this.drawImage(this.placeholder, ObjectFit.Contain);
    } else if (this.background) {
      this.drawImage(this.background);
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
    this.controls.forEach((control) => {
      control.destructor();
      this.controls.delete(control);
    });
    await this.draw();
  }

  async export() {
    this.controls.forEach((control) => {
      if (isEditable(control)) {
        control.setEditable(false);
      }
    });

    await this.draw();

    const data = this.canvas.toDataURL();
    const link = document.createElement('a');
    link.href = data;
    link.download = 'poster.png';
    link.setAttribute('crossorigin', 'anonymous');
    link.click();
  }

  private loadImage(src: string) {
    return new Promise<HTMLImageElement>((resolve) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.crossOrigin = 'anonymous';
      image.src = src;
    });
  }

  private drawImage(image: HTMLImageElement, objectFit = ObjectFit.Cover) {
    const params =
      objectFit === ObjectFit.Cover
        ? coverTarget(image.width, image.height, this.canvas.width, this.canvas.height)
        : containImage(image.width, image.height, this.canvas.width, this.canvas.height);

    this.context.drawImage(image, ...params);
  }

  static async create(canvas: HTMLCanvasElement) {
    const service = new EditorService(canvas);
    service.placeholder = await service.loadImage(placeholder);
    return service;
  }
}
