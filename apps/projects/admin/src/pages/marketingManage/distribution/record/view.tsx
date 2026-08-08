/** 分销员查询 */
import React, { Fragment, useState, useRef } from 'react'
import { Button } from 'antd'
import StatusTag from '@/components/StatusTag'
import { EyeAuthButton, AuthButton, PageHeaderWrapper, StandardFormTable, StatusAuthButton } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { formatTimeString } from '@/utils'
import ModalBox from '../components/modalBox'
import DateModalLayout from '../components/dateModal'
import {
  getMarketingSocialDistributionStaffPage,
  getOrderSocialDistributionPage,
  postMarketingSocialDistributionStaffStatus,
} from '@apps/apis'
import useSelectOptions from './services/hooks/useSelectOptions'
import moment from 'moment'

type dateInfoProps = {
  /** id */
  id: number
  /** 标题 */
  title: string
  /** 接口 */
  fieldApi: any
}

const Link = [
  { key: '', label: '全部' },
  { key: '0', label: '未到账' },
  { key: '1', label: '已到账' },
]

const MarketingSearch: React.FC = () => {
  const ref = useRef({} as ActionType)
  const [visible, setVisible] = useState<boolean>(false)
  const [rowParams, setRowParams] = useState<any>({})
  const [dateInfo, setDateInfo] = useState<dateInfoProps>()
  const [dateVisible, setDateVisible] = useState<boolean>(false)
  const [tabLink, setTabLink] = useState<any[]>(Link)
  const [activeKey, setActiveKey] = useState<string>('')

  const columns: RecordColumns<any>[] = [
    {
      title: '商品ID',
      key: 'productId',
      dataIndex: 'productId',
      fixed: 'left',
      width: 60,
    },
    {
      title: '分销商品',
      key: 'productName',
      dataIndex: 'productName',
      render: (_text, record) => <>{record.productName + record.spec}</>,
    },
    {
      title: '下单数量',
      key: 'quantity',
      dataIndex: 'quantity',
      render: (_text, record) => <>{record.quantity}</>,
    },
    {
      title: '分销订单号',
      key: 'orderNo',
      dataIndex: 'orderNo',
      render: (_text, record) => <>{record.orderNo}</>,
    },
    {
      title: '商家名称',
      key: 'vendorMemberName',
      dataIndex: 'vendorMemberName',
      render: (_text, record) => <>{record.vendorMemberName}</>,
    },
    {
      title: '下单客户名称',
      key: 'buyerMemberName',
      dataIndex: 'buyerMemberName',
      render: (_text, record) => <>{record.buyerMemberName}</>,
    },
    {
      title: '付款时间',
      key: 'payTime',
      dataIndex: 'payTime',
      render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: '完成时间',
      key: 'completedTime',
      dataIndex: 'completedTime',
      render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: '佣金到账时间',
      key: 'commissionArrivalTime',
      dataIndex: 'commissionArrivalTime',
      render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: '佣金类型',
      key: 'commissionType',
      dataIndex: 'commissionType',
      render: (_text, record) => <>{record.commissionType === 1 ? '间接分销' : '直接分销'}</>,
    },
    {
      title: '直接分销员名称',
      key: 'directMemberName',
      dataIndex: 'directMemberName',
      render: (_text, record) => <>{record.directMemberName}</>,
    },
    {
      title: '直接佣金',
      key: 'directCommission',
      dataIndex: 'directCommission',
      render: (_text, record) => <>{record.directCommission}</>,
    },
    {
      title: '间接分销员名称',
      key: 'indirectMemberName',
      dataIndex: 'indirectMemberName',
      render: (_text, record) => <>{record.indirectMemberName}</>,
    },
    {
      title: '间接佣金',
      key: 'indirectCommission',
      dataIndex: 'indirectCommission',
      render: (_text, record) => <>{record.indirectCommission}</>,
    },
    {
      title: '佣金到账状态',
      key: 'status',
      dataIndex: 'status',
      fixed: 'right',
      render: (_text, record) => <>{record.status === 1 ? '已到账' : '未到账'}</>,
    },
  ]

  const handleConfirm = () => {
    setVisible(false)
    ref.current.reload()
  }

  const handleOnSubmit = () => {
    setDateVisible(false)
    setDateInfo({} as dateInfoProps)
    ref.current.reload()
  }

  const onTabChange = (key) => {
    setActiveKey(key)
    ref.current.reload()
  }

  const fetchData = async (params: any) => {
    return new Promise((resolve) => {
      getOrderSocialDistributionPage({ ...params, status: activeKey }).then((res) => {
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
      />
      <ModalBox visible={visible} params={rowParams} onCancel={() => setVisible(false)} onConfirm={handleConfirm} />
      <DateModalLayout
        id={dateInfo?.id}
        title={dateInfo?.title}
        visible={dateVisible}
        fieldApi={dateInfo?.fieldApi}
        onCancel={() => setDateVisible(false)}
        onSubmit={handleOnSubmit}
      />
    </PageHeaderWrapper>
  )
}
export default MarketingSearch
