import React, { useState, useEffect, Fragment } from 'react'
import { Modal, Form, Input, Switch, Radio, RadioChangeEvent, message } from 'antd'
import FormLabel from '@/components/FormLabel'
import {
  GetLogisticsReceiverAddressPageResponseDetail,
  postSettlementInvoiceMessageUpdate,
  postSettlementInvoiceMessageAdd,
} from '@apps/apis'
import { getWebIntl } from '@/utils/locales'
import styles from './index.module.less'

// 列表带来的参数
export interface ListProps {
  title?: React.ReactNode
}
export interface ListType {
  checked: boolean // 可选
}

interface AddInvoicePropsType {
  visible?: boolean
  onOk?: any
  onCancel?: any
  title?: string
  editItem?: GetLogisticsReceiverAddressPageResponseDetail
  type: 'add' | 'edit'
}

const AddInvoice: React.FC<AddInvoicePropsType> = (props) => {
  const translate = getWebIntl()
  const { visible = false, title, onOk, onCancel, editItem, type } = props
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [form] = Form.useForm()

  useEffect(() => {
    if (visible) {
      if (type === 'edit' && editItem) {
        form.setFieldsValue({
          ...editItem,
          isDefault: editItem.isDefault === 0 ? false : true,
        })
      } else {
        form.resetFields()
      }
    }
  }, [editItem, type, visible])

  const handleOk = () => {
    form.submit()
  }

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  }

  const handleFormFinsh = (values: any) => {
    const value = { ...values }
    value.isDefault = value.isDefault ? 1 : 0
    setConfirmLoading(true)
    let postFn
    if (type === 'edit' && editItem) {
      value.id = editItem.id
      postFn = postSettlementInvoiceMessageUpdate
    } else {
      postFn = postSettlementInvoiceMessageAdd
    }

    postFn(value)
      .then((res) => {
        setConfirmLoading(false)
        if (res.code === 1000) {
          message.destroy()
          message.success(translate('web.common.caozuochenggong'))
          onOk(value?.id)
        }
      })
      .catch(() => {
        setConfirmLoading(false)
      })
  }

  return visible ? (
    <Modal
      title={title}
      open={visible}
      onOk={handleOk}
      width={600}
      centered
      confirmLoading={confirmLoading}
      className={styles.common_add_modal}
      onCancel={onCancel}
      maskClosable={false}
    >
      <Form {...layout} form={form} labelAlign="left" colon={false} onFinish={handleFormFinsh}>
        <Form.Item
          name="type"
          label={translate('web.resource.balance.kaijuleixing')}
          rules={[{ required: true, message: translate('web.common.qingxuanze') }]}
          initialValue={1}
        >
          <Radio.Group
            onChange={(e) => {
              if (e.target.value === 2) {
                form.setFieldValue('kind', 1)
                form.validateFields()
              }
            }}
          >
            <Radio value={1}>{translate('web.common.qiye')}</Radio>
            <Radio value={2}>{translate('web.common.geren')}</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item dependencies={['type']} shouldUpdate noStyle>
          {({ getFieldValue }) => {
            const type = getFieldValue('type')

            return (
              <Fragment>
                <Form.Item
                  name="kind"
                  label={translate('web.resource.balance.fapiaozhonglei')}
                  rules={[{ required: true, message: translate('web.common.qingxuanze') }]}
                  initialValue={1}
                >
                  <Radio.Group>
                    <Radio value={1}>{translate('web.resource.order.zengzhishuifapiao')}</Radio>
                    {type === 1 && (
                      <Radio value={2}>{translate('web.resource.order.zengzhishuizhuangyongfapiao')}</Radio>
                    )}
                  </Radio.Group>
                </Form.Item>
                <Form.Item dependencies={['kind']} shouldUpdate noStyle>
                  {({ getFieldValue: childGetFieldValue }) => {
                    const kind = childGetFieldValue('kind')

                    return (
                      <Fragment>
                        <Form.Item
                          name="invoiceTitle"
                          label={translate('web.resource.balance.fapiaotaitou')}
                          rules={[{ required: true, message: translate('web.common.qingxuanze') }]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          name="taxNo"
                          label={translate('web.resource.balance.nashuihao')}
                          rules={[
                            {
                              required: type === 1,
                              message: translate('web.common.qingxuanze'),
                            },
                            {
                              pattern: /^[a-zA-Z0-9]+$/,
                              message: translate('web.resource.balance.qingshuruzhengquedenashuihao'),
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          name="bankOfDeposit"
                          label={translate('web.resource.balance.kaihuhang')}
                          rules={[
                            {
                              required: kind === 2,
                              message: translate('web.common.qingshuru'),
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          name="account"
                          label={translate('web.common.account')}
                          rules={[
                            {
                              required: kind === 2,
                              message: translate('web.common.qingshuru'),
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          name="address"
                          label={translate('web.common.address')}
                          rules={[
                            {
                              required: kind === 2,
                              message: translate('web.common.qingshuru'),
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          name="tel"
                          label={translate('web.common.telNumber')}
                          rules={[
                            {
                              required: kind === 2,
                              message: translate('web.common.qingshuru'),
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Fragment>
                    )
                  }}
                </Form.Item>
              </Fragment>
            )
          }}
        </Form.Item>
        <Form.Item name="isDefault" label={translate('web.resource.logistics.shifoumoren')} valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  ) : null
}

export default AddInvoice
