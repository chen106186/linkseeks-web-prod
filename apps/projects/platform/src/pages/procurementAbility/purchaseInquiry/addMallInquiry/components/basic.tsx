import React, { useState, useEffect } from 'react'
import { Form, Input, Select, Tooltip, Row, Col, message, Button, Typography } from 'antd'
import style from './index.less'
import { QuestionCircleOutlined } from '@ant-design/icons'

import { OFFTER_EXTERNALSTATE, OFFTER_INTERNALSTATE } from '../../../constants'
import { formatTimeString } from '@/utils'
import { getManageAreaAll, getManageAreaByPcodeAll } from '@apps/apis'
import { GetPurchasePurchaseInquiryDetailsResponse } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import { validatorByte } from '@/utils/regExp'
const intl = getIntl()
const { Option } = Select
const { Text } = Typography
const layout: any = {
  colon: false,
  labelCol: { style: { width: '174px' } },
  wrapperCol: { span: 9 },
  labelAlign: 'left',
}

const PURCHASETYPE = [
  {
    type: 1,
    name: intl.formatMessage({ id: 'detail.purchase.purchaseType1' }),
  },
  {
    type: 2,
    name: intl.formatMessage({ id: 'detail.purchase.purchaseType2' }),
  },
]
const PRICECONTRAST = [
  {
    type: 1,
    name: intl.formatMessage({ id: 'detail.purchase.priceContrast1' }),
  },
  {
    type: 2,
    name: intl.formatMessage({ id: 'detail.purchase.priceContrast2' }),
  },
]

interface Iprops {
  currentRef: any
  fetchdata: GetPurchasePurchaseInquiryDetailsResponse
  onBadge?: Function
}
let flag = true

interface AddreddOptionsItem {
  code: string
  name: string
  pcode: string
}

