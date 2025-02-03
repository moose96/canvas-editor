declare const NumberCanvasContextSymbol: unique symbol;
declare const NumberCanvasSymbol: unique symbol;
declare const NumberViewportSymbol: unique symbol;

/**
 * A nominal number type which is used while drawing on the canvas.
 * Canvas context might be scaled so NumberCanvasContext != NumberCanvas
 */
export type NumberCanvasContext = number & { [NumberCanvasContextSymbol]: never };

/**
 * A nominal number type which is used while positioning elements or referencing pointer position on the canvas element
 * 1px of NumberCanvas is the same as 1px of the viewport
 */
export type NumberCanvas = number & { [NumberCanvasSymbol]: never };

/**
 * A nominal number type which is used to reference elements relatively to the viewport
 */
export type NumberViewport = number & { [NumberViewportSymbol]: never };

/**
 * NumberCanvasContext factory
 *
 * @param value
 * @constructor
 */
export const NumberCanvasContext = (value: number) => value as NumberCanvasContext;

/**
 * NumberCanvas factory
 *
 * @param value
 * @constructor
 */
export const NumberCanvas = (value: number) => value as NumberCanvas;

/**
 * NumberViewport factory
 *
 * @param value
 * @constructor
 */
export const NumberViewport = (value: number) => value as NumberViewport;

/**
 * NumberCanvasContext custom literal. JS/TS doesn't support custom literals so this is a way to create custom literals.
 *
 * @example
 * NCC`5`
 * NCC`${5}`
 * NCC`${5 + 5}`
 *
 * @param template
 * @param value
 */
export const NCC = (template: TemplateStringsArray, value?: number) =>
  NumberCanvasContext(value ?? Number(template.join('')));

/**
 * NumberCanvas custom literal. JS/TS doesn't support custom literals so this is a way to create custom literals.
 *
 * @example
 * NC`5`
 * NC`${5}`
 * NC`${5 + 5}`
 *
 * @param template
 * @param value
 */
export const NC = (template: TemplateStringsArray, value?: number) => NumberCanvas(value ?? Number(template.join('')));

/**
 * NumberViewport custom literal. JS/TS doesn't support custom literals so this is a way to create custom literals.
 *
 * @example
 * NV`5`
 * NV`${5}`
 * NV`${5 + 5}`
 *
 * @param template
 * @param value
 */
export const NV = (template: TemplateStringsArray, value?: number) =>
  NumberViewport(value ?? Number(template.join('')));
