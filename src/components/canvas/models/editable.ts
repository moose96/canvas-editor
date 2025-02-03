export interface IEditable {
  /**
   * Sets the editable state. The class implementing this interface decides how to handle the editable state.
   *
   * But mostly it should add or remove the transform box.
   *
   * @param editable
   */
  setEditable(editable: boolean): void;
}

export function isEditable(control: unknown): control is IEditable {
  return typeof control === 'object' && control !== null && 'setEditable' in control;
}
