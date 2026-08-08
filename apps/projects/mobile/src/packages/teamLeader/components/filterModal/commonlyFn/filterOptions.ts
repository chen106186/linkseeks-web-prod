import { DateRangeValueType } from '../components/DateGroup'
import { subtractDate } from './utils'

export interface StatusItem {
	name: string
	status: number
}

export function getOuterStatus(intl: any): StatusItem[] {
  return [
    { name: intl.formatMessage({ id: 'inquiryQuotation.suoyouzhuangtai', defaultMessage: '所有状态' }), status: 90 },
    { name: intl.formatMessage({ id: 'inquiryQuotation.daitijiaoxunjiadan', defaultMessage: '待提交询价单' }), status: 1 },
    { name: intl.formatMessage({ id: 'inquiryQuotation.daitijiaobaojiadan', defaultMessage: '待提交报价单' }), status: 2 },
    { name: intl.formatMessage({ id: 'inquiryQuotation.daiquerenbaojiadan', defaultMessage: '待确认报价单' }), status: 3 },
    { name: intl.formatMessage({ id: 'inquiryQuotation.jieshoubaojia', defaultMessage: '接受报价' }), status: 4 },
    { name: intl.formatMessage({ id: 'inquiryQuotation.bujieshoubaojia', defaultMessage: '不接受报价' }), status: 5 },
  ]
}

export function getInnerStatus(intl: any): StatusItem[] {
  return [
    { name: intl.formatMessage({ id: 'inquiryQuotation.suoyouzhuangtai', defaultMessage: '所有状态' }), status: 90 },
    { name: intl.formatMessage({ id: 'inquiryQuotation.daitijiaoshenhe', defaultMessage: '待提交审核' }), status: 1 },
    { name: intl.formatMessage({ id: 'inquiryQuotation.daishenheyiji', defaultMessage: '待审核(一级)' }), status: 2 },
    { name: intl.formatMessage({ id: 'inquiryQuotation.daishenheerji', defaultMessage: '待审核(二级)' }), status: 3 },
    { name: intl.formatMessage({ id: 'inquiryQuotation.daitijiaoxunjiadan', defaultMessage: '待提交询价单' }), status: 4 },
    { name: intl.formatMessage({ id: 'inquiryQuotation.shenhetongguo', defaultMessage: '审核通过' }), status: 5 },
    { name: intl.formatMessage({ id: 'inquiryQuotation.shenhebutongguoyiji', defaultMessage: '审核不通过(一级)' }), status: 6 },
    { name: intl.formatMessage({ id: 'inquiryQuotation.shenhebutongguoerji', defaultMessage: '审核不通过(二级)' }), status: 7 },
  ]
}

export function getDateOptions(intl: any): DateRangeValueType[] {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
  const year = now.getFullYear()

  // 生成唯一字符串标识，方便选中对比
  function formatValue(range: [Date, Date]): string {
    return `${range[0].toISOString()}_${range[1].toISOString()}`
  }

  const ranges: Array<{ id: string; defaultName: string; range: [Date, Date] }> = [
    { id: 'filterModal_today', defaultName: '当日', range: [todayStart, todayEnd] },
    {
      id: 'filterModal_yesterday',
      defaultName: '昨天',
      range: [subtractDate(todayStart, 1, 'days'), subtractDate(todayEnd, 1, 'days')],
    },
    {
      id: 'filterModal_last7days',
      defaultName: '7天内',
      range: [subtractDate(todayEnd, 6, 'days'), todayEnd],
    },
    {
      id: 'filterModal_last1month',
      defaultName: '1个月内',
      range: [subtractDate(todayEnd, 1, 'month'), todayEnd],
    },
    {
      id: 'filterModal_last3months',
      defaultName: '3个月内',
      range: [subtractDate(todayEnd, 3, 'month'), todayEnd],
    },
    {
      id: 'filterModal_last6months',
      defaultName: '6个月内',
      range: [subtractDate(todayEnd, 6, 'month'), todayEnd],
    },
    {
      id: 'filterModal_thisyear',
      defaultName: '今年',
      range: [new Date(year, 0, 1), todayEnd],
    },
    {
      id: 'filterModal_1yearago',
      defaultName: '1年前',
      range: [new Date(year - 1, 0, 1), new Date(year - 1, 11, 31, 23, 59, 59, 999)],
    },
    {
      id: 'filterModal_2yearago',
      defaultName: '2年前',
      range: [new Date(year - 2, 0, 1), new Date(year - 2, 11, 31, 23, 59, 59, 999)],
    },
  ]

  return ranges.map(({ id, defaultName, range }) => ({
    name: intl.formatMessage({ id, defaultMessage: defaultName }),
    value: formatValue(range),
    range,
  }))
}

export function getDateOptionsGroup(intl: any): DateRangeValueType[] {
  const now = new Date()
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
  const year = now.getFullYear()

  // 生成唯一字符串标识，方便选中对比
  function formatValue(range: [Date, Date]): string {
    return `${range[0].toISOString()}_${range[1].toISOString()}`
  }

  const ranges: Array<{ id: string; defaultName: string; range: [Date, Date] }> = [
    {
      id: 'filterModal_last1month',
      defaultName: '1个月内',
      range: [subtractDate(todayEnd, 1, 'month'), todayEnd],
    },
    {
      id: 'filterModal_last3months',
      defaultName: '3个月内',
      range: [subtractDate(todayEnd, 3, 'month'), todayEnd],
    },
    {
      id: 'filterModal_last6months',
      defaultName: '6个月内',
      range: [subtractDate(todayEnd, 6, 'month'), todayEnd],
    },
    {
      id: 'filterModal_thisyear',
      defaultName: '今年',
      range: [new Date(year, 0, 1), todayEnd],
    },
    {
      id: 'filterModal_1yearago',
      defaultName: '1年前',
      range: [new Date(year - 1, 0, 1), new Date(year - 1, 11, 31, 23, 59, 59, 999)],
    },
    {
      id: 'filterModal_2yearago',
      defaultName: '2年前',
      range: [new Date(year - 2, 0, 1), new Date(year - 2, 11, 31, 23, 59, 59, 999)],
    },
  ]

  return ranges.map(({ id, defaultName, range }) => ({
    name: intl.formatMessage({ id, defaultMessage: defaultName }),
    value: formatValue(range),
    range,
  }))
}

