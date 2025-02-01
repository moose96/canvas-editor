import CanvasControl, { CanvasControlProps } from './canvas-control.ts';
import EventManager from './event-manager.ts';

export interface CanvasTextControlProps extends CanvasControlProps {
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
  fontWeight: string;
  color: string;
}

export default class CanvasTextControl extends CanvasControl {
  public fontFamily: string;
  public fontSize: string;
  public lineHeight: string;
  public fontWeight: string;
  protected color: string;

  constructor(context: CanvasRenderingContext2D, eventManager: EventManager, props?: CanvasTextControlProps) {
    super(context, eventManager, props);

    this.fontFamily = props?.fontFamily ?? '';
    this.fontSize = props?.fontSize ?? '';
    this.lineHeight = props?.lineHeight ?? '';
    this.fontWeight = props?.fontWeight ?? '';
    this.color = props?.color ?? '';
  }
}
