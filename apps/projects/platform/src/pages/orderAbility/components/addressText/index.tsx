import React from 'react'

/**
 * 待新增 销售发货单/采购收货单/物流单详情 仅供显示收货地址
 * @param props
 * @returns
 */

const AddressText = (props) => {
  return (
    <div {...props.props['x-component-props']}>
      <p style={{ margin: 0, height: 22 }}>
        {props.value?.consignee}/{props.value?.phone}
      </p>
      <p style={{ color: '#909399', margin: 0, height: 22 }}>
        {props.value?.areaName}
        {props.value?.address}
      </p>
    </div>
  )
}

AddressText.defaultProps = {}

AddressText.isFieldComponent = true

export default AddressText
