import { useState } from 'react'
import { getCurrentInstance } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'

const useEditRfqOtherInfo = () => {
  const {
    params: { onSubmit, offer, paymentType, taxes, logistics, packRequire, otherRequire },
  }: any = getCurrentInstance().preloadData
  const [query, setQuery] = useState<any>({
    offer,
    paymentType,
    taxes,
    logistics,
    packRequire,
    otherRequire,
  })
  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        other: query,
      })
      Router.navigateBack()
    }
  }
  /** 输入  */
  const handleInput = (value: any, name: string) => {
    const params = { ...query }
    params[name] = value
    setQuery({ ...params })
  }
  return {
    query,
    handleSubmit,
    handleInput,
  }
}

export default useEditRfqOtherInfo
