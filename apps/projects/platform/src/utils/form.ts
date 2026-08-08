import moment from 'moment'

export function HandelFormFieldsKeyValue(fields) {
  let result = {}
  for (const field in fields) {
    const split = field.split('.')

    if (split.length > 1) {
      //为空的时候创建一个默认对象
      if (result[split[0]] === undefined) {
        result[split[0]] = {}
      }
      result[split[0]][split[1]] = momentFormatValue(fields[field])
    } else {
      if (['deliveryRangeTime'].includes(field)) {
        result[field] = fields[field].map((v) => momentFormatValue(v, 'HH:mm'))
      } else {
        result[field] = momentFormatValue(fields[field])
      }
    }
  }
  return result
}

export function momentFormatValue(value, format = 'YYYY-MM-DD') {
  return moment.isMoment(value) ? value.format(format) : value
}
