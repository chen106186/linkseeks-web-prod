/** 内部状态颜色 */
export const EXTERNALSTATE_COLOR = {
  1: 'default',
  2: 'default',
  3: 'default',
  4: 'success',
  5: 'error',
}

/** 外部状态颜色 */
export const INTERNALSTATE_COLOR = {
  1: 'default',
  2: 'default',
  3: 'default',
  4: 'default',
  5: 'success',
  6: 'error',
  7: 'error',
}

/**
 * 外部状态颜色
 */
export const OUTER_STATUS_TYPE = (status: number) => {
  switch (status) {
    case 2:
    case 4:
    case 7:
    case 11:
    case 13:
    case 14:
      return 'processing'
    case 6:
    case 15:
      return 'warning'
    case 3:
    case 5:
      return 'error'
    case 100:
      return 'success'
    default:
      return 'default'
  }
}

/**
 * 内部状态颜色
 */
export const INTERNAL_STATUS_TYPE = (status: number) => {
  switch (status) {
    case 3:
    case 5:
    case 12:
    case 1001:
    case 1002:
      return 'error'
    case 2:
    case 4:
    case 7:
    case 9:
    case 19:
    case 14:
    case 18:
      return 'warning'
    case 11:
    case 15:
    case 17:
    case 1000:
    case 1003:
      return 'success'
    default:
      return 'default'
  }
}
