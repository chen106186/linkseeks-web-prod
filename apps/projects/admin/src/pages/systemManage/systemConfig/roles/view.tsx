import React, { useState, useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { useNavigate } from '@linkseeks/router-core'
import { Button } from 'antd'
import { getMemberMemberRoleConfigGetMemberRolePage, postMemberMemberRoleConfigStatus } from '@apps/apis'
import { EyeAuthButton, AuthButton, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { StatusAuthButton } from '@apps/components'
import MemberFlow from './memberFlow'

const setInformation = (id) => {
  history.push(`/systemManage/systemConfig/roles/setMemberInfo?id=${id}`)
}

const fetchData = async (params: any) => {
  const data = await getMemberMemberRoleConfigGetMemberRolePage(params)
  return data.data
}

const MemberRoleManage: React.FC = () => {
  const ref = useRef({} as ActionType)
  const [flowVisible, setFlowVisible] = useState(false)
  const navigation = useNavigate()

  const columns: RecordColumns<any>[] = [
    {
      title: '会员角色ID',
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
    },
    {
      title: '会员角色',
      dataIndex: 'memberRoleName',
      key: 'memberRoleName',
      className: 'commonPickColor',
      searchField: {
        type: 'Input',
        name: 'name',
      },
      fixed: 'left',
      render: (text: any, record: any) => (
        <EyeAuthButton handleClick={editMember.bind(null, record, true)} type="button">
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: '角色类型',
      dataIndex: 'roleTypeName',
      key: 'roleTypeName',
    },
    {
      title: '会员类型',
      dataIndex: 'memberTypeName',
      key: 'memberTypeName',
    },
    {
      title: '角色标签',
      dataIndex: 'roleTagName',
      key: 'roleTagName',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number, record: any) => (
        <StatusAuthButton
          title={`确认要把当前会员角色从${status === 1 ? '”有效”' : '”无效”'}状态改为${
            status === 1 ? '”无效”' : '”有效”'
          }状态`}
          handleCancel={cancel}
          handleConfirm={() => handleModify(status, record)}
          record={record}
        />
      ),
    },
    {
      title: '操作',
      key: 'option',
      fixed: 'right',
      render: (text: any, record: any) => {
        return (
          <>
            <AuthButton type="custom" code="edit">
              <Button type="link" onClick={editMember.bind(null, record, false)}>
                修改
              </Button>
            </AuthButton>
            <AuthButton type="custom" code="setMemberInfo">
              <Button type="link" onClick={() => setInformation(record.id)}>
                关联会员资料
              </Button>
            </AuthButton>
            <AuthButton type="custom" code="setFlow">
              <Button type="link" onClick={handleOpenFlow} onMouseEnter={() => getMemberInfo(record)}>
                注册流程配置
              </Button>
            </AuthButton>
            <AuthButton type="custom" code="setMemberAuth">
              <Button
                type="link"
                onClick={() => {
                  history.push(`/systemManage/systemConfig/roles/setMemberAuth?id=${record?.id}`)
                }}
                onMouseEnter={() => getMemberInfo(record)}
              >
                设置会员权限
              </Button>
            </AuthButton>
          </>
        )
      },
    },
  ]

  const editMember = (memberInfo: any, preview?: boolean) => {
    let url = `/systemManage/systemConfig/roles/edit`
    if (preview) {
      url = `/systemManage/systemConfig/roles/detail`
    }
    navigation(`${url}?preview=${preview}&id=custom`, {
      state: memberInfo,
    })
  }

  const cancel = () => {
    console.log('cancel')
  }

  const handleModify = async (text: number, record: any) => {
    await postMemberMemberRoleConfigStatus({
      id: record.id,
      status: text === 0 ? 1 : 0,
    })
    ref.current.reload()
    console.log('执行状态修改', record)
  }

  const handleOpenFlow = () => {
    setFlowVisible(true)
  }
  const getMemberInfo = (memberInfo) => {
    ref.current.memberInfo = memberInfo
  }
  return (
    <PageHeaderWrapper>
      <StandardFormTable actionRef={ref} columns={columns} rowKey="id" request={fetchData} autoScrollX />
      <MemberFlow memberInfo={ref?.current.memberInfo} open={flowVisible} onCancel={() => setFlowVisible(false)} />
    </PageHeaderWrapper>
  )
}

export default MemberRoleManage
