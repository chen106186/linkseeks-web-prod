import React, { useState, useEffect } from 'react'
import { Form, Input, Select, Tooltip, Row, Col, message, Button, Typography } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'

import { getManageAreaAll, getManageAreaByPcodeAll } from '@apps/apis'
import { formatTimeString } from '@/utils'

import { validatorByte } from '../../validator'

import style from './index.less'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

const { Option } = Select
const { Text } = Typography
const layout: any = {
  colon: false,
  labelCol: { style: { width: '174px' } },
  wrapperCol: { span: 9 },
  labelAlign: 'left',
}

interface Iprops {
  currentRef: any
  fetchdata: any
  onBadge: (num: number, idx: number) => void
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
      getManageAreaAll().then((res) => {
        if (res.code === 1000) {
          resolve(res.data)
        }
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
          getManageAreaByPcodeAll({ pcode: val }).then((res: any) => {
            if (res.code === 1000) {
              result[idx].provinceCode = val
              result[idx].province = item.name
              city[idx] = { citydata: res.data }
              setcity([...city])
            }
          })
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
      provinceCode: '',
      province: '',
      cityCode: '',
      city: '',
    }
    if (requisitionFormAddress[idx].provinceCode && requisitionFormAddress[idx].cityCode) {
      setrequisitionFormAddress([...requisitionFormAddress, address])
    } else {
      message.error(intl.formatMessage({ id: 'detail.purchase.message35' }))
    }
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
    manageProvince().then((data) => {
      setprovince(data)
    })
  }, [])
  useEffect(() => {
    if (Object.keys(fetchdata).length > 0) {
      setrequisitionFormAddress([...fetchdata.areas])
      fetchdata.areas.forEach((item: any, index: number) => {
        getManageAreaByPcodeAll({ pcode: item.provinceCode }).then((res: any) => {
          if (res.code === 1000) {
            const citydata = {
              citydata: res.data,
            }
            city[index] = { ...citydata }
            Promise.resolve().then(() => {
              setTimeout(() => {
                setcity([...city])
                setcode([...code, item.cityCode])
                form.setFieldsValue({
                  details: fetchdata.details,
                  ['province_' + index]: item.provinceCode,
                  ['city_' + index]: item.cityCode,
                })
              }, 350)
            })
          }
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
                  isAreas: 1,
                  areas: [...requisitionFormAddress],
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
          label={intl.formatMessage({ id: 'detail.purchase.biddingDetails' })}
          name="details"
          rules={[
            { required: true, message: intl.formatMessage({ id: 'detail.purchase.message43' }) },
            {
              validator: (r, v) => validatorByte(v, 60),
            },
          ]}
        >
          <Input maxLength={60} placeholder={intl.formatMessage({ id: 'detail.purchase.placeholder4' })} />
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: intl.formatMessage({ id: 'detail.purchase.message44' }) }]}
          required
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
                      placeholder={intl.formatMessage({ id: 'detail.purchase.placeholder7' })}
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
                      placeholder={intl.formatMessage({ id: 'detail.purchase.placeholder6' })}
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
          <Text strong>{fetchdata && fetchdata.memberName && fetchdata.memberName}</Text>
        </Form.Item>
        <Form.Item label={intl.formatMessage({ id: 'table.purchase.dementCreateTime' })} name="createTime">
          <Text strong>{fetchdata && fetchdata.createTime && formatTimeString(fetchdata.createTime)}</Text>
        </Form.Item>
        <Form.Item label={intl.formatMessage({ id: 'detail.purchase.biddingNo' })} name="purchaseInquiryNo">
          <Text strong>{fetchdata && fetchdata.biddingNo && fetchdata.biddingNo}</Text>
        </Form.Item>
        <Form.Item label={intl.formatMessage({ id: 'table.purchase.externalStatus' })} name="externalState">
          <Text type="warning" strong>
            {fetchdata && fetchdata.externalState && fetchdata.externalStateName}
          </Text>
        </Form.Item>
        <Form.Item label={intl.formatMessage({ id: 'table.purchase.innerStatus' })} name="interiorState">
          <Text type="warning" strong>
            {fetchdata && fetchdata.interiorState && fetchdata.interiorStateName}
          </Text>
        </Form.Item>
      </Form>
    </>
  )
}
export default BasicInfo
