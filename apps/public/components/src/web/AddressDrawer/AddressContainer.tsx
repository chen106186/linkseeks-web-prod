import { Button, Drawer, Input } from '@linkseeks/ui'
import React, { CSSProperties, useEffect } from 'react'
import { useToggle } from '@linkseeks/hooks'
import { AddressProvider, useAddressContext } from './AddressContext'
import { AddressSelectDrawer } from './AddressSelectDrawer'

export interface AddressContainerProps extends AddressWrapperProps {
  value?: any
  onChange?(value: any): void
  disabled?: boolean
}

export interface AddressWrapperProps {
  containerStyle?: CSSProperties
  containerClass?: string
}

export const AddressContainer = (props: AddressContainerProps) => {
  const { value, onChange, disabled, ...wrapperProps } = props
  return (
    <AddressProvider {...props}>
      <AddressWrapper {...wrapperProps} />
    </AddressProvider>
  )
}

const AddressWrapper = (props) => {
  const { containerStyle, containerClass } = props
  const { addressTextValue, fetchAddressList } = useAddressContext()
  const [addressVisible, toggleVisible] = useToggle(false)
  const handleOpenAddress = () => {
    toggleVisible()
  }

  useEffect(() => {
    if (addressVisible) {
      fetchAddressList()
    }
  }, [addressVisible])
  return (
    <Input.Group compact style={containerStyle} className={containerClass}>
      <Input style={{ flex: 1, width: 'calc(100% - 80px)' }} value={addressTextValue} disabled />
      <Button type="primary" onClick={handleOpenAddress}>
        更改
      </Button>
      <AddressSelectDrawer open={addressVisible} toggleVisible={toggleVisible} />
    </Input.Group>
  )
}
