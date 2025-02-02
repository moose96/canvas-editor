declare const NumberCanvasContextSymbol: unique symbol;
declare const NumberCanvasSymbol: unique symbol;
declare const NumberViewportSymbol: unique symbol;

export type NumberCanvasContext = number & { [NumberCanvasContextSymbol]: never };
export type NumberCanvas = number & { [NumberCanvasSymbol]: never };
export type NumberViewport = number & { [NumberViewportSymbol]: never };

export const NumberCanvasContext = (value: number) => value as NumberCanvasContext;
export const NumberCanvas = (value: number) => value as NumberCanvas;
export const NumberViewport = (value: number) => value as NumberViewport;

export const NCC = (template: TemplateStringsArray, value?: number) =>
  NumberCanvasContext(value ?? Number(template.join('')));
export const NC = (template: TemplateStringsArray, value?: number) => NumberCanvas(value ?? Number(template.join('')));
export const NV = (template: TemplateStringsArray, value?: number) =>
  NumberViewport(value ?? Number(template.join('')));
