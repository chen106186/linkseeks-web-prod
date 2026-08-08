/** 待审核报名 */
import React, { useRef } from 'react'
import { Button } from 'antd'
import { history } from '@linkseeks/router-manager'
import StatusTag from '@/components/StatusTag'
import { EditAuthButton, EyeAuthButton, DetailAuthButton, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { formatTimeString } from '@/utils'
import { getMarketingPlatformActivityPageTobeSignUp } from '@apps/apis'
import useSelectOptions from './services/hooks/useSelectOptions'

const WaitAuditApply: React.FC = () => {
  const ref = useRef({} as ActionType)
  const selectData = useSelectOptions()

  const columns: RecordColumns<any>[] = [
    {
      title: '活动ID',
      key: 'id',
      dataIndex: 'id',
      fixed: 'left',
      width: 80,
      searchField: {
        type: 'Input',
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
        <EyeAuthButton
          url={`/marketingManage/marketing/waitAuditApply/detail?id=${record.id}&signUpId=${record.signUpId}`}
        >
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
      title: '报名时间',
      key: 'signUpStartTime',
      dataIndex: 'signUpStartTime',
      render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: '报名会员',
      key: 'memberName',
      dataIndex: 'memberName',
      searchField: 'Input',
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
        record.exam && (
          <EditAuthButton>
            <Button
              type="link"
              onClick={() =>
                history.push(
                  `/marketingManage/marketing/waitAuditApply/edit?id=${record.id}&signUpId=${record.signUpId}`,
                )
              }
            >
              审核报名
            </Button>
          </EditAuthButton>
        ),
    },
  ]

  const fetchData = async (params: any) => {
    return new Promise((resolve) => {
      const payload = { ...params }
      getMarketingPlatformActivityPageTobeSignUp({ ...payload }).then((res) => {
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
export default WaitAuditApply
