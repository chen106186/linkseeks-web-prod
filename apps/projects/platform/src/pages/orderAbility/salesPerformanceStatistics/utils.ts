import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()
/**
 * 获取近几个月的时间数组 包含当前月份
 * @param maxNum  数值 1、2、3、4、5......
 * @returns {arr[{label:,value:''}]}
 */
export function getDateTimeListCurrentMonth(maxNum) {
  var timeArray = new Array()
  //获取时间对象
  var date = new Date()
  var year = date.getFullYear()
  //js的月份 是从0~11 ，所以要加1
  var month = date.getMonth() + 1
  for (var i = 0; i < maxNum; i++) {
    if (month <= 0) {
      month = 12
      year = year - 1
    }
    if (month < 10) {
      timeArray[i] =
        year +
        intl.formatMessage({ id: 'salesPerformanceStatistics.year' }) +
        '0' +
        month +
        intl.formatMessage({ id: 'salesPerformanceStatistics.month' })
    } else {
      timeArray[i] =
        year +
        intl.formatMessage({ id: 'salesPerformanceStatistics.year' }) +
        month +
        intl.formatMessage({ id: 'salesPerformanceStatistics.month' })
    }
    month = month - 1
  }

  let list = timeArray.map((item) => ({
    label: item,
    value: item
      .replace(intl.formatMessage({ id: 'salesPerformanceStatistics.year' }), '-')
      .replace(intl.formatMessage({ id: 'salesPerformanceStatistics.month' }), ''),
  }))

  return list
}
