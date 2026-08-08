import React, { useMemo } from 'react'
import { Select } from '@linkseeks/ui'
import moment from 'moment'
export enum DATE_SELECT_TYPE {
  TODAY,
  WITHIN_WEEK,
  WITHIN_MONTH,
  WITHIN_THREE_MONTH,
  WITHIN_SIX_MONTH,
  WITHIN_YEAR,
  A_YEAR_AGO,
}

const getPrevTime = (num, flag) => {
  return moment().subtract(num, flag).valueOf()
}

const DateSelect = (props) => {
  const { value = [], mutators } = props
  const todayStartTime = moment().startOf('day').format('x')
  const nowTime = moment().format('x').valueOf()
  const dateMemo = useMemo(
    () => [
      { label: '今天', value: `${todayStartTime},${nowTime}` },
      { label: '一周内', value: `${getPrevTime(1, 'week')},${nowTime}` },
      { label: '一月内', value: `${getPrevTime(1, 'month')},${nowTime}` },
      { label: '三月内', value: `${getPrevTime(3, 'month')},${nowTime}` },
      { label: '六月内', value: `${getPrevTime(6, 'month')},${nowTime}` },
      { label: '一年内', value: `${getPrevTime(1, 'year')},${nowTime}` },
      { label: '一年前', value: `0,${getPrevTime(1, 'year')}` },
    ],
    [],
  )

  const handleChange = (e) => {
    mutators.change(e ? e.split(',') : '')
  }
  const { placeholder, dataSource = dateMemo, ...rest } = props || {}
  // const val = !value || !value.length ? undefined : value.join()
  const val = !value || !value.length ? undefined : value

  return (
    <Select
      style={{ minWidth: 160 }}
      placeholder={placeholder}
      onChange={handleChange}
      value={val}
      options={dataSource}
      {...rest}
    />
  )
}

DateSelect.defaultProps = {}

DateSelect.isFieldComponent = true

export default DateSelect
