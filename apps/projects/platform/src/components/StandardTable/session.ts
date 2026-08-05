export const get = key => {
  let result;
  result = sessionStorage.getItem(key);
  if (result) {
    if (isJSON(result)) {
      result = JSON.parse(result);
    }
    return result;
  }

  return undefined;
};

export const set = (key, value) => {
  if (typeof value === 'object') {
    value = JSON.stringify(value);
  }
  sessionStorage.setItem(key, value);
};

export const remove = key => {
  sessionStorage.removeItem(key);
};

const isJSON = str => {
  if (typeof str === 'string') {
    try {
      var obj = JSON.parse(str);
      if (typeof obj === 'object' && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
};
