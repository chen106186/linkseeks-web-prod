import { Button, Drawer, Input } from '@linkseeks/ui'
import React, { CSSProperties, useEffect } from 'react'
import { useToggle } from '@linkseeks/hooks'
import { BLOCK_STATUS } from '@apps/services'
import AddressManageSelectDrawer from '../AddressManageSelectDrawer'
import { ADDRESS_TYPE } from '../AddressBaseForm'
import { useWebIntl } from '@apps/locales'

export interface AddressContainerProps extends AddressManageSelectFormItemProps {
  value?: any
  onChange?(value: any): void
  disabled?: boolean
}

export interface AddressManageSelectFormItemProps {
  containerStyle?: CSSProperties
  containerClass?: string
}

export const AddressManageSelectFormItem = (props: AddressContainerProps) => {
  const { containerStyle, containerClass, value, ...resetProps } = props
  const drawerRef = AddressManageSelectDrawer.useRef({ type: ADDRESS_TYPE.DELIVERY })
  const translate = useWebIntl()
  const handleOpenAddress = () => {
    drawerRef.toggle(BLOCK_STATUS.EDIT)
  }

  return (
    <Input.Group compact style={containerStyle} className={containerClass}>
      <Input
        style={{ flex: 1, width: 'calc(100% - 80px)' }}
        value={value?.sendAddress || value?.fullAddress}
        disabled
      />
      <Button type="primary" onClick={handleOpenAddress}>
        {translate('web.common.select')}
      </Button>
      <AddressManageSelectDrawer actionRef={drawerRef} value={value} {...resetProps} />
    </Input.Group>
  )
}
