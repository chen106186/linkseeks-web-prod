import React, { useEffect, useState } from 'react'
// import { PickerView, PickerViewColumn } from '@tarojs/components''
import { View, Text, PickerView } from '@apps/mobile-ui'
import { useIntl } from '@linkseeks/i18n'
import './index.scss'


interface AddressPickerProps {
  SelectList: any,
  // 显示控制
  selectvisible?: boolean,
  // 关闭方法
  onClose?: () => void,
  // 确定方法
  onSelect?: (item: any) => void,
  // 子元素
  children?: React.ReactChild,
}
const Select = (props: AddressPickerProps) => {
  const { selectvisible, onClose, onSelect, SelectList, children } = props;
  const [SelectKey, setSelectKey] = useState<any>({})
  const intl = useIntl()
  /* 监听滚动的值 */
  const handlePickerChange = async (val) => {
    setSelectKey(val[0]);
  }

  const handleSelect = () => {
    const _selectItem = SelectList.find((item) => item.value === SelectKey)
    onSelect && onSelect(_selectItem);
    onClose && onClose();
  }
  return (
    <PickerView
      cancelText={intl.formatMessage({id: 'addressPicker_cancel'})}
      submitText={intl.formatMessage({id: 'addressPicker_confirm'})}
      title={' '}
      columns={[SelectList]}
      value={[SelectKey]}
      onConfirm={handleSelect}
      onChange={(val) => { handlePickerChange(val) }}
    >
      {children}
    </PickerView>
  )
}
export default Select;
