import { NCC, NumberCanvasContext } from '@utility/relative-numbers.ts';
import RelativeNumbersConverter from '@utility/relative-numbers-converter.ts';

import CanvasControlFactory from './canvas-control-factory.ts';
import EventManager, { CollisionShape } from './event-manager.ts';

export interface CanvasControlProps {
  x?: NumberCanvasContext;
  y?: NumberCanvasContext;
  width?: NumberCanvasContext;
  height?: NumberCanvasContext;
  paddingX?: NumberCanvasContext;
  paddingY?: NumberCanvasContext;
  [key: string]: unknown;
}

export default class CanvasControl extends EventTarget {
  public x: NumberCanvasContext = NCC`0`;
  public y: NumberCanvasContext = NCC`0`;
  public width: NumberCanvasContext = NCC`0`;
  public height: NumberCanvasContext = NCC`0`;
  public paddingX: NumberCanvasContext = NCC`0`;
  public paddingY: NumberCanvasContext = NCC`0`;
  public children: (CanvasControl | ((control: CanvasControl) => void))[] = [];

  /**
   * Shape of collision detection. It's used by EventManager
   */
  public collisionShape: CollisionShape = CollisionShape.Rectangle;

  protected factory: CanvasControlFactory;

  constructor(
    protected context: CanvasRenderingContext2D,
    protected converter: RelativeNumbersConverter,
    protected eventManager: EventManager,
    props?: CanvasControlProps,
  ) {
    super();

    eventManager.register(this);
    this.factory = new CanvasControlFactory(context, converter, eventManager);

    if (props) {
      this.x = props.x ?? NCC`0`;
      this.y = props.y ?? NCC`0`;
      this.width = props.width ?? NCC`0`;
      this.height = props.height ?? NCC`0`;
      this.paddingX = props.paddingX ?? NCC`0`;
      this.paddingY = props.paddingY ?? NCC`0`;
    }
  }

  /**
   * Cleans up the instance of CanvasControl and its children. Should be called before Garbage Collector might
   * clean up the instance
   */
  destructor() {
    this.eventManager.unregister(this);
    this.children.forEach((child) => {
      if (typeof child !== 'function') {
        child.destructor();
      }
    });
  }

  /**
   * Returns DOMRect boundary of the CanvasControl
   */
  get boundary() {
    return new DOMRect(this.x, this.y, this.width, this.height);
  }

  /**
   * Draws the children of the CanvasControl. This method should be overridden in subclasses
   */
  async draw() {
    this.children.forEach((child) => {
      if (typeof child === 'function') {
        child(this);
        return;
      }

      child.draw();
    });
  }

  /**
   * Moves the CanvasControl of given values
   *
   * @param deltaX
   * @param deltaY
   */
  move(deltaX: NumberCanvasContext, deltaY: NumberCanvasContext) {
    this.x = NCC`${this.x + deltaX}`;
    this.y = NCC`${this.y + deltaY}`;

    this.children.forEach((child) => {
      if (typeof child === 'function') {
        return;
      }

      child.move(deltaX, deltaY);
    });

    this.dispatchEvent(new Event('change'));
  }

  /**
   * Resizes the CanvasControl of given values
   *
   * @param deltaWidth
   * @param deltaHeight
   */
  resize(deltaWidth: NumberCanvasContext, deltaHeight: NumberCanvasContext) {
    this.width = NCC`${this.width + deltaWidth}`;
    this.height = NCC`${this.height + deltaHeight}`;

    this.children.forEach((child) => {
      if (typeof child === 'function') {
        return;
      }

      child.resize(deltaWidth, deltaHeight);
    });

    this.dispatchEvent(new Event('change'));
  }
}
