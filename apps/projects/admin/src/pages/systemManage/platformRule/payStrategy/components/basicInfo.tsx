import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { Form, Input, Space, Select, Checkbox } from 'antd'
import { isEmpty } from 'lodash'
import style from './index.less'
import { getOrderPlatformPaymentItems } from '@apps/apis'

export type channels = {
  /** 支付渠道类型枚举 */
  payChannel?: number
  /** 支付渠道类型名称 */
  payChannelName?: string
}

export type fundModes = {
  /** 资金归集模式枚举 */
  fundMode?: number
  /** 资金归集模式名称 */
  fundModeName?: string
}

export interface PaymentItems {
  /** 支付方式枚举 */
  payType: number
  /** 支付方式名称 */
  payTypeName: string
  /** 资金归集模式列表 */
  channels: channels[]
  /** 支付渠道列表 */
  fundModes: fundModes[]
}

const payTypes = {
  undMode: '',
  payChannels: [],
  payType: '',
}

const BasicInfo = () => {
  const [paymentItems, setPaymentItems] = useState<PaymentItems[]>([])
  const payment = useCallback(async () => {
    await getOrderPlatformPaymentItems().then((res) => {
      if (res.code !== 1000) {
        return
      }
      setPaymentItems(res.data)
    })
  }, [])

  useEffect(() => {
    if (isEmpty(paymentItems)) {
      payment()
    }
  }, [paymentItems])

  return (
    <Fragment>
      <Form.Item label="策略名称" name="name" rules={[{ required: true, message: '请输入策略名称' }]}>
        <Input maxLength={50} placeholder="请输入策略名称" />
      </Form.Item>
      {!isEmpty(paymentItems) && (
        <Form.List initialValue={paymentItems} name="payTypes">
          {(fields) =>
            fields.map(({ key, name, ...restField }) => {
              const item = paymentItems[key]

              return (
                <Fragment key={key}>
                  {!isEmpty(item) && (
                    <>
                      <div className={style.anchor}>{item.payTypeName}</div>
                      <Form.Item className={style.spaceBox} label="资金归集模式">
                        <Space direction="vertical">
                          <Form.Item
                            {...restField}
                            name={[name, 'fundMode']}
                            // rules={[{ required: true, message: '请选择' }]}
                            initialValue={item.fundModes[0].fundMode}
                          >
                            <Select style={{ width: '100%' }}>
                              {item.fundModes.map((v: any) => (
                                <Select.Option key={v.fundMode} value={v.fundMode}>
                                  {v.fundModeName}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, 'payChannels']}
                            // rules={[{ required: true, message: '请选择' }]}
                          >
                            <Checkbox.Group>
                              {!isEmpty(item.channels) &&
                                item.channels.map((v: any) => (
                                  <Checkbox key={v.payChannel} value={v.payChannel}>
                                    {v.payChannelName}
                                  </Checkbox>
                                ))}
                            </Checkbox.Group>
                          </Form.Item>
                        </Space>
                      </Form.Item>
                    </>
                  )}
                </Fragment>
              )
            })
          }
        </Form.List>
      )}
    </Fragment>
  )
}
export default BasicInfo