const BasicInfo: React.FC<Iprops> = (props: any) => {
  const { currentRef, fetchdata, onBadge } = props
  const [form] = Form.useForm()
  /** 省列表 */
  const [province, setprovince] = useState<any>([])
  /** 市列表 */
  const [city, setcity] = useState<any>([])
  const [code, setcode] = useState<any>([])
  /** 适用城市储存列表 */
  const [requisitionFormAddress, setrequisitionFormAddress] = useState<any>([
    {
      provinceCode: '',
      province: '',
      cityCode: '',
      city: '',
    },
  ])
  /** 获取所有地区 */
  const manageProvince = () => {
    return new Promise((resolve) => {
      getManageAreaAll()
        .then((res) => {
          if (res.code === 1000) {
            resolve(res.data)
          }
        })
        .catch((error) => {
          console.warn(error)
        })
    })
  }
  /** 选择下拉得内容 */
  const handProvince = async (val: any, idx: number, num: number) => {
    const result = [...requisitionFormAddress]
    const cityCode: Array<any> = []
    result.forEach((item: any) => {
      if (item.cityCode) {
        cityCode.push(item.cityCode)
      }
    })
    setcode([...cityCode])
    if (num === 1) {
      await province.forEach((item) => {
        if (item.code === val) {
          getManageAreaByPcodeAll({ pcode: val })
            .then((res: any) => {
              if (res.code === 1000) {
                result[idx].provinceCode = val
                result[idx].province = item.name
                if (val === '0') {
                  result[idx].cityCode = '0'
                  result[idx].city = intl.formatMessage({ id: 'components.suoyou' })
                  city[idx] = {
                    citydata: [
                      {
                        code: '0',
                        name: intl.formatMessage({ id: 'components.suoyou' }),
                        pcode: '0',
                      },
                    ],
                  }
                } else {
                  const tempCityList: Array<AddreddOptionsItem> = []
                  tempCityList.push({
                    code: '0',
                    name: intl.formatMessage({ id: 'components.suoyou' }),
                    pcode: '0',
                  })
                  for (const cityItem of res.data) {
                    tempCityList.push({ ...cityItem })
                  }
                  city[idx] = {
                    citydata: tempCityList,
                  }
                }
                form.setFieldsValue({
                  ['city_' + idx]: '0',
                })
                setcity([...city])
              }
            })
            .catch(() => {})
        }
      })
    } else {
      city.forEach((item) => {
        item.citydata.forEach((items) => {
          if (items.code === val) {
            const cityCode = code.find((it) => items.code)
            if (cityCode !== items.code) {
              items.disabled = false
            }
            result[idx].cityCode = val
            result[idx].city = items.name
          }
        })
      })
      setcity([...city])
    }
    setrequisitionFormAddress(result)
  }
  /** 选择城市的时候下拉就调用方 */
  const onDropdownVisibleChange = () => {
    return new Promise((reslove) => reslove(code)).then((res: any) => {
      city.forEach((item: any) => {
        item.citydata.filter((it) => {
          res.map((items) => {
            if (items === it.code) {
              it.disabled = true
            }
          })
        })
      })
      setcity([...city])
    })
  }
  /** 添加一条地址 */
  const addFormAddress = (idx: number) => {
    const address: any = {
      provinceCode: '0',
      province: '',
      cityCode: '0',
      city: intl.formatMessage({ id: 'components.suoyou' }),
    }
    setrequisitionFormAddress([...requisitionFormAddress, address])
  }
  /** 删除一条地址 */
  const removeFormAddress = (idx: any) => {
    if (requisitionFormAddress.length > 1) {
      const requisitionFormAddressFilter = requisitionFormAddress.filter((item: any, index: number) => index !== idx)
      const cityFilter = city.filter((item: any, index: number) => index !== idx)
      requisitionFormAddressFilter.forEach((item: any, index: number) => {
        const cityCode = code.find((it) => item.cityCode)
        if (cityCode !== item.cityCode) {
          item.disabled = false
        }
        form.setFieldsValue({
          ['province_' + index]: item.provinceCode,
          ['city_' + index]: item.cityCode,
        })
      })
      setcity(cityFilter)
      setrequisitionFormAddress(requisitionFormAddressFilter)
    }
  }
  useEffect(() => {
    manageProvince()
      .then((data: any) => {
        const tempProvinceData: Array<AddreddOptionsItem> = []
        tempProvinceData.push({
          code: '0',
          name: intl.formatMessage({ id: 'components.suoyou' }),
          pcode: '0',
        })
        for (const item of data) {
          tempProvinceData.push({ ...item })
        }
        setprovince(tempProvinceData)
      })
      .catch((error) => {
        console.warn(error)
      })
  }, [])
  useEffect(() => {
    if (Object.keys(fetchdata).length > 0) {
      setrequisitionFormAddress([...fetchdata.areas])
      fetchdata.areas.forEach((item: any, index: number) => {
        getManageAreaByPcodeAll({ pcode: item.provinceCode })
          .then((res: any) => {
            if (res.code === 1000) {
              const tempCityList: Array<AddreddOptionsItem> = []
              tempCityList.push({
                code: '0',
                name: intl.formatMessage({ id: 'components.suoyou' }),
                pcode: '0',
              })
              if (item.provinceCode !== '0') {
                for (const cityItem of res.data) {
                  tempCityList.push({ ...cityItem })
                }
              }
              const citydata = {
                citydata: tempCityList,
              }
              city[index] = { ...citydata }
              Promise.resolve().then(() => {
                setTimeout(() => {
                  setcity([...city])
                  setcode([...code, item.cityCode])
                  form.setFieldsValue({
                    details: fetchdata.details,
                    purchaseType: fetchdata.purchaseType,
                    priceContrast: fetchdata.priceContrast,
                    ['province_' + index]: item.provinceCode,
                    ['city_' + index]: item.cityCode,
                  })
                }, 350)
              })
            }
          })
          .catch((error) => {
            console.warn(error)
          })
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
                data: {
                  ...res,
                  requisitionFormAddress,
                },
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
  }, [requisitionFormAddress])
  return (
    <>
      <Form {...layout} form={form} className={style.form}>
        <Form.Item
          label={intl.formatMessage({ id: 'table.purchase.details' })}
          name="details"
          rules={[
            { required: true, message: intl.formatMessage({ id: 'detail.purchase.message20' }) },
            { validator: (rule, value, callback) => validatorByte(rule, value, callback, 60) },
          ]}
        >
          <Input placeholder={intl.formatMessage({ id: 'logistics.zuichang60gezi' })} />
        </Form.Item>

        <Form.Item
          label={
            <Tooltip placement="right" title={intl.formatMessage({ id: 'detail.purchase.tips' })}>
              {intl.formatMessage({ id: 'table.purchase.purchaseType' })}
              <QuestionCircleOutlined style={{ marginLeft: '5px' }} />
            </Tooltip>
          }
          name="purchaseType"
          rules={[{ required: true, message: intl.formatMessage({ id: 'detail.purchase.message36' }) }]}
        >
          <Select>
            {PURCHASETYPE.map((item) => (
              <Option key={item.type} value={item.type}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label={
            <Tooltip placement="right" title={intl.formatMessage({ id: 'detail.purchase.tips1' })}>
              {intl.formatMessage({ id: 'detail.purchase.priceMethod' })}
              <QuestionCircleOutlined style={{ marginLeft: '5px' }} />
            </Tooltip>
          }
          name="priceContrast"
          rules={[{ required: true, message: intl.formatMessage({ id: 'detail.purchase.message37' }) }]}
        >
          <Select>
            {PRICECONTRAST.map((item) => (
              <Option key={item.type} value={item.type}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label={
            <Tooltip placement="right" title={intl.formatMessage({ id: 'detail.purchase.tips4' })}>
              {intl.formatMessage({ id: 'detail.purchase.areas' })}
              <QuestionCircleOutlined style={{ marginLeft: '5px' }} />
            </Tooltip>
          }
          style={{ marginBottom: '0' }}
        >
          {requisitionFormAddress.map((item: any, idx: number) => {
            return (
              <Row gutter={10} key={`requisitionFormAddress_${idx}_`} className={style.formwrap}>
                <Col span={12}>
                  <Form.Item name={`province_${idx}`}>
                    <Select
                      onDropdownVisibleChange={onDropdownVisibleChange}
                      onChange={(value) => {
                        handProvince(value, idx, 1)
                      }}
                    >
                      {province.map((items) => {
                        return (
                          <Option key={`${items.id}_${idx}_province`} value={items.code}>
                            {items.name}
                          </Option>
                        )
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name={`city_${idx}`}>
                    <Select
                      onDropdownVisibleChange={onDropdownVisibleChange}
                      onChange={(value) => {
                        handProvince(value, idx, 2)
                      }}
                    >
                      {item.provinceCode &&
                        city.length > 0 &&
                        city[idx] &&
                        city[idx].citydata.map((items) => {
                          return (
                            <Option disabled={items.disabled} key={`${items.id}_${idx}_city`} value={items.code}>
                              {items.name}
                            </Option>
                          )
                        })}
                    </Select>
                  </Form.Item>
                </Col>
                <div className={style.formButton}>
                  {idx === requisitionFormAddress.length - 1 && (
                    <Form.Item>
                      <Button type="primary" onClick={() => addFormAddress(idx)}>
                        +
                      </Button>
                    </Form.Item>
                  )}
                  {requisitionFormAddress.length > 1 && (
                    <Form.Item>
                      <Button onClick={() => removeFormAddress(idx)}>-</Button>
                    </Form.Item>
                  )}
                </div>
              </Row>
            )
          })}
        </Form.Item>
        <Form.Item label={intl.formatMessage({ id: 'detail.purchase.memberName' })} name="memberName">
          <Text strong>{fetchdata && fetchdata.createMemberName && fetchdata.createMemberName}</Text>
        </Form.Item>
        <Form.Item label={intl.formatMessage({ id: 'table.purchase.dementCreateTime' })} name="createTime">
          <Text strong>{fetchdata && fetchdata.createTime && formatTimeString(fetchdata.createTime)}</Text>
        </Form.Item>
        <Form.Item label={intl.formatMessage({ id: 'table.purchase.dementNo' })} name="purchaseInquiryNo">
          <Text strong>{fetchdata && fetchdata.purchaseInquiryNo && fetchdata.purchaseInquiryNo}</Text>
        </Form.Item>
        <Form.Item label={intl.formatMessage({ id: 'table.purchase.externalStatus' })} name="externalState">
          <Text type="warning" strong>
            {fetchdata && fetchdata.externalState && OFFTER_EXTERNALSTATE[fetchdata.externalState]}
          </Text>
        </Form.Item>
        <Form.Item label={intl.formatMessage({ id: 'detail.purchase.innerStatus' })} name="interiorState">
          <Text type="warning" strong>
            {fetchdata && fetchdata.interiorState && OFFTER_INTERNALSTATE[fetchdata.interiorState]}
          </Text>
        </Form.Item>
      </Form>
    </>
  )
}
export default BasicInfo
