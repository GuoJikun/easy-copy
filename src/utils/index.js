export class Message {
  instance = null;
  constructor() {
    if (!this.instance) {
      this.init();
    }
  }
  init() {
    this.instance = new BroadcastChannel("easy_copy_channel");
  }
  send(info) {
    this.instance.postMessage(info);
  }
}
const noop = () => {};

export function throttleFilter(
  ms = 0,
  trailing = true,
  leading = true,
  rejectOnCancel = false
) {
  let lastExec = 0;
  let timer;
  let isLeading = true;
  let lastRejector = noop;
  let lastValue;

  const clear = () => {
    if (timer) {
      clearTimeout(timer);
      timer = undefined;
      lastRejector();
      lastRejector = noop;
    }
  };

  const filter = (_invoke) => {
    const duration = ms;
    const elapsed = Date.now() - lastExec;
    const invoke = () => {
      return (lastValue = _invoke());
    };

    clear();

    if (duration <= 0) {
      lastExec = Date.now();
      return invoke();
    }

    if (elapsed > duration && (leading || !isLeading)) {
      lastExec = Date.now();
      invoke();
    } else if (trailing) {
      lastValue = new Promise((resolve, reject) => {
        lastRejector = rejectOnCancel ? reject : resolve;
        timer = setTimeout(() => {
          lastExec = Date.now();
          isLeading = true;
          resolve(invoke());
          clear();
        }, Math.max(0, duration - elapsed));
      });
    }

    if (!leading && !timer)
      timer = setTimeout(() => (isLeading = true), duration);

    isLeading = false;
    return lastValue;
  };

  return filter;
}

export function createFilterWrapper(filter, fn) {
  // const self = this;
  function wrapper(self, ...args) {
    console.log("wrapper", self, args);
    return filter(() => fn.apply(self, args), { fn, thisArg: self, args });
  }

  return wrapper;
}

export function useThrottleFn(
  fn,
  ms = 200,
  trailing = false,
  leading = true,
  rejectOnCancel = false
) {
  return createFilterWrapper(
    throttleFilter(ms, trailing, leading, rejectOnCancel),
    fn
  );
}
