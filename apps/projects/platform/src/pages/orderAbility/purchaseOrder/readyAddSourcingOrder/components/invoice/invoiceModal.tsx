import React, { useImperativeHandle, useState } from 'react'
import { Modal, Form, Radio, Input, Switch } from 'antd'
import { postSettlementInvoiceMessageAdd, postSettlementInvoiceMessageUpdate } from '@apps/apis'
import { useWebIntl } from '@apps/locales'

interface InvoiceModalProps {
  currentRef?: any
  optionType: 'add' | 'edit' | 'preview'
  onOk?: () => void
}

const InvoiceModal: React.FC<InvoiceModalProps> = (props) => {
  const { currentRef, optionType = 'add', onOk } = props
  const [visible, setVisible] = useState<boolean>(false)
  const [comfirmLoading, setComfirmLoading] = useState<boolean>(false)
  const [form] = Form.useForm()
  const translate = useWebIntl()

  const modelTitle = {
    add: translate('web.common.add'),
    edit: translate('web.common.edit'),
    preview: translate('web.common.preview'),
  }

  useImperativeHandle(currentRef, () => ({
    form,
    visible,
    setVisible,
  }))

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  }

  const handleFormFinsh = async (values: any) => {
    const params = {
      ...values,
      isDefault: values?.isDefault ? 1 : 0,
    }
    setComfirmLoading(true)
    const fn = optionType === 'edit' ? postSettlementInvoiceMessageUpdate : postSettlementInvoiceMessageAdd
    const res = await fn(params)
    setComfirmLoading(false)
    if (res.code === 1000) {
      setVisible(false)
      form.resetFields()
      onOk?.()
    }
  }

  return (
    <Modal
      open={visible}
      title={modelTitle[optionType]}
      confirmLoading={comfirmLoading}
      centered
      onCancel={() => {
        form.resetFields()
        setVisible(false)
      }}
      onOk={() => form.submit()}
      width={650}
    >
      <Form {...layout} form={form} labelAlign="left" colon={false} onFinish={handleFormFinsh}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          name="type"
          label={translate('web.resource.balance.kaijuleixing')}
          rules={[{ required: true, message: translate('web.common.qingxuanze') }]}
          initialValue={1}
        >
          <Radio.Group>
            <Radio value={1}>{translate('web.common.qiye')}</Radio>
            <Radio value={2}>{translate('web.common.geren')}</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="kind"
          label={translate('web.resource.balance.fapiaozhonglei')}
          rules={[{ required: true, message: translate('web.common.qingxuanze') }]}
          initialValue={1}
        >
          <Radio.Group>
            <Radio value={1}>{translate('web.resource.order.zengzhishuifapiao')}</Radio>
            <Radio value={2}>{translate('web.resource.order.zengzhishuizhuangyongfapiao')}</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item shouldUpdate noStyle>
          {({ getFieldValue }) => {
            const type = getFieldValue('type')
            return (
              <>
                <Form.Item
                  name="invoiceTitle"
                  label={type === 1 ? translate('web.resource.balance.fapiaotaitou') : translate('web.common.name')}
                  rules={[{ required: true, message: translate('web.common.qingtianxie') }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="taxNo"
                  label={translate('web.resource.balance.nashuihao')}
                  rules={[
                    {
                      required: type === 1,
                      message: translate('web.common.qingtianxie'),
                    },
                    {
                      pattern: /^[a-zA-Z0-9]+$/,
                      message: translate('web.resource.balance.qingshuruzhengquedenashuihao'),
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </>
            )
          }}
        </Form.Item>
        <Form.Item name="bankOfDeposit" label={translate('web.resource.balance.kaihuhang')}>
          <Input />
        </Form.Item>
        <Form.Item name="account" label={translate('web.common.account')}>
          <Input />
        </Form.Item>
        <Form.Item name="address" label={translate('web.common.address')}>
          <Input />
        </Form.Item>
        <Form.Item name="tel" label={translate('web.common.telNumber')}>
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label={translate('web.resource.balance.youxiang')}
          rules={[
            {
              required: true,
              message: translate('web.common.qingtianxie'),
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="isDefault" label={translate('web.resource.logistics.shifoumoren')} valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default InvoiceModal
