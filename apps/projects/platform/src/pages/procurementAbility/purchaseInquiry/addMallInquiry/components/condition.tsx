import React, { useState, useEffect } from 'react'
import { Form, Row, Col, Input, DatePicker, Select } from 'antd'
import moment from 'moment'
import { getLogisticsSelectListReceiverAddress } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import AddressSelect from '@/components/AddressSelect'
import { validatorByte } from '@/utils/regExp'

const { TextArea } = Input
const { Option } = Select
const layout: any = {
  colon: false,
  labelCol: { style: { width: '174px' } },
  labelAlign: 'left',
}

interface Iprops {
  currentRef: any
  fetchdata: { [key: string]: any }
  onBadge?: Function
}

export type ADDRESS_TYPE = {
  address: string
  addressId: number
}
const intl = getIntl()
const Condition: React.FC<Iprops> = (props: any) => {
  const [form] = Form.useForm()
  const { currentRef, fetchdata, onBadge } = props
  const [deliveryTime, setDeliveryTime] = useState<any>()
  const [selAddress, setSelAddress] = useState<any>({})

  /** 选择地址 */
  const handleSelectAddress = (info) => {
    const params: ADDRESS_TYPE = {
      address: `${info.name} ${info.fullAddress} ${info.phone}`,
      addressId: info.id,
    }
    setSelAddress(params)
  }

  useEffect(() => {
    currentRef.current = {
      get: () =>
        new Promise((resolve: any) => {
          form
            .validateFields()
            .then((res) => {
              resolve({
                state: true,
                name: 'condition',
                data: {
                  deliveryTime: moment(res.deliveryTime).format('x'),
                  offerEndTime: moment(res.offerEndTime).format('x'),
                  logistics: res.logistics,
                  offer: res.offer,
                  otherRequire: res.otherRequire,
                  packRequire: res.packRequire,
                  paymentType: res.paymentType,
                  taxes: res.taxes,
                  ...selAddress,
                },
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
  }, [selAddress])

  /** 回显数据 */
  useEffect(() => {
    if (fetchdata) {
      form.setFieldsValue({
        deliveryTime: fetchdata.deliveryTime ? moment(fetchdata.deliveryTime) : undefined,
        addressId: fetchdata.addressId,
        offerEndTime: fetchdata.offerEndTime ? moment(fetchdata.offerEndTime) : undefined,
        offer: fetchdata.offer,
        paymentType: fetchdata.paymentType,
        taxes: fetchdata.taxes,
        logistics: fetchdata.logistics,
        packRequire: fetchdata.packRequire,
        otherRequire: fetchdata.otherRequire,
      })
      const params: ADDRESS_TYPE = {
        address: fetchdata.address,
        addressId: fetchdata.addressId,
      }
      setSelAddress(params)
    }
  }, [fetchdata])

  const deliveryTimeChange = (val) => {
    setDeliveryTime(val)
  }

  return (
    <>
      <Form {...layout} form={form}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              label={intl.formatMessage({ id: 'table.purchase.deliveryTime' })}
              name="deliveryTime"
              rules={[{ required: true, message: intl.formatMessage({ id: 'detail.purchase.message54' }) }]}
            >
              <DatePicker
                // showTime={{ format: 'HH:mm' }}
                style={{ width: '100%' }}
                format={'YYYY-MM-DD'}
                disabledDate={(current) => current && current < moment().startOf('day')}
                onChange={(val) => deliveryTimeChange(val)}
              />
            </Form.Item>
            <Form.Item
              label={intl.formatMessage({ id: 'detail.purchase.address' })}
              name="addressId"
              rules={[{ required: true, message: intl.formatMessage({ id: 'detail.purchase.message55' }) }]}
            >
              {/* <Select
                onSelect={handleSelectAddress}
              >
                {address.map(v => (
                  <Option key={v.id} value={v.id}>{v.fullAddress}</Option>
                ))}
              </Select> */}
              <AddressSelect
                value={selAddress.address && (selAddress.address as any)}
                isDefaultAddress
                addressType={1}
                disabled={false}
                onChange={handleSelectAddress}
              />
            </Form.Item>
            <Form.Item
              label={intl.formatMessage({ id: 'table.purchase.quotedPriceTime1' })}
              name="offerEndTime"
              rules={[{ required: true, message: intl.formatMessage({ id: 'detail.purchase.message39' }) }]}
            >
              <DatePicker
                showTime={{ format: 'HH:mm' }}
                style={{ width: '100%' }}
                format={'YYYY-MM-DD HH:mm'}
                disabledDate={(current) => current && current < moment().startOf('day')}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={intl.formatMessage({ id: 'detail.purchase.offerAsk' })}
              name="offer"
              rules={[{ validator: (rule, value, callback) => validatorByte(rule, value, callback, 100) }]}
            >
              <TextArea rows={3} placeholder={intl.formatMessage({ id: 'logistics.zuichang100gezifu50ge' })} />
            </Form.Item>
            <Form.Item
              label={intl.formatMessage({ id: 'detail.purchase.paymentType' })}
              name="paymentType"
              rules={[{ validator: (rule, value, callback) => validatorByte(rule, value, callback, 100) }]}
            >
              <TextArea rows={3} placeholder={intl.formatMessage({ id: 'logistics.zuichang100gezifu50ge' })} />
            </Form.Item>
            <Form.Item
              label={intl.formatMessage({ id: 'detail.purchase.taxesAsk' })}
              name="taxes"
              rules={[{ validator: (rule, value, callback) => validatorByte(rule, value, callback, 100) }]}
            >
              <TextArea rows={3} placeholder={intl.formatMessage({ id: 'logistics.zuichang100gezifu50ge' })} />
            </Form.Item>
            <Form.Item
              label={intl.formatMessage({ id: 'detail.purchase.logisticsAsk' })}
              name="logistics"
              rules={[{ validator: (rule, value, callback) => validatorByte(rule, value, callback, 100) }]}
            >
              <TextArea rows={3} placeholder={intl.formatMessage({ id: 'logistics.zuichang100gezifu50ge' })} />
            </Form.Item>
            <Form.Item
              label={intl.formatMessage({ id: 'detail.purchase.packRequireAsk' })}
              name="packRequire"
              rules={[{ validator: (rule, value, callback) => validatorByte(rule, value, callback, 100) }]}
            >
              <TextArea rows={3} placeholder={intl.formatMessage({ id: 'logistics.zuichang100gezifu50ge' })} />
            </Form.Item>
            <Form.Item
              label={intl.formatMessage({ id: 'detail.purchase.otherRequireAsk' })}
              name="otherRequire"
              rules={[{ validator: (rule, value, callback) => validatorByte(rule, value, callback, 100) }]}
            >
              <TextArea rows={3} placeholder={intl.formatMessage({ id: 'logistics.zuichang100gezifu50ge' })} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  )
}
export default Condition
