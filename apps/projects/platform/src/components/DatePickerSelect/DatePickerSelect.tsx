import { DatePicker, FormInstance } from 'antd';
import moment from 'moment';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react';


interface DatePickerSelectProps {
  defualtToday?: boolean
  onChange?: Function
  className?: string
  value?: any
  disabled?: boolean
  hidden?: boolean
  errorMsg?: any
  formProp?: FormInstance
  id?: string
}

/**
 * antd From 的时间选择器封装
 * @param defualtToday 是否默认实现为今日
 * @returns 
 */
function DatePickerSelect(props: DatePickerSelectProps) {

  const {
    defualtToday = false,
    onChange,
    className,
    value,
    disabled = false,
    hidden = false,
    errorMsg = '',
    formProp,
    id
  } = props;

  const dom = useRef<any>(null)

  const disabledDate = (current) => {
    return current && current < moment().startOf('day');
  }

  useEffect(() => {
    if (errorMsg.length > 0) {
      dom.current.focus()
    } else {
      dom.current.blur()
    }

  }, [
    errorMsg
  ])

  const renderDefaultValue = () => {
    if (defualtToday) {
      let result = moment().startOf('day')
      if (undefined !== formProp) {
        formProp.setFieldsValue({
          [id]: result
        })
      }
    }
  }

  useEffect(() => {
    renderDefaultValue()
  }, [])

  return (
    <DatePicker
      ref={dom}
      autoFocus
      style={{
        display: hidden ? 'none' : 'block'
      }}
      className={className}
      disabledDate={disabledDate}
      disabled={disabled}
      value={value}
      onChange={(v) => {
        onChange(v)
      }} />
  )
}

function DatePickerSelectRangePicker(props) {
  return (
    <DatePicker.RangePicker {...props} />
  )
}

DatePickerSelect.RangePicker = DatePickerSelectRangePicker
DatePickerSelect.TimePicker = DatePicker.TimePicker

export default DatePickerSelect;