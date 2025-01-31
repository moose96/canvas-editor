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
