import { usePageStatus } from '@/hooks/usePageStatus'
import { postProductCommodityPlatformCheckCommodity } from '@apps/apis'
import { BatchApprovedModal } from '@apps/components'
import PublicDetail from '@apps/services/commodity/publicDetail'
import { useHistory } from '@linkseeks/router-core'
import { Modal, Form, Radio, Input, Button } from '@linkseeks/ui'
import { useState } from 'react'

const { TextArea } = Input
export default () => {
  const [checkForm] = Form.useForm()
  const [visibleModal, setVisibleModal] = useState<boolean>(false)
  const { id } = usePageStatus()
  const history = useHistory()
  const [disableCheck, setDisableCheck] = useState<boolean>(false)
  const handleCancel = () => {
    checkForm.resetFields()
    setVisibleModal(false)
  }
  const [checkStatus, setCheckStatus] = useState<number>(4)

  const handleOK = (values) => {
    postProductCommodityPlatformCheckCommodity({ id: id, ...values }).then((res) => {
      if (res.code === 1000) {
        handleCancel()
        setDisableCheck(true)
        history.back()
      }
    })
  }

  const handleApplyCheck = () => {
    setVisibleModal(true)
  }

  const handleStatusChange = (value: any) => {
    setCheckStatus(value.target.value)
  }

  const buttonExtra = (
    <Button key="1" type="primary" onClick={handleApplyCheck} disabled={disableCheck}>
      商品审核
    </Button>
  )
  return (
    <>
      <PublicDetail buttonExtra={buttonExtra} />
      <BatchApprovedModal
        title="审核"
        open={visibleModal}
        onOk={(value) => handleOK(value)}
        onCancel={handleCancel}
        approvedStatus={[4, 3]}
      />
    </>
  )
}
