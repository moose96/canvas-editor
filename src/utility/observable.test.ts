import Observable from '@utility/observable.ts';
import { describe, expect, it, vi } from 'vitest';

describe('test Observable class', () => {
  it('should subscribe to the observable and react on changes', () => {
    const observable = new Observable<number>();
    const callback = vi.fn();

    observable.subscribe(callback);
    observable.next(1);

    expect(callback).toHaveBeenCalledWith(1);
  });

  it('should unsubscribe from the observable', () => {
    const observable = new Observable<number>();
    const callback = vi.fn();
    const cleanup = observable.subscribe(callback);

    observable.next(1);
    expect(callback).toHaveBeenCalledWith(1);

    cleanup();
    callback.mockClear();

    observable.next(2);
    expect(callback).toHaveBeenCalledTimes(0);
  });
});
