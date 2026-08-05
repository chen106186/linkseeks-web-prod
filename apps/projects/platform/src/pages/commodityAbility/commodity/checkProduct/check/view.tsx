import { useWebIntl } from '@apps/locales'
import PublicProductDetail from '@apps/services/commodity/publicDetail'
import { Modal, Form, Radio, Input, Button } from '@linkseeks/ui'
import { useCheckProduct } from './useCheckProduct'
import { BatchApprovedModal } from '@apps/components'

const { TextArea } = Input
export default () => {
  const translate = useWebIntl()
  const { handleOK, visibleModal, handleCancel, handleStatusChange, checkStatus, handleApplyCheck } = useCheckProduct()

  const buttonExtra = (
    <Button key="1" type="primary" onClick={handleApplyCheck}>
      商品审核
    </Button>
  )
  return (
    <>
      <PublicProductDetail buttonExtra={buttonExtra} />
      <BatchApprovedModal
        onOk={(value) => handleOK(value)}
        open={visibleModal}
        title={translate('web.common.approved')}
        onCancel={handleCancel}
        approvedStatus={[4, 3]}
      />
    </>
  )
}
