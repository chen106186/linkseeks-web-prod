import React, { useCallback, useEffect, useState } from 'react'
import { Form, Input, Typography, Select, Tag, Badge, Row, Col } from 'antd'
import { formatTimeString } from '@/utils'
import style from './index.less'
import {
  OFFTER_EXTERNALSTATE,
  OFFTER_EXTERNALSTATE_COLOR,
  OFFTER_INTERNALSTATE,
  OFFTER_INTERNALSTATE_COLOR,
} from '../../../constants'
import { getIntl } from '@linkseeks/i18n'
import { getTelCodeOptions } from '@apps/services'
const intl = getIntl()
const { Option } = Select
const { Text, Link } = Typography

const layout: any = {
  colon: false,
  labelCol: { style: { width: '174px' } },
  wrapperCol: { span: 9 },
  labelAlign: 'left',
}

export interface IProps {
  fetchdata: any
  currentRef: any
  onBadge?: Function
}

const BasicInfo: React.FC<IProps> = (props: any) => {
  const [form] = Form.useForm()
  const { fetchdata, currentRef, onBadge } = props
  const [telCode, setTelCode] = useState<any>([])

  const handleGetTelCode = useCallback(async () => {
    const data = await getTelCodeOptions()
    setTelCode(data)
  }, [])

  useEffect(() => {
    if (fetchdata) {
      handleGetTelCode()
      form.setFieldsValue({
        quotedDetails: fetchdata.quotedDetails,
        contacts: fetchdata.contacts,
        telPrefix: fetchdata.telPrefix ? fetchdata.telPrefix : '86',
        tel: fetchdata.tel,
      })
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
                name: 'basic',
                data: res,
              })
              onBadge(0, 0)
            })
            .catch((error) => {
              if (error && error.errorFields) {
                onBadge(error.errorFields.length, 0)
              }
            })
        }),
    }
  })

  const userPhoneRule = (rule, value) => {
    const RegExp = /^1[345678]\d{9}$/gi
    if (!value) {
      return Promise.reject(new Error(intl.formatMessage({ id: 'detail.purchase.message18' })))
    }
    if (!RegExp.test(value)) {
      return Promise.reject(new Error(intl.formatMessage({ id: 'detail.purchase.message19' })))
    }
    return Promise.resolve()
  }

  return (
    <Form className={style.formStyle} form={form} {...layout}>
      <Form.Item
        label={intl.formatMessage({ id: 'detail.purchase.quotedDetails' })}
        name="quotedDetails"
        rules={[{ required: true, message: intl.formatMessage({ id: 'detail.purchase.message20' }) }]}
      >
        <Input maxLength={30} placeholder={intl.formatMessage({ id: 'detail.purchase.placeholder4' })} />
      </Form.Item>
      <Form.Item
        label={intl.formatMessage({ id: 'detail.purchase.purchaseInquiryNo' })}
        name="purchaseInquiryNo"
        required
      >
        <Link
          strong
          href={`/procurementAbility/offter/inquiry/preview?id=${fetchdata && fetchdata.id}&number=${
            fetchdata && fetchdata.number
          }`}
          target="_blank"
        >
          {fetchdata && fetchdata.purchaseInquiryNo}
        </Link>
      </Form.Item>
      <Form.Item label={intl.formatMessage({ id: 'table.purchase.member' })} name="memberName">
        <Text>{fetchdata && fetchdata.memberName}</Text>
      </Form.Item>
      <Form.Item
        label={intl.formatMessage({ id: 'detail.purchase.contacts' })}
        name="contacts"
        rules={[{ required: true, message: intl.formatMessage({ id: 'detail.purchase.contactsMessage' }) }]}
      >
        <Input maxLength={6} placeholder={intl.formatMessage({ id: 'detail.purchase.placeholder3' })} />
      </Form.Item>
      <Form.Item
        label={intl.formatMessage({ id: 'detail.purchase.telPhone' })}
        colon={false}
        required={true}
        style={{ marginBottom: '0' }}
      >
        <Row gutter={24}>
          <Col span={7}>
            <Form.Item
              name="telPrefix"
              rules={[{ required: true, message: intl.formatMessage({ id: 'detail.purchase.telPrefix' }) }]}
            >
              <Select placeholder="+86">
                {telCode.map((item: any) => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={17}>
            <Form.Item name="tel" rules={[{ required: true, validator: userPhoneRule }]}>
              <Input placeholder={intl.formatMessage({ id: 'detail.purchase.tel' })} />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>
      <Form.Item label={intl.formatMessage({ id: 'detail.purchase.quotedPriceNo' })} name="quotedPriceNo">
        <Text strong>{fetchdata && fetchdata.quotedPriceNo}</Text>
      </Form.Item>
      <Form.Item label={intl.formatMessage({ id: 'table.purchase.quotedPriceTime' })} name="offerEndTime">
        <Text strong>{fetchdata && formatTimeString(fetchdata.offerEndTime)}</Text>
      </Form.Item>
      <Form.Item label={intl.formatMessage({ id: 'table.purchase.dementCreateTime' })} name="createTime">
        <Text strong>{fetchdata && formatTimeString(fetchdata.createTime)}</Text>
      </Form.Item>
      <Form.Item label={intl.formatMessage({ id: 'table.purchase.externalStatus' })} name="externalState">
        {fetchdata && (
          <Tag color={OFFTER_EXTERNALSTATE_COLOR[fetchdata.externalState]}>{fetchdata.externalStateName}</Tag>
        )}
      </Form.Item>
      <Form.Item label={intl.formatMessage({ id: 'detail.purchase.innerStatus' })} name="interiorState" />
    </Form>
  )
}

export default BasicInfo
