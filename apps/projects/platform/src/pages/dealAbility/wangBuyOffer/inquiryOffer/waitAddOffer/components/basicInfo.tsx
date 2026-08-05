import React, { useState, useEffect, Fragment } from 'react'
import { Row, Col, Form, Input, Select } from 'antd'
import { Card } from '@linkseeks/ui'
import { getCommoditySelectGetTelCode, getCommoditySelectGetSelectCurrency } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import { useWebIntl } from '@apps/locales'
import style from './index.less'
import { useTelCode } from '@apps/services'

interface BasicInfoLayoutProps {
  /** 求购信息 */
  purchaseDetail: any
  form: any
  setCurrency: any
}
const intl = getIntl()
const BasicInfoLayout: React.FC<BasicInfoLayoutProps> = (props: any) => {
  const { form, setCurrency } = props
  const [telCode, setTelCode] = useState<any>([])
  const [currencyList, setCurrencyList] = useState<any>([])
  const translate = useWebIntl()
  const { getTelPattern } = useTelCode()

  const fetchTelCode = async () => {
    const { data, code } = await getCommoditySelectGetTelCode()
    if (code !== 1000) {
      return
    }
    setTelCode(data)
  }

  const fnGetCurrency = async () => {
    const { data, code } = await getCommoditySelectGetSelectCurrency()
    if (code !== 1000) {
      return
    }
    setCurrencyList(data)
  }

  useEffect(() => {
    fetchTelCode()
    fnGetCurrency()
  }, [])

  const fnOnchange = (value: string, type: string) => {
    const obj = {}
    obj[type] = value
    if (type === 'currencyId') {
      // 如果是币种  重置一下数据
      currencyList.forEach((item: any) => {
        if (item.value === value) {
          setCurrency(item)
        }
      })
    }
    form.setFieldsValue(obj)
  }

  return (
    <Card id="basicInfoLayout" title={translate('web.resource.deal.baojiadanxinxi')}>
      <Fragment>
        <Row gutter={[48, 24]}>
          <Col span={12} className={style.searchColor}>
            <Form.Item
              label={intl.formatMessage({ id: 'dealAbility.baojiadanzhaiyao' })}
              name="name"
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: 'dealAbility.qingshurubaojiadanzhaiyao' }),
                },
              ]}
            >
              <Input
                onChange={(e) => {
                  fnOnchange(e.target.value, 'name')
                }}
                maxLength={30}
                placeholder={intl.formatMessage({ id: 'dealAbility.zuichang60zifu30gehan' })}
              />
            </Form.Item>
            <Form.Item
              label={intl.formatMessage({ id: 'dealAbility.lianxirendianhua' })}
              required
              style={{ marginBottom: '0px' }}
            >
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="contactCountryCode"
                    rules={[
                      {
                        required: true,
                        message: intl.formatMessage({ id: 'dealAbility.qingxuanze' }),
                      },
                    ]}
                  >
                    <Select
                      onChange={(value) => {
                        fnOnchange(value, 'contactCountryCode')
                      }}
                    >
                      {telCode.map((item) => (
                        <Select.Option key={item.value} value={item.value}>
                          {item.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currValues) =>
                      prevValues.contactCountryCode !== currValues.contactCountryCode
                    }
                  >
                    {({ getFieldValue }) => {
                      const contactCountryCode = getFieldValue('contactCountryCode')

                      return (
                        <Form.Item
                          name="contactMobile"
                          rules={[
                            {
                              required: true,
                              message: intl.formatMessage({ id: 'dealAbility.qingxuanze' }),
                            },
                            {
                              pattern: getTelPattern(contactCountryCode),
                              message: intl.formatMessage({
                                id: 'member.management.import.query.form.basic.phone.rules-fact',
                              }),
                            },
                          ]}
                        >
                          <Input
                            type="number"
                            maxLength={11}
                            onChange={(e) => {
                              fnOnchange(e.target.value, 'contactMobile')
                            }}
                          />
                        </Form.Item>
                      )
                    }}
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
          </Col>
          <Col span={12} className={style.searchColor}>
            <Form.Item
              label={intl.formatMessage({ id: 'detail.purchase.contacts' })}
              name="contactName"
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: 'dealAbility.qingshurubaojiadanzhaiyao' }),
                },
              ]}
            >
              <Input
                onChange={(e) => {
                  fnOnchange(e.target.value, 'contactName')
                }}
                maxLength={30}
                placeholder={intl.formatMessage({ id: 'dealAbility.zuichang60zifu30gehan' })}
              />
            </Form.Item>
            <Form.Item
              label={intl.formatMessage({ id: 'balance.bizhong' })}
              name="currencyId"
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'dealAbility.qingxuanzebizhong',
                    defaultMessage: '请选择币种',
                  }),
                },
              ]}
            >
              <Select
                onChange={(e) => {
                  fnOnchange(e, 'currencyId')
                }}
                options={currencyList}
              />
            </Form.Item>
          </Col>
        </Row>
      </Fragment>
    </Card>
  )
}

export default BasicInfoLayout
