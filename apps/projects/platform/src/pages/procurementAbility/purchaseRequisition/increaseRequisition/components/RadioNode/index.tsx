import { Col, Radio } from 'antd'
import React, { useState, useEffect } from 'react'
import { getWebIntl } from '@apps/locales'
import styles from '../../index.less'

const RadioNode = (props) => {
  const { form, mutators } = props
  const [deliveryTypeList, setdeliveryTypeList] = useState([])
  const deliveryType = props.props['x-component-props'].list
  const translate = getWebIntl()

  const changeDeliveryType = (e) => {
    form.setFieldState(props.props.key, (state) => {
      state.props.deliveryType = e.target.value
      // 如果他选择的客户自提 就让他恢复默认的输入框
      const Address = form.getFieldState('deliveryAddressId')
      console.log(Address)
      if (Address.value) {
        const name = Address.value.name ? Address.value.name : Address.value.receiverName
        const addres = Address.value.fullAddress
          ? Address.value.fullAddress
          : Address.value.streetName + Address.value.address + Address.value.phone
        form.setFieldValue('deliveryAddress', `${name} - ${addres}`)
      }
      // form.setFieldState('deliveryAddress', (state) => {
      //   state.visible = Address.visible
      // })
      form.setFieldState('deliveryAddressId', (state) => {
        state.visible = false
      })
    })
    mutators.change(e.target.value)
  }

  useEffect(() => {
    if (!deliveryType.find((i) => i.deliveryType === 999)) {
      deliveryType.unshift({
        deliveryType: 999,
        deliveryTypeName: translate('web.resource.order.buxanze'),
        disabled: false,
      })
    }
    setdeliveryTypeList(deliveryType)
  }, [deliveryType])

  return (
    <Radio.Group
      onChange={(value) => changeDeliveryType(value)}
      // value={props.props.deliveryType}
      value={props.value}
      {...props.props['x-component-props']}
    >
      <div className={styles.RadioMian}>
        {deliveryTypeList.map((item: any) => (
          <div
            className={`${styles.RadioItem} ${item.deliveryType == props.deliveryType ? styles.Select : ''}`}
            key={item.deliveryType}
          >
            <Radio value={item.deliveryType} disabled={item.disabled}>
              {item.deliveryTypeName}
            </Radio>
          </div>
        ))}
      </div>
    </Radio.Group>
  )
}

RadioNode.defaultProps = {}

RadioNode.isFieldComponent = true

export default RadioNode
