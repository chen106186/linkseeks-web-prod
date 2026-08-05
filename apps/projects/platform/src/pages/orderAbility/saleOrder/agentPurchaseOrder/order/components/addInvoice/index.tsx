import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, Switch, Radio, RadioChangeEvent, message } from 'antd'
import FormLabel from '../FormLabel'
import styles from './index.less'
import {
  // postSettlementInvoiceMessageUpdate,
  postSettlementAgentInvoiceMessageUpdate,
  postSettlementAgentInvoiceMessageAdd,
  // postSettlementInvoiceMessageAdd,
} from '@apps/apis'
import { GetLogisticsReceiverAddressPageResponseDetail } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
import { AgentPurchaseOrderInfoType } from '../../../types'

// 列表带来的参数
export interface ListProps {
  title?: React.ReactNode
}
export interface ListType {
  checked: boolean // 可选
}

interface AddInvoicePropsType {
  visible?: boolean
  buyerInfo: AgentPurchaseOrderInfoType
  onOk?: any
  onCancel?: any
  title?: string
  editItem?: GetLogisticsReceiverAddressPageResponseDetail
  type: 'add' | 'edit'
}

const AddInvoice: React.FC<AddInvoicePropsType> = (props) => {
  const intl = useIntl()
  const { visible = false, title, onOk, onCancel, editItem, type, buyerInfo } = props
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [isDefault, setIsDefault] = useState<boolean>(false)
  const [invoiceTitle, setInvoiceTitle] = useState<string>(intl.formatMessage({ id: 'order.addInvoice.Invoice' }))
  const [taxNoRequired, setTaxNoRequired] = useState<boolean>(true)
  const [form] = Form.useForm()

  useEffect(() => {
    if (visible) {
      if (type === 'edit' && editItem) {
        setIsDefault(editItem['isDefault'] === 0 ? false : true)
        form.setFieldsValue(editItem)
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

  const handleTypeChange = (e: RadioChangeEvent) => {
    if (e.target.value === 1) {
      setInvoiceTitle(intl.formatMessage({ id: 'order.addInvoice.Invoice' }))
      setTaxNoRequired(true)
    } else {
      setInvoiceTitle(intl.formatMessage({ id: 'order.addInvoice.name' }))
      setTaxNoRequired(false)
    }
  }

  const handleFormFinsh = (values: any) => {
    const value = { ...values }
    value.isDefault = isDefault ? 1 : 0
    value['subMemberId'] = buyerInfo.memberId
    value['subRoleId'] = buyerInfo.roleId
    setConfirmLoading(true)
    let postFn
    if (type === 'edit' && editItem) {
      value.id = editItem.id
      postFn = postSettlementAgentInvoiceMessageUpdate
    } else {
      postFn = postSettlementAgentInvoiceMessageAdd
    }

    postFn(value)
      .then((res) => {
        setConfirmLoading(false)
        if (res.code === 1000) {
          message.destroy()
          message.success(intl.formatMessage({ id: 'option.success' }))
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
      visible={visible}
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
          label={<FormLabel label={intl.formatMessage({ id: 'order.addInvoice.IssuingType' })} />}
          rules={[
            {
              required: true,
              message:
                intl.formatMessage({ id: 'order.addAddress.select' }) +
                intl.formatMessage({ id: 'order.addInvoice.IssuingType' }),
            },
          ]}
          initialValue={1}
        >
          <Radio.Group onChange={handleTypeChange}>
            <Radio value={1}>{intl.formatMessage({ id: 'order.index.invoice.enterprise' })}</Radio>
            <Radio value={2}>{intl.formatMessage({ id: 'order.index.invoice.personal' })}</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="kind"
          label={<FormLabel label={intl.formatMessage({ id: 'order.addInvoice.InvoiceType' })} />}
          rules={[
            {
              required: true,
              message:
                intl.formatMessage({ id: 'order.addAddress.select' }) +
                intl.formatMessage({ id: 'order.addInvoice.InvoiceType' }),
            },
          ]}
          initialValue={1}
        >
          <Radio.Group>
            <Radio value={1}>{intl.formatMessage({ id: 'order.index.invoice.VATOrdinary' })}</Radio>
            <Radio value={2}>{intl.formatMessage({ id: 'order.index.invoice.VATSpecial' })}</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="invoiceTitle"
          label={<FormLabel label={invoiceTitle} />}
          rules={[
            { required: true, message: `${intl.formatMessage({ id: 'order.addAddress.select' })}${invoiceTitle}` },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="taxNo"
          label={<FormLabel label={intl.formatMessage({ id: 'order.addInvoice.Tax' })} />}
          rules={[
            {
              required: taxNoRequired,
              message:
                intl.formatMessage({ id: 'order.addAddress.select' }) +
                intl.formatMessage({ id: 'order.addInvoice.Tax' }),
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="bankOfDeposit"
          label={<FormLabel label={intl.formatMessage({ id: 'order.addInvoice.Deposit' })} />}
        >
          <Input />
        </Form.Item>
        <Form.Item name="account" label={<FormLabel label={intl.formatMessage({ id: 'order.addInvoice.account' })} />}>
          <Input />
        </Form.Item>
        <Form.Item name="address" label={<FormLabel label={intl.formatMessage({ id: 'order.addInvoice.address' })} />}>
          <Input />
        </Form.Item>
        <Form.Item name="tel" label={<FormLabel label={intl.formatMessage({ id: 'order.addInvoice.Telephone' })} />}>
          <Input />
        </Form.Item>
        <Form.Item
          name="isDefault"
          label={<FormLabel label={intl.formatMessage({ id: 'order.addInvoice.Default' })} />}
        >
          <Switch checked={isDefault} onChange={(checked) => setIsDefault(checked)} />
        </Form.Item>
      </Form>
    </Modal>
  ) : null
}

export default AddInvoice
