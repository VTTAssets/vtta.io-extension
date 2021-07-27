/**
 * Observer pattern that is used to watch for relevant blocks appearing
 * when the user navigates through the site
 * @returns observer
 */

export default () => {
  let handlers: Function[] = [];

  const subscribe = (fn: Function) => handlers.push(fn);
  const unsubscribe = (fn: Function) => {
    handlers = handlers.filter((handler: Function) => handler !== fn);
  };
  const fire = (detail: any) => {
    handlers.forEach((handler) => handler.call(window, detail));
  };

  // two possible situations:
  // - block is already visible
  // - block is getting displayed due to user interaction
  //
  // We will cache the results of the first option for anyone that subscribes
  // later on

  return {
    subscribe,
    unsubscribe,
    fire,
  };
};
