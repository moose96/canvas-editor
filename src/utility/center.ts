/**
 * Returns position in x and y-axis of the element relative to its parent, basing on the element's width and height
 *
 * @param parentRect
 * @param childWidth
 * @param childHeight
 */
export default function center(parentRect: Required<DOMRectInit>, childWidth: number, childHeight: number) {
  return {
    x: parentRect.x + Math.abs(childWidth - parentRect.width) / 2,
    y: parentRect.y + Math.abs(childHeight - parentRect.height) / 2,
  };
}
