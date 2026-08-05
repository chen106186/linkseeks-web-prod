import { RichEditable } from '@apps/components'
import { useToggle } from '@linkseeks/hooks'
import { Modal } from '@linkseeks/ui'
import { CONTENT_TYPE, useProductDetailContext } from './context'
import { useWebIntl } from '@apps/locales'

const EditCharModal = () => {
  const { charRef, charVisible, charToggle, addContentArea, editContentArea } = useProductDetailContext()
  const translate = useWebIntl()
  const handleConfirm = () => {
    const result = {
      content: charRef.current.charContent,
      type: CONTENT_TYPE.TEXT,
    }
    charRef.current.activeId ? editContentArea(result) : addContentArea(result)

    charToggle()
  }

  const handleChange = (value) => {
    charRef.current.charContent = value
  }
  return (
    <Modal
      title={translate('web.resource.commodity.wenzibianji')}
      open={charVisible}
      onOk={handleConfirm}
      onCancel={charToggle}
      okButtonProps={{ htmlType: 'submit' }}
      width={750}
      destroyOnClose
    >
      <RichEditable initValue={charRef.current.initValue} onChange={handleChange} />
    </Modal>
  )
}

export default EditCharModal
