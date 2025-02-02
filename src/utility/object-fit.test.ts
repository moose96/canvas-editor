import { describe, expect, it } from 'vitest';

import { containImage,coverTarget } from './object-fit';

describe('test coverTarget', () => {
  it('cuts image when imgAspect > canvasAspect', () => {
    const canvasWidth = 150;
    const canvasHeight = 150;

    const result = coverTarget(200, 100, canvasWidth, canvasHeight);

    expect(result).toEqual([
      50,  // sx
      0,   // sy
      100, // sWidth
      100, // sHeight
      0,   // dx
      0,   // dy
      canvasWidth, // dWidth
      canvasHeight // dHeight
    ]);
  });

  it('cuts image when imgAspect <= canvasAspect', () => {
    const canvasWidth = 150;
    const canvasHeight = 150;

    const result = coverTarget(100, 200, canvasWidth, canvasHeight);

    expect(result).toEqual([
      0,    // sx
      50,   // sy
      100,  // sWidth
      100,  // sHeight
      0,    // dx
      0,    // dy
      canvasWidth, // dWidth
      canvasHeight // dHeight
    ]);
  });
});

describe('test containImage', () => {
  it('scale when imgAspect > canvasAspect', () => {
    const canvasWidth = 150;
    const canvasHeight = 150;

    const result = containImage(200, 100, canvasWidth, canvasHeight);

    expect(result).toEqual([
      0,      // sx
      0,      // sy
      200,    // sWidth
      100,    // sHeight
      0,      // dx
      37.5,   // dy
      150,    // dWidth
      75      // dHeight
    ]);
  });

  it('scale when imgAspect <= canvasAspect', () => {
    const canvasWidth = 150;
    const canvasHeight = 150;

    const result = containImage(100, 200, canvasWidth, canvasHeight);

    expect(result).toEqual([
      0,      // sx
      0,      // sy
      100,    // sWidth
      200,    // sHeight
      37.5,   // dx
      0,      // dy
      75,     // dWidth
      150     // dHeight
    ]);
  });
});
