import { View } from '@tarojs/components'
import React, { useCallback, useState } from 'react'
import ActionSheet from '../action-sheet'
import dayjs from 'dayjs'
import { DateTimePickerProps } from '../../types/picker'
import DatePickerView from './antd-date-picker/date-picker-view'
import Button from '../Button'
import Text from '../text'
import { useMobileIntl } from '@apps/locales'

declare module 'dayjs' {
  interface Dayjs {
    isLeapYear(): boolean
  }
}

const isLeapYear = (_, c) => {
  const proto = c.prototype
  proto.isLeapYear = function () {
    return (this.$y % 4 === 0 && this.$y % 100 !== 0) || this.$y % 400 === 0
  }
}

/**
 * 一年的时间，精度为秒
 */
const DIS_DATE_TIME = 10 * 365 * 24 * 60 * 60 * 1000

export const dateFormat = (date: Date, fmt: string = 'YYYY-MM-DD HH:mm:ss'): string => {
  let ret
  const opt: { [key: string]: string } = {
    'Y+': date.getFullYear().toString(), // 年
    'M+': (date.getMonth() + 1).toString(), // 月
    'D+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'm+': date.getMinutes().toString(), // 分
    's+': date.getSeconds().toString(), // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  }
  let newfmt = fmt
  Object.keys(opt).forEach((k) => {
    ret = new RegExp(`(${k})`).exec(fmt)
    if (ret) {
      newfmt = newfmt.replace(ret[1], ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, '0'))
    }
  })
  return newfmt
}

// 开启闰月检测插件
dayjs.extend(isLeapYear)

/***********************组件开始 ****************/
const DateTimePicker: React.FC<DateTimePickerProps> = (props) => {
  const { visible, max, min, value, onConfirm, onChange, format, precision = 'second', ...restSheetProps } = props

  const [_value, _setValue] = useState(new Date(value || new Date()))

  const [_visible, setVisible] = useState(visible)

  const translate = useMobileIntl()

  const setValue: React.Dispatch<React.SetStateAction<Date>> = useCallback(
    (v: Date) => {
      if (value) {
        // 传入了value，则将控制权交给外部
        onChange && onChange(v)
        return
      }
      _setValue(v)
    },
    [value],
  )

  const handleChangeSheet = useCallback(() => {
    setVisible(visible !== undefined ? visible : !_visible)
  }, [visible, _visible])

  const handleChange = useCallback((value: Date) => {
    setValue(value)
  }, [])

  const handleConfirm = () => {
    handleChangeSheet()
    onConfirm && onConfirm(format ? dayjs(_value).format(format) : dayjs(_value).toDate())
  }

  return (
    <View>
      <View className="dateTimePicker-emit-container" onClick={handleChangeSheet}>
        {props.children}
      </View>

      <ActionSheet isOpened={_visible} onClose={handleChangeSheet} {...restSheetProps}>
        <View className="dtp-picker-btns">
          <Button size="small" onClick={handleChangeSheet}>
            {translate('mobile.common.quxiao')}
          </Button>
          <Text className="dtp-picker-title">{translate('mobile.common.riqixuanze')}</Text>
          <Button size="small" type="primary" onClick={handleConfirm}>
            {translate('mobile.common.queding')}
          </Button>
        </View>
        <View>
          <DatePickerView value={_value} onChange={handleChange} precision={precision} min={min} max={max} />
        </View>
      </ActionSheet>
    </View>
  )
}

DateTimePicker.defaultProps = {
  min: getDistanceDate(-DIS_DATE_TIME),
  max: getDistanceDate(DIS_DATE_TIME),
}

function getDistanceDate(disTimeStamp: number) {
  return new Date(new Date().getTime() + disTimeStamp)
}

export default DateTimePicker
