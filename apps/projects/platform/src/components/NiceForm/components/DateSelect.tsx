import React, { useRef, useEffect, useMemo } from 'react'
import { Select } from 'antd'
import moment from 'moment'
import { useIntl } from '@linkseeks/i18n'
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
  return moment().startOf('day').subtract(num, flag).valueOf()
}

const DateSelect = (props) => {
  const { value, mutators } = props
  const intl = useIntl()
  const todayStartTime = moment().startOf('day').format('x')
  const nowTime = moment().endOf('day').format('x')
  const dateMemo = useMemo(
    () => [
      { label: intl.formatMessage({ id: 'components.jintian' }), value: `${todayStartTime},${nowTime}` },
      { label: intl.formatMessage({ id: 'components.yizhounei' }), value: `${getPrevTime(1, 'week')},${nowTime}` },
      { label: intl.formatMessage({ id: 'components.yiyuenei' }), value: `${getPrevTime(1, 'month')},${nowTime}` },
      { label: intl.formatMessage({ id: 'components.sanyuenei' }), value: `${getPrevTime(3, 'month')},${nowTime}` },
      { label: intl.formatMessage({ id: 'components.liuyuenei' }), value: `${getPrevTime(6, 'month')},${nowTime}` },
      { label: intl.formatMessage({ id: 'components.yiniannei' }), value: `${getPrevTime(1, 'year')},${nowTime}` },
      { label: intl.formatMessage({ id: 'components.yinianqian' }), value: `0,${getPrevTime(1, 'year')}` },
    ],
    [],
  )

  const handleChange = (e) => {
    mutators.change(e ? e.split(',') : '')
  }
  const { placeholder, dataSource = dateMemo, ...rest } = props.props['x-component-props'] || {}
  const val = !value || !value.length ? undefined : value.join()

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
