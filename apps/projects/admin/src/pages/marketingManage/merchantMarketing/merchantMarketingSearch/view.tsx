import React, { useRef } from 'react'
import StatusTag from '@/components/StatusTag'
import { EyeAuthButton, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { formatTimeString } from '@/utils'
import { getMarketingPlatformMerchantActivityPage } from '@apps/apis'
import useSelectOptions from './services/hooks/useSelectOptions'

const MerchantMarketingSearch: React.FC = () => {
  const ref = useRef({} as ActionType)
  const selectData = useSelectOptions()

  const columns: RecordColumns<any>[] = [
    {
      title: '活动ID',
      key: 'id',
      dataIndex: 'id',
      width: 60,
      searchField: {
        type: 'InputNumber',
      },
    },
    {
      title: '活动名称',
      key: 'activityName',
      dataIndex: 'activityName',
      searchField: {
        main: true,
      },
      fixed: 'left',
      render: (text, record) => (
        <EyeAuthButton url={`/marketingManage/merchantMarketing/merchantMarketingSearch/detail?id=${record.id}`}>
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: '活动类型',
      key: 'activityTypeName',
      dataIndex: 'activityTypeName',
      searchField: {
        type: 'Select',
        name: 'activityType',
      },
    },
    {
      title: '会员名称',
      key: 'memberName',
      dataIndex: 'memberName',
      searchField: 'Input',
    },
    {
      title: '活动开始时间',
      key: 'startTime',
      dataIndex: 'startTime',
      searchField: {
        type: 'DateRange',
        title: '发布时间',
        name: ['startTime', 'endTime'],
        placeholder: ['开始时间', '结束时间'],
      },
      render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: '活动结束时间',
      key: 'endTime',
      dataIndex: 'endTime',
      render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: '内部状态',
      key: 'innerStatus',
      dataIndex: 'innerStatus',
      searchField: 'Select',
      fixed: 'right',
      render: (_text, record) => <StatusTag type="danger" title={record.innerStatusName} />,
    },
  ]

  const fetchData = async (params: any) => {
    return new Promise((resolve) => {
      const payload = { ...params }
      if (payload.innerStatus === 0) {
        payload.innerStatus = undefined
      }
      getMarketingPlatformMerchantActivityPage({ ...payload }).then((res) => {
        if (res.code === 1000) {
          resolve(res.data)
        }
      })
    })
  }

  return (
    <PageHeaderWrapper>
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
export default MerchantMarketingSearch
