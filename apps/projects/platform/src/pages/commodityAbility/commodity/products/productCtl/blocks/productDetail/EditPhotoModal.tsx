import { useToggle } from '@linkseeks/hooks'
import { Modal, Form, Image, Input } from '@linkseeks/ui'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { useProductDetailContext } from './context'
import { useWebIntl } from '@apps/locales'

const EditPhotoModal = forwardRef(({}, ref) => {
  const { photoToggle, photoVisible, setPhotoAttr, photoAttr } = useProductDetailContext()
  const [form] = Form.useForm()
  const translate = useWebIntl()
  useImperativeHandle(ref, () => {
    return {
      toggle(flag, attr) {
        photoToggle(flag)
        setPhotoAttr(attr)
      },
    }
  })

  const handleConfirm = () => {
    const url = form.getFieldValue('url') || ''
    photoToggle()
  }

  return (
    <Modal
      title={translate('web.resource.commodity.tupianbianji')}
      open={photoVisible}
      onOk={handleConfirm}
      onCancel={photoToggle}
      okButtonProps={{ htmlType: 'submit' }}
    >
      <Form labelCol={{ span: 4 }} labelAlign="left" form={form}>
        <Form.Item label={translate('web.common.tupian')}>
          <Image width={150} height={150} src={photoAttr?.content || photoAttr?.url} />
        </Form.Item>
        <Form.Item label={translate('web.resource.commodity.tiaozhuanglianjie')} name="url">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default EditPhotoModal
