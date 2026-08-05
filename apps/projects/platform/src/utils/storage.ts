let targetWin = null
if (window) targetWin = window
let proxyWindow = new Proxy(targetWin, {
  get: function (target, key, receiver) {
    if (!targetWin) {
      return Reflect.get({ nothing: function () { } }, 'nothing', receiver);
    }
    return Reflect.get(target, key, receiver);
  }
});

export const localStorage = proxyWindow.localStorage

export const sessionStorage = proxyWindow.sessionStorage

export default proxyWindow