import React, { useEffect } from 'react'
import { Form, Input, Typography } from 'antd'
import { getIntl } from '@linkseeks/i18n'

const { TextArea } = Input

const layout: any = {
  colon: false,
  labelCol: { style: { width: '174px' } },
  wrapperCol: { span: 9 },
  labelAlign: 'left',
}

export interface IProps {
  fetchdata: any
  currentRef: any
  /** 当前报价轮次 */
  round: number
  /** 点击报价信息切换的轮次 */
  checkRound: number
  onBadge?: Function
}
const intl = getIntl()
const OfferExplain: React.FC<IProps> = (props: any) => {
  const [form] = Form.useForm()
  const { fetchdata, currentRef, round, checkRound, onBadge } = props

  useEffect(() => {
    if (fetchdata && checkRound === round) {
      form.setFieldsValue({ ...fetchdata })
    }
  }, [fetchdata])

  useEffect(() => {
    currentRef.current = {
      get: () =>
        new Promise((resolve: any) => {
          form
            .validateFields()
            .then((res) => {
              resolve({
                state: true,
                name: 'explain',
                data: res,
              })
              onBadge(0, 2)
            })
            .catch((error) => {
              if (error && error.errorFields) {
                onBadge(error.errorFields.length, 2)
              }
            })
        }),
    }
  })

  const handleHidden = () => {
    let flag: boolean = false
    if (checkRound !== round) {
      flag = true
    }
    return flag
  }

  return (
    <Form {...layout} form={form}>
      <Form.Item
        hidden={handleHidden()}
        label={intl.formatMessage({ id: 'detail.purchase.deliveryDetails' })}
        name="deliveryDetails"
      >
        <TextArea maxLength={50} rows={3} placeholder={intl.formatMessage({ id: 'detail.purchase.placeholder5' })} />
      </Form.Item>
      <Form.Item
        hidden={handleHidden()}
        label={intl.formatMessage({ id: 'detail.purchase.payDetails' })}
        name="payDetails"
      >
        <TextArea maxLength={50} rows={3} placeholder={intl.formatMessage({ id: 'detail.purchase.placeholder5' })} />
      </Form.Item>
      <Form.Item hidden={handleHidden()} label={intl.formatMessage({ id: 'detail.purchase.taxes' })} name="taxes">
        <TextArea maxLength={50} rows={3} placeholder={intl.formatMessage({ id: 'detail.purchase.placeholder5' })} />
      </Form.Item>
      <Form.Item
        hidden={handleHidden()}
        label={intl.formatMessage({ id: 'detail.purchase.logistics' })}
        name="logistics"
      >
        <TextArea maxLength={50} rows={3} placeholder={intl.formatMessage({ id: 'detail.purchase.placeholder5' })} />
      </Form.Item>
      <Form.Item
        hidden={handleHidden()}
        label={intl.formatMessage({ id: 'detail.purchase.packRequire' })}
        name="packRequire"
      >
        <TextArea maxLength={50} rows={3} placeholder={intl.formatMessage({ id: 'detail.purchase.placeholder5' })} />
      </Form.Item>
      <Form.Item
        hidden={handleHidden()}
        label={intl.formatMessage({ id: 'detail.purchase.otherRequire' })}
        name="otherRequire"
      >
        <TextArea maxLength={50} rows={3} placeholder={intl.formatMessage({ id: 'detail.purchase.placeholder5' })} />
      </Form.Item>

      <Form.Item hidden={!handleHidden()} label={intl.formatMessage({ id: 'detail.purchase.deliveryDetails' })}>
        <Typography.Text>{fetchdata.deliveryDetails && fetchdata.deliveryDetails} </Typography.Text>
      </Form.Item>
      <Form.Item hidden={!handleHidden()} label={intl.formatMessage({ id: 'detail.purchase.payDetails' })}>
        <Typography.Text>{fetchdata.payDetails && fetchdata.payDetails} </Typography.Text>
      </Form.Item>
      <Form.Item hidden={!handleHidden()} label={intl.formatMessage({ id: 'detail.purchase.taxes' })}>
        <Typography.Text>{fetchdata.taxes && fetchdata.taxes} </Typography.Text>
      </Form.Item>
      <Form.Item hidden={!handleHidden()} label={intl.formatMessage({ id: 'detail.purchase.logistics' })}>
        <Typography.Text>{fetchdata.logistics && fetchdata.logistics} </Typography.Text>
      </Form.Item>
      <Form.Item hidden={!handleHidden()} label={intl.formatMessage({ id: 'detail.purchase.packRequire' })}>
        <Typography.Text>{fetchdata.packRequire && fetchdata.packRequire} </Typography.Text>
      </Form.Item>
      <Form.Item hidden={!handleHidden()} label={intl.formatMessage({ id: 'detail.purchase.otherRequire' })}>
        <Typography.Text>{fetchdata.otherRequire && fetchdata.otherRequire} </Typography.Text>
      </Form.Item>
    </Form>
  )
}
export default OfferExplain
