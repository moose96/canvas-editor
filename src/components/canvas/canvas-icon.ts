import { Canvg, Property } from 'canvg';

import CanvasControl, { CanvasControlProps } from './canvas-control.ts';

export interface CanvasIconProps extends CanvasControlProps {
  content?: string;
  color?: string;
}

export default class CanvasIcon extends CanvasControl {
  private readonly icon?: Canvg;

  constructor(context: CanvasRenderingContext2D, { content, color, ...props }: CanvasIconProps = {}) {
    super(context, props);

    if (content) {
      this.icon = Canvg.fromString(this.context, content, { ignoreDimensions: true, ignoreClear: true });

      const canvgDocument = this.icon.document;
      const documentElement = canvgDocument.documentElement;

      if (this.width === 0) {
        this.width = documentElement?.getStyle('width').getPixels() ?? 0;
      }

      if (this.height === 0) {
        this.height = documentElement?.getStyle('height').getPixels() ?? 0;
      }

      if (color && documentElement) {
        documentElement.styles.color = new Property(canvgDocument, 'color', color);
      }
    }
  }

  async draw() {
    if (!this.icon) return;

    this.icon.document.documentElement?.resize(this.width, this.height);

    await this.icon.render({ offsetX: this.x, offsetY: this.y });
  }
}
