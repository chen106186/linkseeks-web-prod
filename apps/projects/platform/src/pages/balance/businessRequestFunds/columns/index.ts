import { getIntl } from '@linkseeks/i18n'

/** 请款单号 */
export const applyNo = {
  title: getIntl().formatMessage({
    id: 'balance.components.writeOffDrawer.columns.applyNo',
    defaultMessage: '请款单号',
  }),
  key: 'applyNo',
  dataIndex: 'applyNo',
}

/** 请款单摘要 */
export const applyAbstract = {
  title: getIntl().formatMessage({
    id: 'balance.businessRequestFundsCollaboration.detail.col.applyAbstract',
    defaultMessage: '请款摘要',
  }),
  key: 'applyAbstract',
  dataIndex: 'applyAbstract',
}

/** 请款类型 */
export const applyType = {
  title: getIntl().formatMessage({
    id: 'balance.businessRequestFundsCollaboration.detail.col.applyTypeName',
    defaultMessage: '请款类型',
  }),
  key: 'applyTypeName',
  dataIndex: 'applyTypeName',
}

/** 收款方 */
export const payee = {
  title: getIntl().formatMessage({
    id: 'balance.businessRequestFundsCollaboration.detail.col.payee',
    defaultMessage: '收款方',
  }),
  key: 'payee',
  dataIndex: 'payee',
}

/** 请款金额 */
export const applyAmount = {
  title: getIntl().formatMessage({
    id: 'balance.businessRequestFundsCollaboration.detail.col.applyAmount',
    defaultMessage: '请款金额',
  }),
  key: 'applyAmount',
  dataIndex: 'applyAmount',
  showSorterTooltip: false,
  sorter: (a, b) => a.applyAmount - b.applyAmount,
  sortDirections: ['descend'],
}

/** 预计付款日期 */
export const expectPayTime = {
  title: getIntl().formatMessage({
    id: 'balance.businessRequestFundsCollaboration.detail.col.expectPayTime',
    defaultMessage: '预计付款日期',
  }),
  key: 'expectPayTime',
  dataIndex: 'expectPayTime',
  showSorterTooltip: false,
  sorter: (a, b) => a.expectPayTime - b.expectPayTime,
  sortDirections: ['descend'],
}

/** 单据时间 */
export const createTime = {
  title: getIntl().formatMessage({
    id: 'balance.businessRequestFundsCollaboration.detail.columns.billTime',
    defaultMessage: '单据时间',
  }),
  key: 'createTime',
  dataIndex: 'createTime',
  showSorterTooltip: false,
  sorter: (a, b) => a.createTime - b.createTime,
  sortDirections: ['descend'],
}

/** 内部状态 */
export const interiorStateName = {
  title: getIntl().formatMessage({ id: 'components.neibuzhuangtai', defaultMessage: '内部状态' }),
  key: 'statusName',
  dataIndex: 'statusName',
}

/** 操作 */
export const operation = {
  title: getIntl().formatMessage({ id: 'balance.settleRules.memberSettle.columns.operation', defaultMessage: '操作' }),
  key: 'operation',
  dataIndex: 'operation',
}
