/** 待上线平台营销活动 */
import React, { useRef } from 'react'
import { Button, Popconfirm } from 'antd'
import StatusTag from '@/components/StatusTag'
import { EyeAuthButton, AuthButton, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { formatTimeString } from '@/utils'
import { getMarketingPlatformActivityPageTobeOnline, postMarketingPlatformActivityOnline } from '@apps/apis'
import useSelectOptions from './services/hooks/useSelectOptions'

const WaitLineMarketing: React.FC = () => {
  const ref = useRef({} as ActionType)
  const selectData = useSelectOptions()
  /** 批量审核 */
  const fetchSubmitBatch = async (id?: number) => {
    let res: any = null
    if (id) {
      res = await postMarketingPlatformActivityOnline({ id: Number(id) })
    }
    if (res.code === 1000) {
      ref.current.reload()
    }
  }
  const columns: RecordColumns<any>[] = [
    {
      title: '活动ID',
      key: 'id',
      dataIndex: 'id',
      fixed: 'left',
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
        <EyeAuthButton url={`/marketingManage/marketing/waitLineMarketing/detail?id=${record.id}`}>
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: '活动类型',
      key: 'activityType',
      dataIndex: 'activityType',
      searchField: 'Select',
      render: (_text, record) => <>{record.activityTypeName}</>,
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
      title: '报名开始时间',
      key: 'signUpStartTime',
      dataIndex: 'signUpStartTime',
      render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: '报名结束时间',
      key: 'signUpEndTime',
      dataIndex: 'signUpEndTime',
      render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: '外部状态',
      key: 'outerStatus',
      dataIndex: 'outerStatus',
      render: (text, record) => <StatusTag type="danger" title={record.outerStatusName} />,
    },
    {
      title: '内部状态',
      key: 'innerStatus',
      dataIndex: 'innerStatus',
      render: (text, record) => <StatusTag type="danger" title={record.innerStatusName} />,
    },
    {
      title: '操作',
      key: 'state',
      dataIndex: 'state',
      fixed: 'right',
      render: (text, record) =>
        record.online && (
          <AuthButton type="custom" code="submit">
            <Popconfirm
              title="确定要上线此活动吗？"
              okText="是"
              cancelText="否"
              onConfirm={() => fetchSubmitBatch(record.id)}
            >
              <Button type="link">上线活动</Button>
            </Popconfirm>
          </AuthButton>
        ),
    },
  ]

  const fetchData = async (params: any) => {
    return new Promise((resolve) => {
      const payload = { ...params }
      getMarketingPlatformActivityPageTobeOnline({ ...payload }).then((res) => {
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
export default WaitLineMarketing
