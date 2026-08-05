import React, { useEffect } from 'react'
import { DatePicker } from 'antd'
import moment from 'moment'

const StringDatePicker = (props: any) => {
  const { onChange, value, ...rest } = props

  const _onChange = (date: any, dateString: string) => {
    onChange?.(dateString)
  }

  useEffect(() => {
    if (!value) {
      onChange(moment().format('YYYY-MM-DD'))
    }
  }, [])

  return (
    <DatePicker
      allowClear={false}
      style={{ width: '100%' }}
      placeholder="请选择"
      {...rest}
      value={moment(value)}
      onChange={_onChange}
    />
  )
}

export default StringDatePicker
