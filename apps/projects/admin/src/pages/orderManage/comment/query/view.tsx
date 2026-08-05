import React, { useRef } from 'react'
import { Rate } from 'antd'
import { EyeAuthButton, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import useSelectOptions from './services/hooks/useSelectOptions'
import { getMemberPlatformCommentTradePage } from '@apps/apis'

const CommentQuery = () => {
  const ref = useRef({} as ActionType)
  const selectData = useSelectOptions()

  const defaultColumns: RecordColumns<any>[] = [
    {
      title: 'ID',
      key: 'memberId',
      fixed: 'left',
      width: 60,
    },
    {
      title: '会员名称',
      key: 'memberName',
      searchField: {
        main: true,
      },
      render: (text, record) => (
        <EyeAuthButton url={`/orderManage/comment/query/detail?memberId=${record.memberId}&roleId=${record.roleId}`}>
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: '会员类型',
      dataIndex: 'memberTypeName',
      key: 'memberType',
      searchField: 'Select',
    },
    {
      title: '会员角色',
      dataIndex: 'roleName',
      key: 'roleId',
      searchField: 'Select',
    },
    {
      title: '会员等级',
      dataIndex: 'levelTag',
      key: 'level',
      searchField: 'Select',
    },
    {
      title: '交易满意度',
      key: 'avgStar',
      render: (text) => <Rate value={text} disabled />,
      searchField: {
        type: 'Select',
        valueEnum: [
          {
            label: '一星',
            value: 1,
          },
          {
            label: '二星',
            value: 2,
          },
          {
            label: '三星',
            value: 3,
          },
          {
            label: '四星',
            value: 4,
          },
          {
            label: '五星',
            value: 5,
          },
        ],
      },
    },
    {
      title: '收到评价总数',
      key: 'receiveCountTotal',
    },
    {
      title: '最近7天评价数',
      key: 'receiveCount7',
    },
    {
      title: '最近180天评价数',
      key: 'receiveCount180',
    },
  ]

  const fetchData = (params: any) => {
    return new Promise((resolve, reject) => {
      getMemberPlatformCommentTradePage(params)
        .then((res) => {
          if (res.code === 1000) {
            resolve(res.data)
          }
          reject()
        })
        .catch(() => {
          reject()
        })
    })
  }

  return (
    <PageHeaderWrapper>
      <StandardFormTable
        columns={defaultColumns}
        autoScrollX
        request={(params) => fetchData(params)}
        rowKey="memberId"
        actionRef={ref}
        searchSelectMaps={selectData}
      />
    </PageHeaderWrapper>
  )
}

export default CommentQuery
