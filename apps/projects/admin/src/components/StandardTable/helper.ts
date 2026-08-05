const STATE_KEY = 'currentState'

export interface currentStateType {
  pathname: string
  current: number
  pageSize: number
  queryParams: any
}

/**
 * 保存表格状态
 * @param current
 * @param pageSize
 */
export const saveCurrentState = (current: number, pageSize: number, queryParams?: any) => {
  let currentPage = get(STATE_KEY)
  set(
    STATE_KEY,
    Object.assign(currentPage ? currentPage : {}, {
      pathname: window.location.pathname,
      current,
      pageSize,
      queryParams,
    }),
  )
}

/**
 * 获取表格状态数据
 */
export const getCurrentState = () => {
  return get(STATE_KEY)
}

/**
 * 清除表格状态数据
 */
export const clearCurrentState = () => {
  return remove(STATE_KEY)
}

export const get = (key) => {
  let result
  result = sessionStorage.getItem(key)
  if (result) {
    if (isJSON(result)) {
      result = JSON.parse(result)
    }
    return result
  }

  return undefined
}

export const set = (key, value) => {
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  sessionStorage.setItem(key, value)
}

export const remove = (key) => {
  sessionStorage.removeItem(key)
}

const isJSON = (str) => {
  if (typeof str === 'string') {
    try {
      var obj = JSON.parse(str)
      if (typeof obj === 'object' && obj) {
        return true
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  }
}
