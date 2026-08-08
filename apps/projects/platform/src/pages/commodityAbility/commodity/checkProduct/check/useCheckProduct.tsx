import { usePageStatus } from '@/hooks/usePageStatus'
import { postProductCommodityPlatformCheckCommodity } from '@apps/apis'
import { useHistory } from '@linkseeks/router-core'
import { Form } from '@linkseeks/ui'
import { useState } from 'react'

export const useCheckProduct = () => {
  const { id } = usePageStatus()
  const [visibleModal, setVisibleModal] = useState<boolean>(false)
  const history = useHistory()
  const [checkStatus, setCheckStatus] = useState<number>(4)

  const handleCancel = () => {
    setVisibleModal(false)
  }

  const handleOK = (values) => {
    postProductCommodityPlatformCheckCommodity({ id: id, ...values }).then((res) => {
      if (res.code === 1000) {
        handleCancel()
        history.back()
      }
    })
  }

  const handleStatusChange = (value: any) => {
    setCheckStatus(value.target.value)
  }

  const handleApplyCheck = () => {
    setVisibleModal(true)
  }

  return {
    handleOK,
    visibleModal,
    handleCancel,
    checkStatus,
    handleStatusChange,
    handleApplyCheck,
  }
}
