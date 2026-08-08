import { CommonEventFunction, PickerView, PickerViewColumn, View } from '@tarojs/components'
import { getEnv, ENV_TYPE } from '@tarojs/taro'
import React, { useCallback, useRef, useState } from 'react'
import ActionSheet from '../action-sheet'
import Button from '../Button'
import Text from '../text'
import dayjs from 'dayjs'
import { PickerViewProps } from '@tarojs/components/types/PickerView'
import { DateTimePickerProps } from '../../types/picker'

import DateTimePickerH5 from './dateTimePicker.h5'
import { useMobileIntl } from '@apps/locales'
const ENV = getEnv()
const IS_WEB = ENV === ENV_TYPE.WEB

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

/**
 * 从传入的参数获取数组长度， 并且从1开始填充到指定长度
 */
const fillNumberArr = (arrLen: number, allowZero?: boolean) =>
  new Array(arrLen).fill(0).map((_, i) => (allowZero ? i : i + 1))

/**
 * 月份列表
 */
const MONTH_LIST = {
  leap: fillNumberArr(29), // 闰月
  mini: fillNumberArr(28), // 闰月
  small: fillNumberArr(30), // 小月
  big: fillNumberArr(31), // 大月
}

/**
 * 获取对应月份的实际天数
 * @param month 当前月份
 * @param isLeap 是否是闰月
 */
const getDaysList = (month: number, isLeap: boolean) => {
  if (month === 2) {
    return isLeap ? MONTH_LIST.leap : MONTH_LIST.mini
  } else {
    const bigMonth = [1, 3, 5, 7, 8, 10, 12]
    return bigMonth.includes(month) ? MONTH_LIST.big : MONTH_LIST.small
  }
}

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

/**
 * 一年的月份
 */
const monthArea = fillNumberArr(12)

/**
 * 一天的小时
 */
const hourArea = fillNumberArr(24, true)

/**
 * 一小时的分钟
 */
const miniteArea = fillNumberArr(59)

// 开启闰月检测插件
dayjs.extend(isLeapYear)

/***********************组件开始 ****************/
const DateTimePicker: React.FC<DateTimePickerProps> = (props) => {
  const { visible, max, min, value, onConfirm, onChange, format, ...restSheetProps } = props

  // 获取应显示的年份区间, 默认为10年
  const yearArea = new Array(max!.getFullYear() - min!.getFullYear()).fill(0).map((_, i) => min!.getFullYear() + i)

  const dataRef = useRef({
    prevDate: [0, 0, 0, 0, 0],
  })

  const translate = useMobileIntl()

  const [_value, _setValue] = useState(dayjs(value || new Date()))

  const [_visible, setVisible] = useState(visible)

  const [dayArea, setDayArea] = useState<number[]>(
    getDaysList(_value.month(), dayjs().year(_value.year()).isLeapYear()),
  )

  const setValue: React.Dispatch<React.SetStateAction<dayjs.Dayjs>> = useCallback(
    (v: dayjs.Dayjs) => {
      if (value) {
        // 传入了value，则将控制权交给外部
        onChange && onChange(v.toDate())
        return
      }
      _setValue(v)
    },
    [value],
  )

  const handleChangeSheet = useCallback(() => {
    setVisible(visible !== undefined ? visible : !_visible)
  }, [visible, _visible])

  const getDateIndex = useCallback(
    (date: dayjs.Dayjs) => {
      const dateObj = dayjs(date)
      return [
        yearArea.findIndex((i) => i === dateObj.year()),
        monthArea.findIndex((i) => i === dateObj.month() + 1),
        dayArea.findIndex((i) => i === dateObj.date()),
        hourArea.findIndex((i) => i === dateObj.hour()),
        miniteArea.findIndex((i) => i === dateObj.minute()),
      ]
    },
    [_value],
  )

  const handleChange: CommonEventFunction<PickerViewProps.onChangeEventDetail> = useCallback(
    (e) => {
      const { value } = e.detail
      const { prevDate } = dataRef.current
      const year = value[0]
      const month = value[1]
      const day = value[2]
      const hour = value[3]
      const minite = value[4]
      const prevYear = prevDate[0]
      const prevMonth = prevDate[1]

      if (year !== prevYear || month !== prevMonth) {
        // 是年或者月发生变化, 需要更新日, 并且判断当前年是否为闰年
        setDayArea(getDaysList(monthArea[month], dayjs().year(yearArea[year]).isLeapYear()))
      }
      dataRef.current.prevDate = value
      setValue(dayjs(`${yearArea[year]}-${monthArea[month]}-${dayArea[day]} ${hourArea[hour]}:${miniteArea[minite]}`))
    },
    [dayArea],
  )

  const handleConfirm = () => {
    handleChangeSheet()
    onConfirm && onConfirm(format ? dateFormat(_value.toDate(), format) : _value.toDate())
  }

  const renderPickerItem = (pickers: number[]) => pickers.map((v) => <View className="dtp-picker-item">{v}</View>)
  if (IS_WEB) {
    return <DateTimePickerH5 {...props} />
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
        <PickerView className="dtp-picker-container" onChange={handleChange} value={getDateIndex(_value)}>
          <PickerViewColumn>{renderPickerItem(yearArea)}</PickerViewColumn>

          <PickerViewColumn>{renderPickerItem(monthArea)}</PickerViewColumn>

          <PickerViewColumn>{renderPickerItem(dayArea)}</PickerViewColumn>

          <PickerViewColumn>{renderPickerItem(hourArea)}</PickerViewColumn>

          <PickerViewColumn>{renderPickerItem(miniteArea)}</PickerViewColumn>
        </PickerView>
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
