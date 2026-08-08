/*
 * @Author: XieZhiXiong
 * @Date: 2021-08-05 11:26:43
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-19 17:34:18
 * @Description:
 */
import React from 'react'
import { connect } from '@apps/formily'
import AddressSelect from '@/components/AddressSelect'

const mapTextComponent = (
  Target: React.JSXElementConstructor<any>,
  props: any = {},
  fieldProps: any = {},
): React.JSXElementConstructor<any> => {
  const { editable, value } = fieldProps
  const xComponentProps = fieldProps.props['x-component-props'] || {}
  if (editable !== undefined) {
    if (editable === false) {
      return () => <AddressSelect value={value} editable={false} {...xComponentProps} />
    }
  }
  return Target
}

const CustomAddressSelect = connect({
  getComponent: mapTextComponent,
})((props) => {
  const { dataSource, value, onChange, addressType, isDefault, disabled, ...rest } = props
  return (
    <div style={{ flex: 1, overflow: 'hidden' }}>
      <AddressSelect
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

export default CustomAddressSelect
