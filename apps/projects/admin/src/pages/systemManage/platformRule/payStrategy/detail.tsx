import React, { Fragment, useEffect, useState } from 'react'
import { PageHeaderWrapper, StandardFormTable } from '@apps/components'
import { Card, Tabs, Form, Typography, Space } from 'antd'
import style from './components/index.less'
import { isEmpty } from 'lodash'
import { usePageStatus } from '@/hooks/usePageStatus'
import { getOrderPlatformPaymentDetail, getOrderPlatformPaymentMemberPage } from '@apps/apis'

const layout: any = {
  colon: false,
  labelCol: { style: { width: '144px' } },
  wrapperCol: { span: 9 },
  labelAlign: 'left',
}
const { TabPane } = Tabs

type GetOrderPlatformPaymentDetailResponse = {
  /**
   * 支付策略Id
   */
  paymentId: number
  /**
   * 指定会员
   */
  allMembers?: boolean
  /**
   * 支付策略名称
   */
  name: string
  /**
   * 支付方式与支付渠道列表 ,PlatformPaymentPayTypeDetailVO
   */
  payTypes: {
    /**
     * 支付方式枚举
     */
    payType: number
    /**
     * 支付方式名称
     */
    payTypeName: string
    /**
     * 资金归集模式列表 ,PlatformPaymentFundModeVO
     */
    fundModes: {
      /**
       * 资金归集模式枚举
       */
      fundMode?: number
      /**
       * 资金归集模式名称
       */
      fundModeName?: string
    }[]
    /**
     * 已选择的资金归集模式枚举值
     */
    fundMode: number
    /**
     * 支付渠道列表 ,PlatformPaymentPayChannelVO
     */
    channels: {
      /**
       * 支付渠道类型枚举
       */
      payChannel?: number
      /**
       * 支付渠道类型名称
       */
      payChannelName?: string
    }[]
    /**
     * 已选择的支付渠道枚举值列表 ,Integer
     */
    payChannels: number[]
  }[]
}

const PaymentConfigPreview: React.FC = () => {
  const { paymentId } = usePageStatus()
  const [data, setData] = useState<GetOrderPlatformPaymentDetailResponse>()

  useEffect(() => {
    if (paymentId) {
      getOrderPlatformPaymentDetail({ paymentId }).then((res) => {
        if (res.code !== 1000) {
          return
        }
        const { data } = res
        setData(data)
      })
    }
  }, [])

  const columns: any[] = [
    {
      title: 'ID',
      key: 'memberId',
      dataIndex: 'memberId',
    },
    {
      title: '会员名称',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: '会员类型',
      key: 'memberTypeName',
      dataIndex: 'memberTypeName',
    },
    {
      title: '会员角色',
      key: 'roleName',
      dataIndex: 'roleName',
    },
    {
      title: '会员等级',
      key: 'levelTag',
      dataIndex: 'levelTag',
    },
  ]

  const fetchTableData = (params) => {
    return new Promise((resolve) => {
      getOrderPlatformPaymentMemberPage({ paymentId, ...params }).then((res) => {
        if (res.code !== 1000) {
          return
        }
        resolve(res.data)
      })
    })
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <Form {...layout}>
          <Tabs>
            <TabPane tab="基本信息" key={1} forceRender>
              <Form.Item label="策略名称">
                <Typography.Text>{data?.name}</Typography.Text>
              </Form.Item>
              {data?.payTypes.map((item, index) => {
                const channels: any[] = []
                item.payChannels.forEach((v) => {
                  channels.push(item.channels.filter((_v) => _v.payChannel === v)[0])
                })
                return (
                  <Fragment key={item.payType * index}>
                    <div className={style.anchor}>{item.payTypeName}</div>
                    <Form.Item className={style.spaceBox} label="资金收集模式">
                      <Space direction="vertical">
                        <Form.Item>
                          {item.fundModes &&
                            item.fundModes
                              .filter((v) => v.fundMode === item.fundMode)
                              .map((i) => <Typography.Text key={i.fundMode}>{i?.fundModeName}</Typography.Text>)}
                        </Form.Item>
                        <Form.Item>
                          {!isEmpty(channels) &&
                            channels.map((_v) => (
                              <Typography.Text style={{ display: 'inline-block', paddingRight: '10px' }}>
                                {_v.payChannelName}
                              </Typography.Text>
                            ))}
                        </Form.Item>
                      </Space>
                    </Form.Item>
                  </Fragment>
                )
              })}
            </TabPane>
            <TabPane tab="适用会员" key={2} forceRender>
              <Form.Item label="适用会员">
                {data?.allMembers && '所有会员共享(默认)'}
                {!data?.allMembers && '指定会员'}
              </Form.Item>
              {!data?.allMembers && (
                <StandardFormTable columns={columns} autoScrollX rowKey="id" request={fetchTableData} />
              )}
            </TabPane>
          </Tabs>
        </Form>
      </Card>
    </PageHeaderWrapper>
  )
}
export default PaymentConfigPreview
