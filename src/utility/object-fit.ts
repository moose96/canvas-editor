export enum ObjectFit {
  Cover,
  Contain,
}

export type ObjectFitParams = [
  sx: number,
  sy: number,
  sWidth: number,
  sHeight: number,
  dx: number,
  dy: number,
  dWidth: number,
  dHeight: number,
];

/**
 * Returns parameters for CanvasRenderingContext2D.drawImage to fit the source image to the target element
 * and cuts it if needed. Similar behavior to object-fit: cover
 *
 * @param sourceWidth
 * @param sourceHeight
 * @param targetWidth
 * @param targetHeight
 */
export function coverTarget(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
): ObjectFitParams {
  const sourceAspect = sourceWidth / sourceHeight;
  const targetAspect = targetWidth / targetHeight;
  const targetParams = [0, 0, targetWidth, targetHeight] as const;

  if (sourceAspect > targetAspect) {
    const scaledWidth = sourceHeight * targetAspect;
    return [(sourceWidth - scaledWidth) / 2, 0, scaledWidth, sourceHeight, ...targetParams];
  }

  const scaledHeight = sourceWidth / targetAspect;
  return [0, (sourceHeight - scaledHeight) / 2, sourceWidth, scaledHeight, ...targetParams];
}

/**
 * Returns parameters for CanvasRenderingContext2D.drawImage to fit the source image to the target element
 * in that way that it's visible entirely. Similar behavior to object-fit: contain
 *
 * @param sourceWidth
 * @param sourceHeight
 * @param targetWidth
 * @param targetHeight
 */
export function containImage(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
): ObjectFitParams {
  const sourceAspect = sourceWidth / sourceHeight;
  const targetAspect = targetWidth / targetHeight;
  const sourceParams = [0, 0, sourceWidth, sourceHeight] as const;

  if (sourceAspect > targetAspect) {
    const scaledHeight = targetWidth / sourceAspect;

    return [...sourceParams, 0, (targetHeight - scaledHeight) / 2, targetWidth, scaledHeight];
  }

  const scaledWidth = targetHeight * sourceAspect;

  return [...sourceParams, (targetWidth - scaledWidth) / 2, 0, scaledWidth, targetHeight];
}
