import { Point2D } from '@models/point-2d.ts';
import distanceBetween from '@utility/distance-between.ts';
import fromEuclideanToPolar from '@utility/from-euclidean-to-polar.ts';
import { NC, NumberCanvasContext } from '@utility/relative-numbers.ts';
import RelativeNumbersConverter from '@utility/relative-numbers-converter.ts';

import CanvasControl from './canvas-control.ts';

export enum CollisionShape {
  Circle,
  Rectangle,
}

export default class EventManager {
  private controls: Set<CanvasControl> = new Set();

  constructor(
    public canvas: HTMLCanvasElement,
    private converter: RelativeNumbersConverter,
  ) {
    this.canvas.addEventListener('click', this.handleEvent.bind(this));
    this.canvas.addEventListener('pointerdown', this.handleEvent.bind(this));
    this.canvas.addEventListener('pointerup', this.handleEvent.bind(this));
    this.canvas.addEventListener('pointermove', this.handleEvent.bind(this));
  }

  /**
   * Adds CanvasControl instance to event manager
   *
   * @param control
   */
  register(control: CanvasControl) {
    this.controls.add(control);
  }

  /**
   * Removes CanvasControl instance from event manager
   *
   * @param control
   */
  unregister(control: CanvasControl) {
    this.controls.delete(control);
  }

  private handleEvent(event: MouseEvent | PointerEvent) {
    const pointer = {
      x: this.converter.fromCanvasToCanvasContext(NC`${event.offsetX}`),
      y: this.converter.fromCanvasToCanvasContext(NC`${event.offsetY}`),
    };
    for (const control of this.checkCollisions(pointer)) {
      control.dispatchEvent(new Event(event.type));
    }
  }

  private *checkCollisions(pointer: Point2D<NumberCanvasContext>) {
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

  private checkCircleCollisions(control: CanvasControl, pointer: Point2D<NumberCanvasContext>) {
    const { x, y, radius } = fromEuclideanToPolar(control.x, control.y, control.width, control.height);
    const distance = distanceBetween(pointer, { x, y });

    return distance < radius;
  }

  private checkRectangleCollisions(control: CanvasControl, pointer: Point2D<NumberCanvasContext>) {
    const boundary = control.boundary;
    return (
      pointer.x >= boundary.left &&
      pointer.x <= boundary.right &&
      pointer.y >= boundary.top &&
      pointer.y <= boundary.bottom
    );
  }
}
