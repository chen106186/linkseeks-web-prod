/*
 * @Author: GHua
 * @Date: 2022-03-02 15:01:42
 * @LastEditTime: 2022-04-01 15:40:59
 * @LastEditors: GHua
 * @Description: 选择地址模态框
 */
import React, { useEffect, useState } from 'react'
import { Modal, Radio } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { StoreAddressItemType } from '../../types'
import styles from './index.less'

export interface SelectAddressProps {
  visible: boolean
  value: number | undefined
  addressList: StoreAddressItemType[]
  onCancel: () => void
  onOk: (storeAddressItem: StoreAddressItemType) => void
}

const SelectAddress: React.FC<SelectAddressProps> = (props) => {
  const { visible, addressList, value, onCancel, onOk } = props
  const [selectKey, setSelectKey] = useState<number>()
  const intl = useIntl()
  useEffect(() => {
    setSelectKey(value)
  }, [value])

  const handleKeyChange = (e: any) => {
    setSelectKey(e.target.value)
  }

  const handleConfirm = () => {
    if (selectKey !== value) {
      const selectItem = addressList.filter((item) => item.id === selectKey)[0]
      onOk && onOk(selectItem)
    } else {
      onCancel && onCancel()
    }
  }

  return (
    <Modal
      visible={visible}
      centered
      onCancel={onCancel}
      onOk={handleConfirm}
      title={intl.formatMessage({ id: 'order.selectAddress.title', defaultMessage: '选择自提地址' })}
    >
      <Radio.Group className={styles.address_raido_group} value={selectKey} onChange={handleKeyChange}>
        <div className={styles.address_list}>
          {addressList &&
            addressList.length > 0 &&
            addressList.map((item) => (
              <Radio className={styles.address_list_radio} value={item.id} key={`address_list_radio_${item.id}`}>
                <div className={styles.adderss_list_radio_line}>
                  <span>{item.shipperName}</span>
                  <span>{item.phone}</span>
                </div>
                <div className={styles.adderss_list_radio_line}>
                  <span className={styles.fullAddress}>{item.fullAddress}</span>
                </div>
              </Radio>
            ))}
        </div>
      </Radio.Group>
    </Modal>
  )
}

export default SelectAddress
