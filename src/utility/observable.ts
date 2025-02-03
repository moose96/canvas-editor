/**
 * Simple class that allows to subscribe to changes
 */
export default class Observable<Value> {
  private listeners: Set<(value: Value) => void> = new Set();

  /**
   * Sets the value and calls all listeners
   *
   * @param value
   */
  next(value: Value) {
    this.listeners.forEach((callback) => callback(value));
  }

  /**
   * Subscribe to changes of the value. It returns cleanup function.
   *
   * @param callback - callback to call when the value changes.
   */
  subscribe(callback: (value: Value) => void) {
    this.listeners.add(callback);

    return () => {
      this.listeners.delete(callback);
    };
  }
}
