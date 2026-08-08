/*
 * @Author: XieZhiXiong
 * @Date: 2021-08-05 14:54:18
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-10 16:42:18
 * @Description:
 */
import React from 'react'
import { connect } from '@apps/formily'
import AddressRadioGroup from '../AddressRadioGroup'

const AddressRadioGroupFormilyItem = connect()((props) => {
  const { dataSource, value, onChange, addressType, isDefault, disabled, ...rest } = props
  return (
    <div style={{ flex: 1, overflow: 'hidden' }}>
      <AddressRadioGroup
        addressType={addressType}
        isDefault={isDefault}
        disabled={disabled}
        value={value}
        onChange={onChange}
        {...rest}
      />
    </div>
  )
})

export default AddressRadioGroupFormilyItem
