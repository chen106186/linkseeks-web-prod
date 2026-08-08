import React, { useEffect } from 'react'
import { Modal, Form, FormInstance, Input, Switch } from '@linkseeks/ui'
import { UploadImage } from '@apps/components'
import { MallFormType, MallItemType } from '../../types'

interface MallModalProps {
  saveLoading: boolean
  form: FormInstance<any>
  visible: boolean
  mallInfo: MallItemType
  mro?: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  onOk: (values: MallFormType) => void
}

const MallModal: React.FC<MallModalProps> = (props) => {
  const { saveLoading, form, mallInfo, visible, mro = false, onOk, setVisible } = props

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
      title="编辑商城信息"
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
          label="商城LOGO"
          dependencies={['logoUrl']}
          shouldUpdate
          rules={[
            {
              required: true,
              message: '请上传商城LOGO',
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
          label="商城名称"
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
        <Form.Item label="商城描述" name="describe">
          <Input />
        </Form.Item>
        {mro && (
          <Form.Item label="MRO 模式" name="isOpenMro" valuePropName="checked">
            <Switch defaultChecked={mallInfo?.isOpenMro} />
          </Form.Item>
        )}
      </Form>
    </Modal>
  )
}

export default MallModal
