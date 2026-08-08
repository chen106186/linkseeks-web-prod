import React, { useEffect, useMemo, useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import Group from '../Group'
import { calculateTime, subtractDate } from './utils'

export type DateValueType = 'last1month' | 'last3month' | 'last6month' | 'thisYear' | 'last1year' | 'last2year'

export type DateRangeValueType = {
  name: string
  value: DateValueType
  range: Date[]
}

interface DateGroupProps {
  /**
   * 值
   */
  value?: DateValueType
  /**
   * 点击触发改变时间，值为长度为2的时间戳数组
   */
  onChange?: (value: DateRangeValueType) => void
}

const currentDate = calculateTime(0)

const DateGroup: React.FC<DateGroupProps> = (props: DateGroupProps) => {
  const { value, onChange } = props
  const [innerValue, setInnerValue] = useState<DateValueType | 0>(0)
  const intl = useIntl()
  const DATE_RANGE: DateRangeValueType[] = [
    {
      name: intl.formatMessage({ id: 'filterModal_dateGroup_last1month', defaultMessage: '1个月内' }),
      value: 'last1month',
      range: [subtractDate(calculateTime(0), 1, 'month'), currentDate],
    },
    {
      name: intl.formatMessage({ id: 'filterModal_dateGroup_last3month', defaultMessage: '3个月内' }),
      value: 'last3month',
      range: [subtractDate(calculateTime(0), 3, 'month'), currentDate],
    },
    {
      name: intl.formatMessage({ id: 'filterModal_dateGroup_last6month', defaultMessage: '6个月内' }),
      value: 'last6month',
      range: [subtractDate(calculateTime(0), 6, 'month'), currentDate],
    },
    {
      name: intl.formatMessage({ id: 'filterModal_dateGroup_thisYear', defaultMessage: '今年' }),
      value: 'thisYear',
      range: [new Date(new Date().getFullYear(), 0, 1), new Date(new Date().getFullYear(), 11, 31, 23, 59, 59, 59)],
    },
    {
      name: intl.formatMessage({ id: 'filterModal_dateGroup_last1year', defaultMessage: '1年前' }),
      value: 'last1year',
      range: [subtractDate(calculateTime(0), 1, 'year'), currentDate],
    },
    {
      name: intl.formatMessage({ id: 'filterModal_dateGroup_last2year', defaultMessage: '2年前' }),
      value: 'last2year',
      range: [subtractDate(calculateTime(0), 2, 'year'), currentDate],
    },
  ]
  const dataSource = useMemo(() => DATE_RANGE.map((item) => ({ name: item.name, value: item.value })), [])

  useEffect(() => {
    if ('value' in props) {
      setInnerValue(value!)
    }
  }, [value])

  const handleSelect = (next: string | number) => {
    if (!('value' in props)) {
      setInnerValue(next as DateValueType)
    }
    const current = DATE_RANGE.find((item) => next === item.value)
    if (current) {
      onChange?.(current)
    }
  }

  return (
    <Group
      title={intl.formatMessage({ id: 'filterModal_dateGroup_title', defaultMessage: '时间' })}
      dataSource={dataSource}
      value={innerValue}
      onClick={handleSelect}
    />
  )
}

DateGroup.defaultProps = {
  onChange: undefined,
}

export default DateGroup
