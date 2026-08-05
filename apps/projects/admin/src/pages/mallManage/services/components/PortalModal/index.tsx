import React, { useEffect } from 'react'
import { Modal, Form, FormInstance, Input, Switch } from '@linkseeks/ui'
import { UploadImage } from '@apps/components'
import { MallFormType, PortalItemType } from '../../types'

interface PortalModalProps {
  saveLoading: boolean
  form: FormInstance<any>
  visible: boolean
  mallInfo: PortalItemType
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  onOk: (values: MallFormType) => void
}

const PortalModal: React.FC<PortalModalProps> = (props) => {
  const { saveLoading, form, mallInfo, visible, onOk, setVisible } = props

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  }

  const handleOk = () => {
    form.validateFields().then((values) => {
      onOk(values)
    })
  }

  useEffect(() => {
    if (mallInfo && visible) {
      form.setFieldsValue({ ...mallInfo })
    }
  }, [mallInfo, visible])

  return (
    <Modal
      title="编辑门户信息"
      centered
      onCancel={() => setVisible(false)}
      open={visible}
      onOk={handleOk}
      confirmLoading={saveLoading}
      destroyOnClose
    >
      <Form form={form} labelAlign="left" initialValues={mallInfo} {...layout}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="logoUrl" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          label="门户LOGO"
          dependencies={['logoUrl']}
          shouldUpdate
          rules={[
            {
              required: true,
              message: '请上传门户LOGO',
            },
          ]}
        >
          {({ getFieldValue }) => (
            <UploadImage
              imgUrl={getFieldValue('logoUrl')}
              size="200x200"
              fileMaxSize={200}
              onChange={(url) => {
                form.setFieldValue('logoUrl', url)
              }}
            />
          )}
        </Form.Item>
        <Form.Item
          label="门户名称"
          name="name"
          rules={[
            {
              required: true,
              message: '请输入商城名称',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="门户描述" name="describe">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default PortalModal
