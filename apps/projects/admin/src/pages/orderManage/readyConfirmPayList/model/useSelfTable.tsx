import React from 'react'
import type { RecordColumns } from '@apps/components/src/web/StandardFormTable/types'
import { history } from '@linkseeks/router-manager'
import { Button, Row, Col } from 'antd'
import { EyeAuthButton, AuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import { FieldTimeOutlined } from '@ant-design/icons'
import { Chart, Interval, Coordinate, Legend, View } from 'bizcharts'
import DataSet from '@antv/data-set'

// 圆形环状金额显示
const CircleChart = (props) => {
  const { sumPrice = 100, alreadyPay = 10 } = props
  const { DataView } = DataSet
  const amount = Number(sumPrice) - Number(alreadyPay)
  const userData = [
    { type: '总金额', value: amount },
    { type: '已支付', value: Number(alreadyPay) },
  ]

  const userDv = new DataView()
  userDv.source(userData).transform({
    type: 'percent',
    field: 'value',
    dimension: 'type',
    as: 'percent',
  })
  return (
    <Chart placeholder={false} height={40} autoFit>
      <Legend visible={false} />
      {/* 绘制图形 */}
      <View data={userDv.rows}>
        <Coordinate type="theta" innerRadius={0.75} />
        <Interval position="percent" adjust="stack" color={['type', ['#EEF0F3', '#41CC9E']]} tooltip={false} />
      </View>
    </Chart>
  )
}

// 业务hooks, 待支付订单
export const useSelfTable = () => {
  const handleConfirm = async (record) => {
    history.push(`/orderManage/readyConfirmPayList/detail?id=${record.orderId}`)
  }

  const payOrderColumns: RecordColumns<any>[] = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      searchField: {
        main: true,
      },
      render: (text, record) => {
        return <EyeAuthButton url={`/orderManage/list/detail?id=${record.orderId}`}>{text}</EyeAuthButton>
      },
    },
    {
      title: '订单商品摘要/下单时间',
      dataIndex: 'digest',
      key: 'digest',
      searchField: [
        { type: 'Input', title: '订单商品摘要', name: 'digest' },
        { type: 'DateRange', title: '下单时间', name: ['startDate', 'endDate'], placeholder: ['开始时间', '结束时间'] },
      ],
      render: (text, record) => (
        <>
          <div>{record.digest}</div>
          <div>
            <FieldTimeOutlined />
            {formatTimeString(record.createTime)}
          </div>
        </>
      ),
      width: 200,
    },
    {
      title: '供应会员',
      align: 'left',
      dataIndex: 'vendorMemberName',
      key: 'vendorMemberName',
      searchField: 'Input',
    },
    {
      title: '总金额/已支付(元)',
      dataIndex: 'amount',
      key: 'amount',
      render: (text, record) => (
        <Row justify="space-between">
          <Col>
            <div>
              <span>总金额：</span>
              <span>{record.amount}</span>
            </div>
            <div>
              <span>已支付：</span>
              <span>{record.paidAmount || 0}</span>
            </div>
          </Col>
          <Col style={{ width: 40 }}>
            <CircleChart sumPrice={text} alreadyPay={record.paidAmount} />
          </Col>
        </Row>
      ),
      width: 200,
    },
    { title: '已支付', dataIndex: 'paidAmount', key: 'paidAmount' },
    {
      title: '当前支付',
      dataIndex: 'batchNo',
      key: 'batchNo',
      render: (text, record) => `${text} / ${record.batchCount} 次`,
    },
    {
      title: '订单类型',
      dataIndex: 'orderTypeName',
      key: 'orderTypeName',
      searchField: { type: 'Select', name: 'orderType' },
    },
    {
      title: '外部状态',
      dataIndex: 'outerStatusName',
      key: 'outerStatusName',
    },
    {
      title: '操作',
      dataIndex: 'ctl',
      key: 'ctl',
      fixed: 'right',
      width: 120,
      render: (text, record) => (
        <>
          <AuthButton type="custom" code="submit">
            <Button type="link" onClick={() => handleConfirm(record)}>
              去确认
            </Button>
          </AuthButton>
        </>
      ),
    },
  ]

  return {
    columns: payOrderColumns,
  }
}
