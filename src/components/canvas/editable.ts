export interface IEditable {
  setEditable(editable: boolean): void;
}

export function isEditable(control: unknown): control is IEditable {
  return typeof control === 'object' && control !== null && 'setEditable' in control;
}
