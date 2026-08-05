/**
 * 用于平台结算管理，应收，应付账款管理列表页 结算状态下拉筛选
 */
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

export const payStatus = [
  { text: intl.formatMessage({ id: 'balance.common.payStatus.1' }), value: 1 },
  { text: intl.formatMessage({ id: 'balance.common.payStatus.2' }), value: 2 },
  { text: intl.formatMessage({ id: 'balance.common.payStatus.3' }), value: 3 },
  { text: intl.formatMessage({ id: 'balance.common.payStatus.4' }), value: 4 },
]

/**
 * 下单时间与支付时间，用于平台积分计算详情，与平台代收账款借算
 */
export const commonTimeList = [
  { label: intl.formatMessage({ id: 'balance.common.commonTimeList.1' }), value: 1 },
  { label: intl.formatMessage({ id: 'balance.common.commonTimeList.2' }), value: 2 },
  { label: intl.formatMessage({ id: 'balance.common.commonTimeList.3' }), value: 3 },
  { label: intl.formatMessage({ id: 'balance.common.commonTimeList.4' }), value: 4 },
  { label: intl.formatMessage({ id: 'balance.common.commonTimeList.5' }), value: 5 },
  { label: intl.formatMessage({ id: 'balance.common.commonTimeList.6' }), value: 6 },
  { label: intl.formatMessage({ id: 'balance.common.commonTimeList.7' }), value: 7 },
]

/**
 * 下单时间
 */
export const orderTime = [{ label: intl.formatMessage({ id: 'balance.common.orderTime' }), value: 0 }].concat(
  commonTimeList,
)

/**
 * 支付时间
 */
export const payTime = [{ label: intl.formatMessage({ id: 'balance.common.payTime' }), value: 0 }].concat(
  commonTimeList,
)

/**
 * 获取结算状态
 */
export const fetchOptions = (service) => {
  return async function () {
    const res = await service()
    if (res.code === 1000) {
      return res.data.map((item) => {
        return { label: item.text, value: (item.status || item.id).toString() }
      })
    }
    return []
  }
}

/**
 * 获取结算状态
 */
export const fetchInvoiceOptions = (service) => {
  return async function () {
    const res = await service()
    if (res.code === 1000) {
      const list: any[] = res.data || []
      const lastItem = list.pop()
      const newList = [lastItem, ...list]
      return newList.map((item) => {
        return { label: item.name, value: item.code.toString() }
      })
    }
    return []
  }
}
