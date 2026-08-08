import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useControllableValue, useMemoizedFn, useRequestApi } from '@linkseeks/hooks'
import { getLogisticsSelectListShipperAddress } from '@apps/apis'
import { Form } from '@linkseeks/ui'
const AddressContext = createContext<ReturnType<typeof initValue>>({} as any)

const initValue = (props: any) => {
  const [state, setState] = useControllableValue(props)
  const [addressTextValue, setAddressTextValue] = useState('')
  const [formInstance] = Form.useForm()
  const { data, loading, run } = useRequestApi(getLogisticsSelectListShipperAddress, {
    manual: true,
    cacheKey: 'address',
    cacheTime: 3000,
  })

  const handleChangeAddress = useMemoizedFn((addressId: any) => {
    setState(addressId)
  })

  useEffect(() => {
    if (state) {
      setAddressTextValue(data?.find((v) => v.id === state)?.fullAddress || '')
    }
  }, [state, data])

  return {
    addressValue: state,
    addressTextValue,
    handleChangeAddress,
    addressList: data,
    fetchAddressList: run,
    fetchAddressLoading: loading,
    formInstance,
  }
}
export const AddressProvider = (props: any) => {
  const value = initValue(props)
  return <AddressContext.Provider value={value}>{props.children}</AddressContext.Provider>
}

export const useAddressContext = () => useContext(AddressContext)
