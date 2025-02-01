export default class Observable<Value> {
  private listeners: Set<(value: Value) => void> = new Set();

  next(value: Value) {
    this.listeners.forEach((callback) => callback(value));
  }

  subscribe(callback: (value: Value) => void) {
    this.listeners.add(callback);

    return () => {
      this.listeners.delete(callback);
    };
  }
}
