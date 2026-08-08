import { canUseDom } from './can-use-dom';
export let supportsPassive = false;

if (canUseDom) {
  try {
    const opts: any = {};
    Object.defineProperty(opts, 'passive', {
      get() {
        supportsPassive = true;
      }

    });
    window.addEventListener('test-passive', null as unknown as any, opts);
  } catch (e) {}
}
