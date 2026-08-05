/** 价单外部状态颜色 */
export const BID_EXTERNALSTATE_COLOR = (text) => {
  switch (Number(text)) {
    case -1:
    case 7:
    case 8:
      return 'danger'
    case 2:
    case 3:
    case 4:
      return 'warnning'
    case 6:
      return 'primary'
    case 99:
      return 'success'
    default:
      return 'default'
  }
}
// export const BID_EXTERNALSTATE_COLOR = {
//     '-1': 'error',
//     99: 'success',
//     1: 'default',
//     2: 'warning',
//     3: 'warning',
//     4: 'warning',
//     5: 'default',
//     6: 'processing',
//     7: 'error',
//     8: 'error',
// }
/** 报价内部状态颜色 */
export const BID_INTERNALSTATE_COLOR = (text) => {
  switch (Number(text)) {
    case -1:
    case 8:
    case 9:
    case 11:
      return 'error'
    case 2:
    case 3:
    case 13:
    case 14:
    case 15:
      return 'warnning'
    case 4:
    case 12:
      return 'primary'
    case 99:
      return 'success'
    default:
      return 'default'
  }
}
// export const BID_INTERNALSTATE_COLOR = {
//     '-1': 'error',
//     99: 'success',
//     1: 'default',
//     2: 'warning',
//     3: 'warning',
//     4: 'processing',
//     8: 'error',
//     9: 'error',
//     10: 'default',
//     11: 'error',
//     12: 'processing',
//     13: 'warning',
//     14: 'warning',
//     15: 'warning',
// }
