import { NC, NumberCanvas } from '@utility/relative-numbers.ts';
import RelativeNumbersConverter from '@utility/relative-numbers-converter.ts';

import CanvasControl, { CanvasControlProps } from './canvas-control.ts';
import EventManager from './event-manager.ts';

export interface CanvasTextControlProps extends CanvasControlProps {
  fontFamily: string;
  fontSize: NumberCanvas;
  lineHeight: NumberCanvas;
  fontWeight: string;
  color: string;
}

export default class CanvasTextControl extends CanvasControl {
  public fontFamily: string;
  public fontSize: NumberCanvas;
  public lineHeight: NumberCanvas;
  public fontWeight: string;
  protected color: string;

  constructor(
    context: CanvasRenderingContext2D,
    converter: RelativeNumbersConverter,
    eventManager: EventManager,
    props?: CanvasTextControlProps,
  ) {
    super(context, converter, eventManager, props);

    this.fontFamily = props?.fontFamily ?? '';
    this.fontSize = props?.fontSize ?? NC`0`;
    this.lineHeight = props?.lineHeight ?? NC`0`;
    this.fontWeight = props?.fontWeight ?? '';
    this.color = props?.color ?? '';
  }
}
