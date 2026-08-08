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
      return 'warning'
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

export enum PurchaseBidButtons {
  // 显示全部按钮
  ALL = 1,
  // 显示修改
  UPDATE = 3,
  // 显示删除
  DELETE = 4,
  // 显示作废
  CANCEL = 5,
  // 显示审核
  AUDIT = 6,
  // 显示提交审核
  SUBMIT_REVIEW = 7,
  // 显示提交采购竞价单
  SUBMIT_A_PURCHASE_BID = 8,
  // 显示竞价管理
  BID_MANAGEMENT = 9,
  // 显示提交审核竞价结果
  SUBMIT_FOR_REVIEW_BIDDING_RESULTS = 10,
  // 显示修改竞价结果
  EDIT_AUCTION_RESULTS = 11,
  // 显示审核竞价结果
  REVIEW_AUCTION_RESULTS = 12,
  // 显示确认竞价结果
  CONFIRM__AUCTION_RESULTS = 13,
  // 显示报名
  SIGN_UP = 14,
  // 显示重新报名
  RE_SIGN_UP = 15,
  // 显示开始竞价
  START_BIDDING = 16,
}
