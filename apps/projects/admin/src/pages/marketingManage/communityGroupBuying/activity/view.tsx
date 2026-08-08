/** 分销员查询 */
import React, { Fragment, useState, useRef } from 'react'
import { PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { formatTimeString } from '@/utils'
import { getMarketingPlatformCbgActivityPage } from '@apps/apis'
import useSelectOptions from './services/hooks/useSelectOptions'
import { Space } from '@linkseeks/ui'
import { Link } from '@linkseeks/router-core'

type dateInfoProps = {
  /** id */
  id: number
  /** 标题 */
  title: string
  /** 接口 */
  fieldApi: any
}

const LinkData = [
  { key: '', label: '全部' },
  { key: '1', label: '未开始' },
  { key: '2', label: '进行中' },
  { key: '3', label: '已结束' },
]

const CbgActivity: React.FC = () => {
  const ref = useRef({} as ActionType)
  const selectData = useSelectOptions()
  const [tabLink, setTabLink] = useState<any[]>(LinkData)
  const [activeKey, setActiveKey] = useState<string>('')

  const onTabChange = (key) => {
    setActiveKey(key)
    ref.current.reload()
  }

  const columns: RecordColumns<any>[] = [
    {
      title: '活动ID',
      key: 'id',
      dataIndex: 'id',
      fixed: 'left',
      width: 60,
      searchField: 'Input',
    },
    {
      title: '团购活动',
      key: 'name',
      dataIndex: 'name',
      searchField: {
        main: true,
      },
      render: (_text, record) => (
        <>{<Link to={`/marketingManage/communityGroupBuying/activity/detail?id=${record.id}`}>{record.name}</Link>}</>
      ),
    },
    {
      title: '商家名称',
      key: 'memberName',
      dataIndex: 'memberName',
    },
    {
      title: '活动时间',
      key: 'startTime',
      dataIndex: 'startTime',
      render: (_text, record) => (
        <>
          {formatTimeString(record.startTime, 'YYYY-MM-DD HH:mm') +
            '~' +
            formatTimeString(record.endTime, 'YYYY-MM-DD HH:mm')}
        </>
      ),
    },
    {
      title: '成团团长数',
      key: 'totalGroupNum',
      dataIndex: 'totalGroupNum',
    },
    {
      title: '参团人数',
      key: 'totalGroupPeople',
      dataIndex: 'totalGroupPeople',
    },
    {
      title: '支付订单数',
      key: 'totalPayNum',
      dataIndex: 'totalPayNum',
      render: (_text, record) => <>{record.totalPayNum}</>,
    },
    {
      title: '支付金额',
      key: 'totalPayAmount',
      dataIndex: 'totalPayAmount',
      render: (_text, record) => <>{record.totalPayAmount}</>,
    },
    {
      title: '已入账佣金',
      key: 'totalCommissionPosted',
      dataIndex: 'totalCommissionPosted',
      render: (_text, record) => <>{record.totalCommissionPosted}</>,
    },
    {
      title: '未入账佣金',
      key: 'totalCommissionUnPosted',
      dataIndex: 'totalCommissionUnPosted',
      render: (_text, record) => <>{record.totalCommissionUnPosted}</>,
    },
    {
      title: '活动状态',
      key: 'status',
      dataIndex: 'status',
      render: (text: any) => {
        if (text === 1) return '未开始'
        else if (text === 2) return '进行中'
        else if (text === 3) return '已结束'
      },
    },
    {
      title: '操作',
      key: 'state',
      dataIndex: 'state',
      fixed: 'right',
      render: (_text, record) => (
        <Space>
          <Link to={`/marketingManage/communityGroupBuying/activity/execution/detail?id=${record.id}`}>
            活动执行数据
          </Link>
        </Space>
      ),
    },
  ]

  const fetchData = async (params: any) => {
    const { ...arg } = params
    const payload = { ...arg }

    console.log('payload', payload)
    console.log('activeKey', activeKey)

    return new Promise((resolve) => {
      getMarketingPlatformCbgActivityPage({ ...payload, status: activeKey }).then((res) => {
        if (res.code === 1000) {
          resolve(res.data)
        }
      })
    })
  }

  return (
    <PageHeaderWrapper isTabs items={tabLink} onTabChange={(key) => onTabChange(key)}>
      <StandardFormTable
        columns={columns}
        autoScrollX
        request={(params) => fetchData(params)}
        rowKey="id"
        actionRef={ref}
        searchSelectMaps={selectData}
      />
    </PageHeaderWrapper>
  )
}
export default CbgActivity
