/**
 * @Description 会员角色规则配置 - 列表
 */
import React, { useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { Button, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { getMemberPlatformRoleRuleMemberRulePage, getManageInitConfigEnableMultiTenancy } from '@apps/apis'
import { EyeAuthButton, EditAuthButton, StandardFormTable, PageHeaderWrapper } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'

type GetMemberRoleRuleListRequestResponse = {
  memberId: number
  memberName: string
}

const MemberRoleRuleConfigIndex: React.FC = () => {
  const ref = useRef({} as ActionType)

  const handleJumpFormPage = async (record?: GetMemberRoleRuleListRequestResponse) => {
    const { data } = await getManageInitConfigEnableMultiTenancy()
    if (data) {
      message.warning('当前部署模式，无须对会员角色进行配置！')
      return
    }
    history.push(
      !record
        ? '/systemManage/platformRule/memberRoleRuleConfig/add'
        : `/systemManage/platformRule/memberRoleRuleConfig/edit?id=${record.memberId}`,
    )
  }

  const columns: RecordColumns<any>[] = [
    {
      title: 'ID',
      key: 'roleRuleId',
    },
    {
      title: '会员名称',
      key: 'memberName',
      searchField: 'Input',
      render: (text: any, record) => (
        <>
          <EyeAuthButton url={`/systemManage/platformRule/memberRoleRuleConfig/detail?id=${record.memberId}`}>
            {text}
          </EyeAuthButton>
        </>
      ),
    },
    {
      title: '操作',
      key: 'option',
      render: (text: any, record: any) => (
        <EditAuthButton>
          <Button type="link" onClick={() => handleJumpFormPage(record)}>
            编辑
          </Button>
        </EditAuthButton>
      ),
    },
  ]

  const fetchMemberRoleRuleList = async (params) => {
    const res = await getMemberPlatformRoleRuleMemberRulePage({
      ...params,
      current: `${params.current}`,
      pageSize: `${params.pageSize}`,
    })
    if (res.code === 1000) {
      return res.data
    }
    return { data: [], totalCount: 0 }
  }

  return (
    <PageHeaderWrapper>
      <StandardFormTable
        actionRef={ref}
        columns={columns}
        rowKey="memberId"
        request={fetchMemberRoleRuleList}
        autoScrollX
        searchButtons={[
          {
            key: 'add',
            type: 'primary',
            icon: <PlusOutlined />,
            children: '新增',
            onClick() {
              handleJumpFormPage()
            },
          },
        ]}
      />
    </PageHeaderWrapper>
  )
}

export default MemberRoleRuleConfigIndex
