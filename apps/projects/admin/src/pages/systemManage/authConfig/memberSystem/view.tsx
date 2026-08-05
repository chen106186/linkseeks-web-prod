import React, { useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { Button, Popconfirm } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { StatusAuthButton, EyeAuthButton, AuthButton, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { STATUS_ENUM } from '@/constants'
import { getMemberManageRolePage, postMemberManageRoleDelete, postMemberManageRoleUpdatestatus } from '@apps/apis'

const fetchData = async (params) => {
  const { data } = await getMemberManageRolePage(params)
  return data
}

const MemberSystem: React.FC = () => {
  const ref = useRef({} as ActionType)

  const deleteItem = async (record) => {
    // 删除该项
    await postMemberManageRoleDelete({
      roleId: record.id,
    })
    ref.current.reload()
  }

  const updateItem = (record) => {
    history.push(`/systemManage/authConfig/memberSystem/detail?id=${record.id}&preview=0`)
  }

  const handleStatus = async (record) => {
    await postMemberManageRoleUpdatestatus({
      id: record.id,
      status: record.status === 1 ? 0 : 1,
    })

    ref.current.reload()
  }

  const columns: RecordColumns<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
      width: 60,
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
      className: 'commonPickColor',
      searchField: {
        main: true,
      },
      render: (text, record) => (
        <EyeAuthButton url={`/systemManage/authConfig/memberSystem/detail?id=${record.id}&preview=1`}>
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: '描述',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      searchField: {
        type: 'Select',
        valueEnum: STATUS_ENUM,
      },
      render: (text: any, record: any) => (
        <StatusAuthButton record={record} handleConfirm={() => handleStatus(record)} />
      ),
    },
    {
      title: '操作',
      key: 'option',
      fixed: 'right',
      render: (text: any, record: any) => {
        return (
          <>
            <AuthButton type="custom" code="delete">
              <Popconfirm title="确定要执行这个操作?" onConfirm={() => deleteItem(record)} okText="是" cancelText="否">
                <Button type="link">删除</Button>
              </Popconfirm>
            </AuthButton>
            <AuthButton type="custom" code="edit">
              <Button type="link" onClick={() => updateItem(record)}>
                修改
              </Button>
            </AuthButton>
          </>
        )
      },
    },
  ]

  return (
    <PageHeaderWrapper>
      <StandardFormTable
        columns={columns}
        autoScrollX
        request={(params) => fetchData(params)}
        rowKey="id"
        actionRef={ref}
        searchButtons={[
          {
            key: 'add',
            type: 'primary',
            icon: <PlusOutlined />,
            children: '新建',
            onClick() {
              history.push('/systemManage/authConfig/memberSystem/detail')
            },
          },
        ]}
      />
    </PageHeaderWrapper>
  )
}

export default MemberSystem
