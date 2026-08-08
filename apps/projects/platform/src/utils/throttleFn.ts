export const throttleFn = (fn, delay) => {
  let valid = true
  return function (...args) {
    if (!valid) {
      return false;
    }
    valid = false;
    setTimeout(() => {
      fn(...args)
      valid = true
    }, delay);
  }
}
let timer = null;
export const debounceFn = (func, delay) => {
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func(...args)
    }, delay);
  }
}