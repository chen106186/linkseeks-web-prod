import React, { useRef, useState, useMemo } from 'react'
import { DatePicker, Form } from '@linkseeks/ui'
import moment from 'moment'
import { useFormTable } from '../../../contexts'
const FormItem = Form.Item
const { RangePicker } = DatePicker

const defaultFormat = 'YYYY-MM-DD'
const DateRange = ({ name, placeholder, format, ...resetProps }: any) => {
  const { formSearchRef } = useFormTable()
  const [startTime, setStartTime] = useState<number | null>(formSearchRef.getFieldValue(name[0]))
  const [endTime, setEndTime] = useState<number | null>(formSearchRef.getFieldValue(name[1]))
  const _value: any = useMemo(() => {
    let _value: any = []
    if (startTime) {
      _value.push(moment(startTime))
    }
    if (endTime) {
      _value.push(moment(endTime))
    }
    return _value
  }, [startTime, endTime])
  if (Array.isArray(name)) {
    const handleChange = (dates, dateString) => {
      const _startTime = dateString[0] ? moment(dateString[0]).startOf('day').valueOf() : null
      const _endTime = dateString[1] ? moment(dateString[1]).endOf('day').valueOf() : null
      setStartTime(_startTime)
      setEndTime(_endTime)

      if (format) {
        if (typeof format === 'string') {
          formSearchRef.setFieldValue(name[0], moment(dateString[0]).format(format))
          formSearchRef.setFieldValue(name[1], moment(dateString[1]).format(format))
        } else {
          formSearchRef.setFieldValue(name[0], moment(dateString[0]).format(defaultFormat))
          formSearchRef.setFieldValue(name[1], moment(dateString[1]).format(defaultFormat))
        }
      } else {
        formSearchRef.setFieldValue(name[0], _startTime)
        formSearchRef.setFieldValue(name[1], _endTime)
      }
    }

    return (
      <FormItem noStyle>
        <FormItem noStyle name={name[0]} fieldId={name[0]} hidden />
        <FormItem noStyle name={name[1]} fieldId={name[1]} hidden />
        <RangePicker
          // showTime={true}
          style={{ minWidth: 160 }}
          placeholder={placeholder}
          onChange={handleChange}
          allowClear={false}
          value={_value}
          {...resetProps}
        />
      </FormItem>
    )
  } else {
    console.error('DateRange 必须传入数组类型的name， [startTime, endTime]')
    return null
  }
}

export default DateRange
