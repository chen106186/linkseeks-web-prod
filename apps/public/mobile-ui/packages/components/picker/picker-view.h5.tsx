import { View } from '@tarojs/components'
import React, { useCallback, useState } from 'react'
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
const PickerView: React.FC<PickerViewProps> = (props) => {
  const { visible, columns, value, onConfirm, onChange, cancelText, submitText, title, ...restSheetProps } = props

  const [_visible, setVisible] = useState(visible)

  const translate = useMobileIntl()

  const handleChangeSheet = useCallback(() => {
    setVisible(visible !== undefined ? visible : !_visible)
  }, [visible, _visible])

  const handleConfirm = () => {
    handleChangeSheet()
    onConfirm && onConfirm(value)
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
        <View>
          <AntdPickerView value={value} columns={columns} onChange={onChange} />
        </View>
      </ActionSheet>
    </View>
  )
}

PickerView.defaultProps = {}

export default PickerView
