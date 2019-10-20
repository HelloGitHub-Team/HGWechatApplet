export interface Interceptor<T = any> {
  fulfilled?: (value: T) => T | Promise<T>;
  rejected?: (error: any) => any;
}

export default class InterceptorManager<T> {
  handlers: Interceptor<T>[];

  constructor() {
    this.handlers = [];
  }

  public use(
    fulfilled?: (value: T) => T | Promise<T>,
    rejected?: (error: any) => any
  ) {
    this.handlers.push({ fulfilled, rejected });

    return this.handlers.length - 1;
  }

  public eject(id: number) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }

  public each(fn: (interceptor: Interceptor<T>) => any) {
    this.handlers.forEach(h => {
      if (h !== null) fn(h);
    });
  }
}
