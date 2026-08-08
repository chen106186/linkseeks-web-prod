import React, { useState, useEffect } from 'react'
import { Form, Input, DatePicker, Select } from 'antd'
import moment from 'moment'
import AddressSelect from '@/components/AddressSelect'
import { getLogisticsSelectListReceiverAddress } from '@apps/apis'

import { validatorByte } from '../../validator'

import style from './index.less'
import { getIntl } from '@linkseeks/i18n'

const { TextArea } = Input
const { Option } = Select
const layout: any = {
  colon: false,
  labelCol: { style: { width: '174px' } },
  wrapperCol: { span: 9 },
  labelAlign: 'left',
}

interface Iprops {
  currentRef: any
  fetchdata: { [key: string]: any }
  onBadge: (num: number, idx: number) => void
}

const intl = getIntl()

export type ADDRESS_TYPE = {
  fullAddress: string
  id: number
  name: string
  phone: string
}

const Condition: React.FC<Iprops> = (props: any) => {
  const [form] = Form.useForm()
  const { currentRef, fetchdata, onBadge } = props
  const [address, setAddress] = useState<Array<any>>([])
  const [selAddress, setSelAddress] = useState<ADDRESS_TYPE>()
  /** 获取交付地址 */
  const handleGetLogistics = async () => {
    const service = getLogisticsSelectListReceiverAddress
    const res = await service()
    if (res.code === 1000 && res.data.length > 0) {
      const info: any = res.data?.[0]
      if (info) {
        const params: ADDRESS_TYPE = {
          fullAddress: `${info.receiverName} ${info.fullAddress} ${info.phone}`,
          id: info.id,
          name: info.receiverName,
          phone: info.phone,
        }
        console.log(params)
        setSelAddress(params)
        form.setFieldsValue({ address: params })
      }
      setAddress(res.data)
    }
  }

  useEffect(() => {
    !fetchdata?.address && handleGetLogistics()
  }, [])

  /** 选择地址 */
  // const handleSelectAddress = (val: any, option: any) => {
  //   const params: ADDRESS_TYPE = {
  //     address: option.children,
  //     id: option.value,
  //   }
  //   setSelAddress(params);
  // }

  const getFullAddress = (info) => {
    const params: ADDRESS_TYPE = {
      fullAddress: `${info.name} ${info.fullAddress} ${info.phone}`,
      id: info.id,
      phone: info.phone,
      name: info.name,
    }
    setSelAddress(params)
    form.setFieldsValue({ address: params })
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
                  deliver: moment(res.deliver).format('x'),
                  logistics: res.logistics,
                  offer: res.offer,
                  otherRequire: res.otherRequire,
                  packRequire: res.packRequire,
                  paymentType: res.paymentType,
                  taxes: res.taxes,
                  address: selAddress?.fullAddress,
                  addressId: selAddress?.id,
                },
              })
              onBadge(0, 4)
            })
            .catch((error) => {
              if (error && error.errorFields) {
                onBadge(error.errorFields.length, 4)
              }
            })
        }),
    }
  }, [selAddress])

  /** 回显数据 */
  useEffect(() => {
    console.log(fetchdata)
    if (fetchdata) {
      form.setFieldsValue({
        deliver: fetchdata.deliver ? moment(fetchdata.deliver) : undefined,
        addressId: fetchdata.addressId,
        offer: fetchdata.offer,
        paymentType: fetchdata.paymentType,
        taxes: fetchdata.taxes,
        logistics: fetchdata.logistics,
        packRequire: fetchdata.packRequire,
        otherRequire: fetchdata.otherRequire,
      })
      if (fetchdata?.address) {
        const _stringList = fetchdata?.address?.split(' ')
        const params: ADDRESS_TYPE = {
          fullAddress: fetchdata.address,
          id: fetchdata.addressId,
          phone: _stringList?.[2] || undefined,
          name: _stringList?.[0] || undefined,
        }
        setSelAddress(params)
        form.setFieldsValue({ address: params })
      }
    }
  }, [fetchdata])

  return (
    <>
      <Form {...layout} form={form} className={style.form}>
        <Form.Item
          label={intl.formatMessage({ id: 'table.purchase.deliveryTime' })}
          name="deliver"
          rules={[{ required: true, message: intl.formatMessage({ id: 'detail.purchase.message54' }) }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            disabledDate={(current) => {
              return current && current <= moment().startOf('day')
            }}
          />
        </Form.Item>
        <Form.Item
          name="address"
          label={intl.formatMessage({ id: 'detail.purchase.address' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'detail.purchase.message55' }) }]}
        >
          <AddressSelect
            echo={true}
            value={selAddress}
            isDefaultAddress={true}
            addressType={1}
            disabled={false}
            onChange={getFullAddress}
          />
          {/* <Select
            onSelect={handleSelectAddress}
            placeholder={intl.formatMessage({ id: 'detail.purchase.message55' })}
          >
            {address.map(v => (
              <Option key={v.id} value={v.id}>{v.fullAddress}</Option>
            ))}
          </Select> */}
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ id: 'detail.purchase.offerAsk' })}
          name="offer"
          rules={[
            // { required: true, message: '请输入报价要求' },
            {
              validator: (r, v) => validatorByte(v, 100),
            },
          ]}
        >
          <TextArea rows={3} maxLength={100} placeholder={intl.formatMessage({ id: 'detail.purchase.placeholder5' })} />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ id: 'detail.purchase.paymentType' })}
          name="paymentType"
          rules={[
            // { required: true, message: '请输入付款方式' },
            {
              validator: (r, v) => validatorByte(v, 100),
            },
          ]}
        >
          <TextArea rows={3} maxLength={100} placeholder={intl.formatMessage({ id: 'detail.purchase.placeholder5' })} />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ id: 'detail.purchase.taxesAsk' })}
          name="taxes"
          rules={[
            // { required: true, message: '请输入税费要求' },
            {
              validator: (r, v) => validatorByte(v, 100),
            },
          ]}
        >
          <TextArea rows={3} maxLength={100} placeholder={intl.formatMessage({ id: 'detail.purchase.placeholder5' })} />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ id: 'detail.purchase.logisticsAsk' })}
          name="logistics"
          rules={[
            // { required: true, message: '请输入物流要求' },
            {
              validator: (r, v) => validatorByte(v, 100),
            },
          ]}
        >
          <TextArea rows={3} maxLength={100} placeholder={intl.formatMessage({ id: 'detail.purchase.placeholder5' })} />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ id: 'detail.purchase.packRequireAsk' })}
          name="packRequire"
          rules={[
            // { required: true, message: '请输入包装要求' },
            {
              validator: (r, v) => validatorByte(v, 100),
            },
          ]}
        >
          <TextArea rows={3} maxLength={100} placeholder={intl.formatMessage({ id: 'detail.purchase.placeholder5' })} />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ id: 'detail.purchase.otherRequireAsk' })}
          name="otherRequire"
          rules={[
            // { required: true, message: '请输入其他要求' },
            {
              validator: (r, v) => validatorByte(v, 100),
            },
          ]}
        >
          <TextArea rows={3} maxLength={100} placeholder={intl.formatMessage({ id: 'detail.purchase.placeholder5' })} />
        </Form.Item>
      </Form>
    </>
  )
}
export default Condition
