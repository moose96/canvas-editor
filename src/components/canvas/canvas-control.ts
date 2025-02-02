import CanvasControlFactory from './canvas-control-factory.ts';
import EventManager, { CollisionShape } from './event-manager.ts';

export interface CanvasControlProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  paddingX?: number;
  paddingY?: number;
  [key: string]: unknown;
}

export default class CanvasControl extends EventTarget {
  public x: number = 0;
  public y: number = 0;
  public width: number = 0;
  public height: number = 0;
  public paddingX: number = 0;
  public paddingY: number = 0;
  public children: (CanvasControl | ((control: CanvasControl) => void))[] = [];
  public collisionShape: CollisionShape = CollisionShape.Rectangle;
  protected factory: CanvasControlFactory;

  constructor(
    protected context: CanvasRenderingContext2D,
    protected eventManager: EventManager,
    props?: CanvasControlProps,
  ) {
    super();

    eventManager.register(this);
    this.factory = new CanvasControlFactory(context, eventManager);

    if (props) {
      this.x = props.x ?? 0;
      this.y = props.y ?? 0;
      this.width = props.width ?? 0;
      this.height = props.height ?? 0;
      this.paddingX = props.paddingX ?? 0;
      this.paddingY = props.paddingY ?? 0;
    }
  }

  destructor() {
    this.eventManager.unregister(this);
    this.children.forEach((child) => {
      if (typeof child !== 'function') {
        child.destructor();
      }
    });
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

  move(deltaX: number, deltaY: number) {
    this.x += deltaX;
    this.y += deltaY;

    this.children.forEach((child) => {
      if (typeof child === 'function') {
        return;
      }

      child.move(deltaX, deltaY);
    });

    this.dispatchEvent(new Event('change'));
  }

  resize(deltaWidth: number, deltaHeight: number) {
    this.width += deltaWidth;
    this.height += deltaHeight;

    this.children.forEach((child) => {
      if (typeof child === 'function') {
        return;
      }

      child.resize(deltaWidth, deltaHeight);
    });

    this.dispatchEvent(new Event('change'));
  }
}
