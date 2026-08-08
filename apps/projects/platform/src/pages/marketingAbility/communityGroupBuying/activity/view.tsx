/** 分销员查询 */
import React, { Fragment, useState, useRef, useEffect } from 'react'
import { PageHeaderWrapper, StandardFormTable, AuthButton } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { formatTimeString } from '@/utils'
import {
  getManageAreaAll,
  getMarketingMerchantCbgActivityPage,
  getOrderCommunityGroupBuyingConfigGet,
  postMarketingMerchantCbgActivityStop,
} from '@apps/apis'
import useSelectOptions from './services/hooks/useSelectOptions'
import { Space } from '@linkseeks/ui'
import { Link } from '@linkseeks/router-core'
import { history } from '@linkseeks/router-manager'
import { message, Popconfirm } from 'antd'

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
  const [addBtnEnable, setAddBtnEnable] = useState<number>(0)

  useEffect(() => {
    //获取团购开启状态
    getOrderCommunityGroupBuyingConfigGet().then((res) => {
      if (res.code === 1000) {
        setAddBtnEnable(res.data)
      }
    })
  }, [])

  const onTabChange = (key) => {
    setActiveKey(key)
    ref.current.reload()
  }

  const handleStop = (record) => {
    postMarketingMerchantCbgActivityStop({
      id: record.id,
      isEnable: record.socialDistributionStatus === 1 ? 0 : 1,
    }).then((res) => {
      if (res.code === 1000) {
        ref.current.reload()
      }
    })
  }

  const handleAdd = () => {
    //获取团购开启状态
    getOrderCommunityGroupBuyingConfigGet().then((res) => {
      if (res.code === 1000) {
        setAddBtnEnable(res.data)
        if (res.data !== 1) {
          message.error('团购活动已关闭，不能上报活动')
          return
        }
        history.push('/marketingAbility/communityGroupBuying/activity/add')
      }
    })
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
        <>{<Link to={`/marketingAbility/communityGroupBuying/activity/detail?id=${record.id}`}>{record.name}</Link>}</>
      ),
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
          {record.status === 2 && (
            <AuthButton type="custom" code="stop">
              <Popconfirm title="确定要结束吗" okText="是" cancelText="否" onConfirm={() => handleStop(record)}>
                <a>结束活动</a>
              </Popconfirm>
            </AuthButton>
          )}
          <AuthButton type="custom" code="order">
            <Link to={`/marketingAbility/communityGroupBuying/activity/order/detail?id=${record.id}`}>团订单</Link>
          </AuthButton>
          <AuthButton type="custom" code="edit">
            <Link to={`/marketingAbility/communityGroupBuying/activity/edit?id=${record.id}`}>编辑</Link>
          </AuthButton>
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
      getMarketingMerchantCbgActivityPage({ ...payload, status: activeKey }).then((res) => {
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
        searchButtons={[
          addBtnEnable === 1 && {
            children: '新增团购活动',
            type: 'primary',
            onClick() {
              handleAdd()
            },
            key: 'add',
          },
        ]}
      />
    </PageHeaderWrapper>
  )
}
export default CbgActivity
