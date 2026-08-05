import { View, PickerView, PickerViewColumn } from '@tarojs/components'
import React, { useCallback, useEffect, useState } from 'react'
import ActionSheet from '../action-sheet'
import { PickerViewProps } from '../../types/picker'
import { default as AntdPickerView } from './antd-date-picker/picker-view'
import Button from '../Button'
import { useMobileIntl } from '@apps/locales'

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

/***********************组件开始 ****************/
const DatePickerView: React.FC<PickerViewProps & { columns: any[]; value: any }> = (props) => {
  const { visible, columns, value, onConfirm, onChange, cancelText, submitText, title, ...restSheetProps } = props
  const [pickerValue, setPickerValue] = useState<number[]>([])

  useEffect(() => {
    if (value && value.length > 0 && columns && columns.length > 0) {
      // 找到年份、月份和日期分别对应的索引
      const yearIndex = columns[0] ? columns[0].indexOf(value[0]) : -1
      const monthIndex = columns[1] ? columns[1].indexOf(value[1]) : -1
      const dayIndex = columns[2] ? columns[2].indexOf(value[2]) : -1
      const result = []
      if (yearIndex > -1) result.push(yearIndex)
      if (monthIndex > -1) result.push(monthIndex)
      if (dayIndex > -1) result.push(dayIndex)

      setPickerValue(result)
    }
  }, [value, columns])

  const [_visible, setVisible] = useState(visible)

  const translate = useMobileIntl()

  const handleChangeSheet = useCallback(() => {
    setVisible(visible !== undefined ? visible : !_visible)
  }, [visible, _visible])

  const handleConfirm = () => {
    handleChangeSheet()
    const result = []
    const year = columns[0] && pickerValue[0] ? columns[0][pickerValue[0]] : ''
    const month = columns[1] && pickerValue[1] ? columns[1][pickerValue[1]] : ''
    const day = columns[2] && pickerValue[2] ? columns[2][pickerValue[2]] : ''

    if (year) result.push(year)
    if (month) result.push(month)
    if (day) result.push(day)
    onConfirm && onConfirm(result)
  }

  const handleChange = (e: any) => {
    setPickerValue(e.detail.value)
  }

  return (
    <View>
      <View className="PickerView-emit-container" onClick={handleChangeSheet}>
        {props.children}
      </View>

      <ActionSheet isOpened={_visible} onClose={handleChangeSheet} {...restSheetProps}>
        <View className="dtp-picker-btns">
          <Button size="small" onClick={handleChangeSheet}>
            {cancelText || translate('mobile.common.quxiao')}
          </Button>
          {title && title}
          <Button size="small" type="primary" onClick={handleConfirm}>
            {submitText || translate('mobile.common.queding')}
          </Button>
        </View>
        <PickerView value={pickerValue} onChange={handleChange} style={{ height: 240 }}>
          {columns &&
            columns.length > 0 &&
            columns.map((columnItem, columnItemIndex) => (
              <PickerViewColumn key={columnItemIndex}>
                {columnItem.map((item: any) => (
                  <View key={item} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item}
                  </View>
                ))}
              </PickerViewColumn>
            ))}
        </PickerView>
      </ActionSheet>
    </View>
  )
}

DatePickerView.defaultProps = {}

export default DatePickerView
