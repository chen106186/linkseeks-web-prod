/** 外部状态 */
export const EXTERNALSTATE_COLOR: any = (text) => {
  switch (Number(text)) {
    case -1:
    case 7:
    case 8:
      return 'danger'
    case 2:
    case 3:
    case 4:
      return 'warning'
    case 6:
      return 'primary'
    case 99:
      return 'success'
    default:
      return 'default'
  }
}
/** 内部状态 */
export const INTERNALSTATE_COLOR: any = (text) => {
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
      return 'warning'
    case 4:
    case 12:
      return 'processing'
    case 99:
      return 'success'
    default:
      return 'default'
  }
}
