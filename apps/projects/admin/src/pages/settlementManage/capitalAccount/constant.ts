/**
 * 资金账户相关常量
 */

// 交易记录状态
export const statusMap = {
  '1': { title: '申请提现', type: 'warning' },
  '2': { title: '审核通过', type: 'success' },
  '3': { title: '审核不通过', type: 'default' },
  '4': { title: '提现成功', type: 'success' },
  '5': { title: '提现失败', type: 'danger' },
  '6': { title: '支付中', type: 'processing' },
  '7': { title: '支付失败', type: 'danger' },
  '8': { title: '确认到账', type: 'success' },
  '9': { title: '支付成功', type: 'success' },
}

// 流转状态
export const moveStatusMap = {
  '2': { title: '冻结', type: 'danger' },
  '1': { title: '解冻', type: 'success' },
}

// 会员状态
export const memberStatusMap = {
  '1': { title: '正常', type: 'success' },
  '2': { title: '已冻结', type: 'danger' },
}

// 账户状态
export const accountStatusMap = {
  '1': { title: '正常', className: 'commonStatusValid' },
  '2': { title: '已冻结', className: 'commonStatusNoPass' },
}

// 会员等级类型
export const memberLevelTypeMap = {
  '1': '平台会员',
  '2': '商户会员',
  '3': '渠道会员',
}

// 操作项目
export const operationMap = {
  '1': { title: '账户充值', operator: '+' },
  '2': { title: '账户提现', operator: '-' },
  '3': { title: '订单支付', operator: '-' },
  '4': { title: '订单退款', operator: '+' },
  '5': { title: '订单返利', operator: '+' },
}

// 会员类型
export const accountMemberType = {
  '1': '企业会员',
  '2': '个人会员',
  '3': '渠道会员',
  '4': '渠道个人会员',
}

// e账户会员类型
// 2-企业会员 3-个人会员  */
export const eAccountMemberType = {
  '2': '企业会员',
  '3': '个人会员',
}
