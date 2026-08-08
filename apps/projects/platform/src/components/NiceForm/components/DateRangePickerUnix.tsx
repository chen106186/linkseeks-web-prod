import React from 'react'
import { DatePicker } from 'antd';
import moment from 'moment';

/**
 * Unix时间戳格式的时间范围选择
 */

const { RangePicker } = DatePicker;

const DateRangePickerUnix = (props) => {
  const { value, mutators } = props

  const { placeholder, dataSource, showTime = true, format, ...rest } = props.props["x-component-props"] || {}

  const handleChange = (dates, dateString) => {
    if (dateString.length === 2) {
      if (format) {
        mutators.change([dateString[0] ? moment(dateString[0]).format('YYYY-MM-DD') : null, dateString[1] ? moment(dateString[1]).format('YYYY-MM-DD') : null]);
      } else {
        mutators.change([dateString[0] ? moment(dateString[0]).format('x') : null, dateString[1] ? moment(dateString[1]).format('x') : null]);
      }
    }
  }

  let v = []
  if (value.length) {
    if (format) {
      v = [moment(value[0]), moment(value[1])]
    } else {
      let startTime = moment(Number(value[0])).format('YYYY-MM-DD HH:mm:ss')
      let endTime = moment(Number(value[1])).format('YYYY-MM-DD HH:mm:ss')
      v = [moment(startTime, 'YYYY-MM-DD HH:mm:ss'), moment(endTime, 'YYYY-MM-DD HH:mm:ss')]
    }

  }

  return (
    <RangePicker
      showTime={showTime}
      style={{ minWidth: 160 }}
      placeholder={placeholder}
      onChange={handleChange}
      value={v}
      {...rest}
    />
  )
}

DateRangePickerUnix.defaultProps = {}

DateRangePickerUnix.isFieldComponent = true;

export default DateRangePickerUnix
