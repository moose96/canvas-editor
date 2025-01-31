import CanvasControlFactory from './canvas-control-factory.ts';

export interface CanvasControlProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  [key: string]: any;
}

export default class CanvasControl extends EventTarget {
  public x: number = 0;
  public y: number = 0;
  public width: number = 0;
  public height: number = 0;
  public children: (CanvasControl | ((control: CanvasControl) => void))[] = [];
  protected factory: CanvasControlFactory;

  constructor(
    protected context: CanvasRenderingContext2D,
    props?: CanvasControlProps,
  ) {
    super();

    this.factory = new CanvasControlFactory(context);

    if (props) {
      this.x = props.x ?? 0;
      this.y = props.y ?? 0;
      this.width = props.width ?? 0;
      this.height = props.height ?? 0;
    }
  }

  get boundary() {
    return new DOMRect(this.x, this.y, this.width, this.height);
  }

  async draw() {
    this.children.forEach((child) => {
      if (typeof child === 'function') {
        child(this);
        return;
      }

      child.draw();
    });
  }
}
