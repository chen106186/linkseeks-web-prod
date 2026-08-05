import React, { useEffect } from 'react'
import { Form, FormInstance, Input, Modal } from '@linkseeks/ui'

interface IpModalIprops {
  title: string
  visible: boolean
  form: FormInstance<any>
  monitorType: number
  operateType: 'add' | 'edit'
  confirmLoading: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  onOk: (values: { id: number; monitorType: number; ip: string; remarks: string }) => void
}

const IpModal: React.FC<IpModalIprops> = (props) => {
  const { visible, title, operateType, monitorType, confirmLoading, form, setVisible, onOk } = props

  const handleOk = () => {
    form.validateFields().then((values) => {
      onOk?.(values)
    })
  }

  /*ip地址 0.0.0.0~255.255.255.255*/
  const validateIP = (str) => {
    const re =
      /^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])\.((1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.){2}(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)$/
    return re.test(str)
  }

  useEffect(() => {
    if (visible) {
      form.setFieldValue('monitorType', monitorType)
    }
  }, [visible, monitorType])

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={() => {
        form.resetFields()
        setVisible(false)
      }}
      destroyOnClose
      confirmLoading={confirmLoading}
      onOk={handleOk}
    >
      <Form form={form} labelAlign="left" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="monitorType" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          name="ip"
          label="IP"
          rules={[
            {
              required: true,
              message: '请输入IP',
            },
            {
              validator: (rule, value, callback) => {
                if (value) {
                  if (validateIP(value)) {
                    callback()
                  } else {
                    throw new Error('请输入正确的ip地址')
                  }
                } else {
                  callback()
                }
              },
              message: '请输入正确的ip地址',
            },
          ]}
        >
          <Input placeholder="请输入" disabled={operateType === 'edit'} />
        </Form.Item>
        <Form.Item
          name="remarks"
          label="备注"
          rules={[
            {
              required: true,
              message: '请输入备注',
            },
          ]}
        >
          <Input.TextArea placeholder="请输入一段文字" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default IpModal
