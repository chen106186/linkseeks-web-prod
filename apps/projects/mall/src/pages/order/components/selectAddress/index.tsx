import React, { useEffect, useState } from 'react'
import { Modal, Radio } from 'antd'
import { getWebIntl } from '@/utils/locales'
import { StoreAddressItemType } from '../../types'
import styles from './index.module.less'

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

  useEffect(() => {
    setSelectKey(value)
  }, [value])

  const translate = getWebIntl()

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
      open={visible}
      centered
      onCancel={onCancel}
      onOk={handleConfirm}
      title={translate('web.resource.logistics.xuanzezitidizhi')}
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
