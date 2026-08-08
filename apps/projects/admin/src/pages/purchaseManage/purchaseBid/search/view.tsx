import React, { useRef } from 'react'
import { Typography, Space } from 'antd'
import { PlayCircleOutlined, PoweroffOutlined } from '@ant-design/icons'

import { EyeAuthButton, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import StatusTag from '@/components/StatusTag'
import { formatTimeString } from '@/utils'
import { getPurchaseBiddingPlatformList } from '@apps/apis'

import { BID_EXTERNALSTATE_COLOR } from '../../purchaseAbility/constants/purchaseBid'
import useSelectOptions from './services/hooks/useSelectOptions'

const { Text } = Typography

const Search: React.FC = () => {
  const ref = useRef({} as ActionType)
  const selectData = useSelectOptions()

  const columns: RecordColumns<any>[] = [
    {
      title: '竞价单号/摘要',
      key: 'biddingNo',
      dataIndex: 'biddingNo',
      searchField: [
        {
          main: true,
          type: 'Input',
          name: 'biddingNo',
          title: '竞价单号',
        },
        {
          type: 'Input',
          name: 'details',
          title: '竞价单摘要',
        },
      ],
      fixed: 'left',
      render: (text: any, record: any) => (
        <Space direction="vertical" style={{ width: 300 }}>
          <EyeAuthButton url={`/purchaseManage/purchaseBid/search/detail?id=${record.id}&number=${record.biddingNo}`}>
            {text}
          </EyeAuthButton>
          <Text type="secondary">{record.details}</Text>
        </Space>
      ),
    },
    {
      title: '采购会员',
      key: 'createMemberName',
      dataIndex: 'createMemberName',
      searchField: {
        type: 'Input',
        name: 'memberName',
      },
    },
    {
      title: '竞价开始/结束时间',
      key: 'biddingStartTime',
      dataIndex: 'biddingStartTime',
      render: (text: any, record: any) => (
        <>
          <div>
            <PlayCircleOutlined />
            &nbsp;{formatTimeString(record.biddingStartTime)}
          </div>
          <div>
            <PoweroffOutlined />
            &nbsp;{formatTimeString(record.biddingEndTime)}
          </div>
        </>
      ),
    },
    {
      title: '单据时间',
      key: 'createTime',
      dataIndex: 'createTime',
      render: (text: any) => formatTimeString(text),
      searchField: {
        type: 'DateSelect',
        name: 'sourceDate',
        title: '单据时间（全部）',
      },
    },
    {
      title: '外部状态',
      key: 'externalState',
      dataIndex: 'externalState',
      searchField: 'Select',
      fixed: 'right',
      render: (text: any, record: any) => (
        <StatusTag type={BID_EXTERNALSTATE_COLOR(text)} title={record.externalStateName} />
      ),
    },
  ]

  const fetchData = async (params: any) => {
    const { sourceDate, ...resetParams } = params
    const payload = { ...resetParams }
    if (sourceDate) {
      const [startDate, endDate] = sourceDate.split(',')
      payload.startTime = startDate
      payload.endTime = endDate
    }
    const { data, code } = await getPurchaseBiddingPlatformList(payload)
    if (code !== 1000) {
      return { data: [], totalCount: 0 }
    }
    return data
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
export default Search
