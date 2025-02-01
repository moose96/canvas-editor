import distanceBetween, { Point2D } from '../../utility/distance-between.ts';
import fromEuclideanToPolar from '../../utility/from-euclidean-to-polar.ts';
import CanvasControl from './canvas-control.ts';

export enum CollisionShape {
  Circle,
  Rectangle,
}

export default class EventManager {
  private controls: CanvasControl[] = [];

  constructor(public canvas: HTMLCanvasElement) {
    this.canvas.addEventListener('click', this.handleEvent.bind(this));
    this.canvas.addEventListener('pointerdown', this.handleEvent.bind(this));
    this.canvas.addEventListener('pointerup', this.handleEvent.bind(this));
    this.canvas.addEventListener('pointermove', this.handleEvent.bind(this));
    this.canvas.addEventListener('keydown', this.handleKeyDown.bind(this));
    this.canvas.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  register(control: CanvasControl) {
    this.controls.push(control);
  }

  private handleEvent(event: MouseEvent | PointerEvent) {
    const pointer = { x: event.offsetX, y: event.offsetY };
    for (const control of this.checkCollisions(pointer)) {
      control.dispatchEvent(new Event(event.type));
    }
  }

  private handleKeyDown() {}

  private handleKeyUp() {}

  private *checkCollisions(pointer: Point2D) {
    for (const control of this.controls) {
      switch (control.collisionShape) {
        case CollisionShape.Circle:
          if (this.checkCircleCollisions(control, pointer)) {
            yield control;
          }
          break;
        case CollisionShape.Rectangle:
          if (this.checkRectangleCollisions(control, pointer)) {
            yield control;
          }
          break;
      }
    }
  }

  private checkCircleCollisions(control: CanvasControl, pointer: Point2D) {
    const { x, y, radius } = fromEuclideanToPolar(control.x, control.y, control.width, control.height);
    const distance = distanceBetween(pointer, { x, y });

    return distance < radius;
  }

  private checkRectangleCollisions(control: CanvasControl, pointer: Point2D) {
    const boundary = control.boundary;
    return (
      pointer.x >= boundary.left &&
      pointer.x <= boundary.right &&
      pointer.y >= boundary.top &&
      pointer.y <= boundary.bottom
    );
  }
}
