import { getLogisticsShipperAddressGet } from '@apps/apis';
import { Radio, Button } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import styles from './AddressDrawer.less'

export const AddressRaioContext = React.createContext([]);

export const AddressRaioContextProvider = AddressRaioContext.Provider;

/**
 * FormItem 修个值
 */
interface AddressRaioProps {
  onChange?: (value) => void
  onEdit?: (address) => void
  info: (val) => Promise<any>
}

function AddressRaio(props: AddressRaioProps) {
  const { onEdit, info } = props;

  const addrList = useContext(AddressRaioContext);

  return (
    <>
      {addrList.map(addr => (
        <div className='flex mb-14' key={addr.id}>

          <div className='_left felx-auto'>
            <Radio className={styles['antRadioWrapperItems']} value={JSON.stringify(addr)}>
              <div className='address_base ml-10'>
                <span>{addr.shipperName}</span>
                <span>{addr.phone}</span>
                {addr.isDefault === 1 && <span>默认地址</span>}

              </div>
              <div className='address_decs ml-10'>
                {addr.fullAddress}
              </div>
            </Radio>
          </div>

          <div className={`_right flex flex-1  justify-end ${styles["antRadioWrapperItems"]}`}>
            <Button.Group size='small'>
              <Button onClick={() => {
                if (onEdit) {
                  info({ id: addr.id }).then(res => {
                    onEdit(res.data)
                  })
                }
              }}>
                编辑
              </Button>

            </Button.Group>
          </div>
        </div>
      ))}
    </>
  )
}

export default AddressRaio
