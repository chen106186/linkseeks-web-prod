import React from 'react'
import { DatePicker } from '@linkseeks/ui'
import moment from 'moment'

/**
 * Unix时间戳格式的时间范围选择
 */

const { RangePicker } = DatePicker

const DateRangePickerUnix = (props) => {
  const { value, mutators } = props

  const { placeholder, dataSource, ...rest } = props || {}

  const handleChange = (dates, dateString) => {
    if (dateString.length === 2) {
      mutators.change([
        dateString[0] ? moment(dateString[0]).format('x') : null,
        dateString[1] ? moment(dateString[1]).format('x') : null,
      ])
    }
  }

  let v: any = []
  if (value.length) {
    let startTime = moment(Number(value[0])).format('YYYY-MM-DD HH:mm:ss')
    let endTime = moment(Number(value[1])).format('YYYY-MM-DD HH:mm:ss')
    v = [moment(startTime, 'YYYY-MM-DD HH:mm:ss'), moment(endTime, 'YYYY-MM-DD HH:mm:ss')]
  }

  return (
    <RangePicker
      showTime={true}
      style={{ minWidth: 160 }}
      placeholder={placeholder}
      onChange={handleChange}
      value={v}
      {...rest}
    />
  )
}

DateRangePickerUnix.defaultProps = {}

DateRangePickerUnix.isFieldComponent = true

export default DateRangePickerUnix
