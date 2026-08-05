import React from 'react'
import { StandardFormTable } from '@apps/components'
import { history } from '@linkseeks/router-manager'
import { getMemberMemberPointsPage } from '@apps/apis'
import useSelectOptions from './hooks/useSelectOptions'

const MemberPoints: React.FC = () => {
  const selectData = useSelectOptions()

  const columns = StandardFormTable.createColumns([
    {
      title: '会员ID',
      key: 'subMemberId',
      width: 80,
    },
    {
      title: '会员名称',
      key: 'subMemberName',
      searchField: 'Input',
    },
    {
      title: '会员登录账号',
      key: 'subAccount',
    },
    {
      title: '会员角色',
      key: 'subRoleName',
      searchField: {
        type: 'Select',
        name: 'subRoleId',
      },
    },
    {
      title: '积分值',
      key: 'points',
    },
    {
      title: '备注',
      key: 'remark',
      ellipsis: true,
    },
    {
      title: '操作时间',
      key: 'createTime',
    },
    {
      title: '操作账号',
      key: 'account',
    },
  ])

  return (
    <StandardFormTable
      columns={columns}
      request={getMemberMemberPointsPage}
      searchButtons={[
        {
          children: '添加会员积分',
          key: 'add',
          type: 'primary',
          onClick: () => {
            history.push('/memberManage/memberPoints/add')
          },
        },
      ]}
      searchSelectMaps={selectData}
    />
  )
}

export default MemberPoints
