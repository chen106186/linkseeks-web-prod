import React, { Fragment, useEffect, useState } from 'react'
import { Card, Table, message } from 'antd'
import { PageHeaderWrapper, type RecordColumns } from '@apps/components'
import { usePageStatus } from '@/hooks/usePageStatus'
import { getOrderSocialDistributionDonwlineSummary } from '@apps/apis'
import { formatTimeString } from '@/utils'

const SocialDistributionGoods = () => {
  const { id, staffName } = usePageStatus()
  const [dataSource, setDataSource] = useState([])
  const [downlineCount, setDownlineCount] = useState(0)

  useEffect(() => {
    getOrderSocialDistributionDonwlineSummary({
      memberId: id,
    }).then((res) => {
      if (res.code !== 1000) {
        message.warning('加载失败')
      }
      setDataSource(res.data)
      setDownlineCount(res.data.length)
    })
  }, [])

  const columns: RecordColumns<any>[] = [
    {
      title: '会员ID',
      key: 'memberId',
      dataIndex: 'memberId',
      fixed: 'left',
      width: 60,
      searchField: 'Input',
    },
    {
      title: '分销员名称',
      key: 'memberName',
      dataIndex: 'memberName',
    },
    {
      title: '分销员等级',
      key: 'levelName',
      dataIndex: 'levelName',
    },
    {
      title: '加入时间',
      key: 'joinTime',
      dataIndex: 'joinTime',
      render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: '贡献订单数',
      key: 'orderCount',
      dataIndex: 'orderCount',
    },
    {
      title: '贡献销销售额',
      key: 'amount',
      dataIndex: 'amount',
      render: (_text, record) => <>{record.amount.toFixed(2)}</>,
    },
    {
      title: '预估贡献佣金',
      key: 'commission',
      dataIndex: 'commission',
      render: (_text, record) => <>{record.commission.toFixed(2)}</>,
    },
    {
      title: '账号状态',
      key: 'status',
      dataIndex: 'status',
      render: (_text, record) => <>{record.status === 1 ? '启用' : '禁用'}</>,
    },
  ]

  return (
    <div>
      <PageHeaderWrapper title="查看下级分销员">
        <Card>
          <h3>分销员名称：{staffName}</h3>
          <h3>下级分销员（{downlineCount}人）</h3>
          <Table bordered dataSource={dataSource} columns={columns} />
        </Card>
      </PageHeaderWrapper>
    </div>
  )
}

export default SocialDistributionGoods
