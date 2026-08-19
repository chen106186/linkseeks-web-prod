/** 团长信息变更查询 */
import React, { Fragment, useState, useRef, useMemo, useEffect } from 'react'
import { Button, message, Tag } from 'antd'
import { PageHeaderWrapper, StandardFormTable, ImageBox } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { formatTimeString } from '@/utils'
import { getMarketingPlatformCbgTeamLeaderPage } from '@apps/apis'
import useSelectOptions from './services/hooks/useSelectOptions'
import { Form, Input, Radio, Modal, Space } from '@linkseeks/ui'
import { Link } from '@linkseeks/router-core'

const LinkData = [
  { key: '', label: '全部' },
  { key: '1', label: '待审核' },
  { key: '2', label: '审核通过' },
  { key: '3', label: '审核不通过' },
]

const CbgTeamLeaderChange: React.FC = () => {
  const ref = useRef({} as ActionType)
  const selectData = useSelectOptions()
  const [tabLink, setTabLink] = useState<any[]>(LinkData)
  const [activeKey, setActiveKey] = useState<string>('')
  const [formKey, setFormKey] = useState(Date.now())

  const onTabChange = (key) => {
    setActiveKey(key)
    ref.current.reload()
  }

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
      title: '团长名称',
      key: 'name',
      dataIndex: 'name',
      searchField: {
        main: true,
      },
      render: (_text, record) => (
        <>
          {
            <Link to={`/marketingManage/communityGroupBuying/teamLeaderChangeManage/detail?id=${record.id}`}>
              {record.name}
            </Link>
          }
        </>
      ),
    },
    {
      title: '团长手机号',
      key: 'phone',
      dataIndex: 'phone',
      searchField: 'Input',
    },
    {
      title: '家庭地址',
      key: 'homeAddress',
      dataIndex: 'pickupPointName',
      render: (_text, record) => (
        <>{record.homeProvince + record.homeCity + record.homeArea + record.homeStreet + record.homeAddress}</>
      ),
    },
    {
      title: '自提点信息',
      key: 'pickupPointName',
      dataIndex: 'pickupPointName',
      render: (_text, record) => (
        <>
          {record.pickupPointName +
            ' ' +
            record.phone +
            ' ' +
            record.pickupPointProvince +
            record.pickupPointCity +
            record.pickupPointArea +
            record.pickupPointStreet +
            record.pickupPointAddress}
        </>
      ),
    },
    {
      title: '申请时间',
      key: 'createTime',
      dataIndex: 'createTime',
      render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: '申请状态',
      key: 'status',
      dataIndex: 'status',
      render: (text: any) => {
        if (text === 1) return '待审核'
        else if (text === 2) return '审核通过'
        else if (text === 3) return '审核不通过'
      },
    },
    {
      title: '拒绝原因',
      key: 'rejectionReason',
      dataIndex: 'rejectionReason',
      render: (_text, record) => {
        return record.status === 3 ? _text : ''
      },
    },
    {
      title: '操作',
      key: 'state',
      dataIndex: 'state',
      fixed: 'right',
      render: (_text, record) => (
        <Space>
          {record.status === 1 ? (
            <Link to={`/marketingManage/communityGroupBuying/teamLeaderChangeManage/detail?id=${record.id}`}>审核</Link>
          ) : (
            ''
          )}
        </Space>
      ),
    },
  ]

  const fetchData = async (params: any) => {
    const { ...arg } = params
    const payload = { ...arg }

    return new Promise((resolve) => {
      getMarketingPlatformCbgTeamLeaderPage({ ...payload, status: activeKey }).then((res) => {
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
        searchButtons={[]}
      />
    </PageHeaderWrapper>
  )
}
export default CbgTeamLeaderChange
