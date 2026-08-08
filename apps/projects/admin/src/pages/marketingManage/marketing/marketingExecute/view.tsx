import React, { useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { Button, Tag, Typography } from 'antd'
import { formatTimeString } from '@/utils'
import { DetailAuthButton, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { getMarketingPlatformActivityExecutePage } from '@apps/apis'
import { OuterStatusColor } from '../../common/tagColor'
import useSelectOptions from './services/hooks/useSelectOptions'

const Search: React.FC = () => {
  const ref = useRef({} as ActionType)
  const selectData = useSelectOptions()

  const columns: RecordColumns<any>[] = [
    {
      title: 'ID',
      key: 'id',
      fixed: 'left',
      width: 60,
      searchField: {
        type: 'InputNumber',
      },
      render: (text) => (
        <DetailAuthButton>
          <Button
            type="link"
            target="_blank"
            style={{ padding: 0 }}
            onClick={() => history.push(`/marketingManage/marketing/marketingSearch/detail?id=${text}`)}
          >
            {text}
          </Button>
        </DetailAuthButton>
      ),
    },
    {
      title: '活动名称',
      key: 'activityName',
      searchField: {
        main: true,
      },
    },
    {
      title: '活动类型',
      key: 'activityTypeName',
      searchField: {
        name: 'activityType',
        type: 'Select',
      },
    },
    {
      title: '活动开始时间',
      key: 'startTime',
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
      render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: '参与客户数',
      key: 'customerCount',
    },
    {
      title: '已执行订单单数',
      key: 'orderCount',
    },
    {
      title: '已执行订单金额',
      key: 'orderAmount',
      render: (text) => <Typography.Text>￥{Number(text).toFixed(2)}</Typography.Text>,
    },
    {
      title: '外部状态',
      key: 'statusName',
      searchField: {
        name: 'outerStatus',
        type: 'Select',
      },
      fixed: 'right',
      render: (text, _) => <Tag color={OuterStatusColor(_.status)}>{text}</Tag>,
    },
    {
      title: '操作',
      key: 'opertion',
      fixed: 'right',
      render: (_text, _) => (
        <DetailAuthButton>
          <Button
            type="link"
            onClick={() => history.push(`/marketingManage/marketing/marketingExecute/detail?id=${_.id}`)}
          >
            查看
          </Button>
        </DetailAuthButton>
      ),
    },
  ]

  const fetchData = (params: any) => {
    return new Promise((resolve) => {
      const payload = { ...params }
      getMarketingPlatformActivityExecutePage({ ...payload }).then((res) => {
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
export default Search
