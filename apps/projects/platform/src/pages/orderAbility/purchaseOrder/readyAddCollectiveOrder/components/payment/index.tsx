import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Form, Select, Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { getOrderCollectiveCreatePayTypes, postOrderCollectiveCreatePaymentFind } from '@apps/apis'
import { useWebIntl } from '@apps/locales'
import { accMul } from '@apps/utils'
import { usePageStatus } from '@/hooks/usePageStatus'
import { useOrder } from '../../orderProvider'

interface PaymentValueType {
  /** 支付次数 */
  batchNo: number
  /** 支付环节 */
  payNode: string
  /** 外部状态 */
  outerStatusName: string
  /** 支付比例 */
  payRate: number
  /** 支付方式	 */
  payType: number
  /** 支付渠道 */
  payChannel: number
}

interface PayWayItem {
  payTypeName: string
  payType: number
  payChannels: {
    /**
     * 支付渠道枚举值，1-支付宝，2-微信，3-银联，4-余额支付，5-线上支付线下确认，6-授信，7-货到付款，8-月结，9-账期，10-月结
     */
    payChannel?: number
    /**
     * 支付渠道名称
     */
    payChannelName?: string
  }[]
}

interface IPorps {
  value?: PaymentValueType[]
  onChange?: (value: PaymentValueType[]) => void
}

const Payment: React.FC<IPorps> = (props) => {
  const { value } = props
  const { form, orderDetail } = useOrder()
  const { id } = usePageStatus()
  const products = Form.useWatch('products', form)
  const [payWayList, setPayWayList] = useState<PayWayItem[]>([])
  const initState = useRef<boolean>(id ? false : true)
  const translate = useWebIntl()

  const initPayWayList = (memberId, memberRoleId) => {
    const result: PayWayItem[] = []
    getOrderCollectiveCreatePayTypes({ vendorMemberId: memberId, vendorRoleId: memberRoleId }).then((res) => {
      const { data = [], code } = res
      if (code === 1000 && data.length > 0) {
        for (let item of data) {
          result.push({
            payTypeName: item.payTypeName,
            payType: item.payType,
            payChannels: [...item.payChannels],
          })
        }
        setPayWayList(result)
      }
    })
  }

  const columns: ColumnsType<any> = useMemo(
    () => [
      {
        title: translate('web.resource.payment.zhifucishu'),
        dataIndex: 'batchNo',
      },
      {
        title: translate('web.resource.payment.zhifuhuangjie'),
        dataIndex: 'payNode',
      },
      {
        title: translate('web.common.waibuzhuangtai'),
        dataIndex: 'outerStatusName',
      },
      {
        title: translate('web.resource.payment.zhifubili'),
        dataIndex: 'payRate',
        render: (payRate) => `${payRate}%`,
      },
      {
        title: translate('web.resource.payment.zhifujine'),
        dataIndex: 'amount',
        render: (_, record) => {
          if (products && products.length > 0) {
            const amount = products.reduce((accumulator, current) => {
              return accumulator + accMul(current.price, current.quantity)
            }, 0)
            return accMul(amount, record.payRate / 100)
          }
          return 0
        },
      },
      {
        title: translate('web.resource.mall.payType'),
        dataIndex: 'payType',
        width: 160,
        render: (payType, record, index) => {
          return (
            <Form.Item
              name={['payments', index, 'payType']}
              noStyle
              rules={[
                {
                  required: true,
                  message: translate('web.resource.mall.qingxuanzezhifufangshi'),
                },
              ]}
            >
              <Select
                style={{ width: 150 }}
                options={payWayList.map((item) => ({
                  label: item.payTypeName,
                  value: item.payType,
                }))}
                onChange={() => {
                  form.setFieldValue(['payments', index, 'payChannel'], undefined)
                }}
              />
            </Form.Item>
          )
        },
      },
      {
        title: translate('web.resource.payment.zhifuqudao'),
        dataIndex: 'payChannel',
        width: 160,
        render: (payChannel, record, index) => {
          return (
            <Form.Item shouldUpdate noStyle>
              {({ getFieldValue }) => {
                const payType = getFieldValue(['payments', index, 'payType'])
                const payTypeItem = payWayList.find((item) => item.payType === payType)

                return (
                  <Form.Item
                    name={['payments', index, 'payChannel']}
                    noStyle
                    rules={[
                      {
                        required: true,
                        message: translate('web.resource.payment.qingxuanzezhifuqudao'),
                      },
                    ]}
                  >
                    <Select
                      style={{ width: 150 }}
                      options={payTypeItem?.payChannels?.map((item) => ({
                        label: item.payChannelName,
                        value: item.payChannel,
                      }))}
                    />
                  </Form.Item>
                )
              }}
            </Form.Item>
          )
        },
      },
    ],
    [payWayList],
  )

  const getPayLists = (memberId, memberRoleId) => {
    initPayWayList(memberId, memberRoleId)
    postOrderCollectiveCreatePaymentFind(
      {
        memberId,
        roleId: memberRoleId,
        shopId: products[0]['shopId'],
        orderMode: 1,
        products: products.map((item) => ({
          productId: item.commodityId,
          skuId: item.skuId,
          crossBorder: item.isCrossBorder,
        })),
      },
      { ctlType: 'none' },
    ).then((res) => {
      const { code, data } = res
      if (code === 1000) {
        form.setFieldValue('payments', data)
      }
    })
  }

  useEffect(() => {
    if (products && products.length > 0) {
      if (initState.current) {
        form.setFieldValue('payments', [])
        getPayLists(products[0].memberId, products[0].memberRoleId)
      } else {
        if (orderDetail) {
          initPayWayList(orderDetail.vendorMemberId, orderDetail.vendorRoleId)
          form.setFieldValue('payments', orderDetail.payments)
        }
        initState.current = true
      }
    } else {
      form.setFieldValue('payments', [])
    }
  }, [products])

  return <Table columns={columns} dataSource={value || []} pagination={false} rowKey="batchNo" />
}

export default Payment
