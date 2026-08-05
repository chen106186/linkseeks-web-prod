import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Card, Table, message, Image, Tag, Row, Col, Statistic, Input } from 'antd'
import { BraftEditor, PageHeaderWrapper, type RecordColumns, Editor } from '@apps/components'
import { usePageStatus } from '@/hooks/usePageStatus'
import { getMarketingMerchantCbgActivityExecution } from '@apps/apis'
import { formatTimeString } from '@/utils'
import { Form, Radio, Space } from '@linkseeks/ui'
const { Search } = Input

interface ExpandedDataType {
  key: React.Key
  date: string
  name: string
  upgradeNum: string
}

const CbgActivityOrder = () => {
  const { id } = usePageStatus()
  const [activityData, setActivityData] = useState<any>({})
  const [statData, setStatData] = useState<any>({})
  const [commissionRecordAllList, setCommissionRecordAllList] = useState<any>()
  const [commissionRecordList, setCommissionRecordList] = useState<any>()

  useEffect(() => {
    getMarketingMerchantCbgActivityExecution({
      id: id,
    }).then((res) => {
      if (res.code !== 1000) {
        message.warning('加载失败')
      }
      setActivityData(res.data)
      setCommissionRecordAllList(res.data.commissionRecordList)
      setCommissionRecordList(res.data.commissionRecordList)
      setStatData(tmpStatData)
    })
  }, [])

  const onSearch = (keyword) => {
    const filteredList = commissionRecordAllList.filter((item) =>
      item.orderNo.toLowerCase().includes(keyword.toLowerCase()),
    )
    setCommissionRecordList(filteredList)
  }

  const columns: RecordColumns<any>[] = [
    {
      title: '订单号',
      key: 'orderNo',
      dataIndex: 'orderNo',
    },
    {
      title: '商品SKUID',
      key: 'skuId',
      dataIndex: 'skuId',
    },
    {
      title: '商品规格名称',
      key: 'spec',
      dataIndex: 'spec',
    },
    {
      title: '商品数量',
      key: 'quantity',
      dataIndex: 'quantity',
    },
    {
      title: '支付金额',
      key: 'productAmount',
      dataIndex: 'productAmount',
    },
    {
      title: '团长',
      key: 'teamLeaderName',
      dataIndex: 'teamLeaderName',
    },
    {
      title: '团长佣金比例',
      key: 'commissionRate',
      dataIndex: 'commissionRate',
      render: (_text, record) => <>{(record.commissionRate * 100).toFixed(2) + '%'}</>,
    },
    {
      title: '团长佣金',
      key: 'commissionAmount',
      dataIndex: 'commissionAmount',
    },
    {
      title: '下单时间',
      key: 'payTime',
      dataIndex: 'payTime',
      render: (_text, record) => <>{formatTimeString(_text, 'YYYY-MM-DD HH:mm')}</>,
    },
    {
      title: '支付时间',
      key: 'createTime',
      dataIndex: 'createTime',
      render: (_text, record) => <>{formatTimeString(_text, 'YYYY-MM-DD HH:mm')}</>,
    },
    {
      title: '结算状态',
      key: 'status',
      dataIndex: 'status',
      render: (text: any) => {
        if (text === 0) return '未到账'
        else if (text === 1) return '已到账'
        else if (text === 2) return '无效'
      },
    },
  ]

  return (
    // <div>
    <PageHeaderWrapper title="查看团购活动">
      <Space direction="vertical" size="middle">
        <Card title="活动基本信息">
          <Form labelCol={{ span: 4 }} wrapperCol={{ span: 14 }} layout="horizontal" disabled={true}>
            <Form.Item label="活动名称">
              <span>{activityData.name}</span>
            </Form.Item>
            <Form.Item label="活动描述">
              <span>{activityData.description}</span>
            </Form.Item>
            <Form.Item label="活动时间">
              <span>
                {formatTimeString(activityData.startTime, 'YYYY-MM-DD HH:mm') +
                  '~' +
                  formatTimeString(activityData.endTime, 'YYYY-MM-DD HH:mm')}
              </span>
            </Form.Item>
          </Form>
        </Card>
        <Card title="团购订单">
          <Space direction="vertical">
            <Row gutter={[48, 48]}>
              <Col span={4}>
                <Statistic title="团购订单数" value={activityData.orderCount || 0} />
              </Col>
              <Col span={4}>
                <Statistic title="团购订单金额" value={activityData.totalSales || 0} />
              </Col>
              <Col span={4}>
                <Statistic
                  title="团购佣金金额"
                  value={((activityData.commissionReceived || 0) + (activityData.commissionUnreceived || 0)).toFixed(2)}
                />
              </Col>
              <Col span={4}>
                <Statistic title="未入账佣金" value={activityData.commissionUnreceived || 0} />
              </Col>
              <Col span={4}>
                <Statistic title="已入账佣金" value={activityData.commissionReceived || 0} />
              </Col>
            </Row>
            <Row gutter={[100, 100]}>
              <Col span={6}>
                <Search onSearch={onSearch} placeholder="订单号" />
              </Col>
            </Row>
            <Row gutter={[48, 48]}>
              <Col span={24}>
                <Table columns={columns} dataSource={commissionRecordList} />
              </Col>
            </Row>
          </Space>
        </Card>
      </Space>
    </PageHeaderWrapper>
    // </div>
  )
}

export default CbgActivityOrder
