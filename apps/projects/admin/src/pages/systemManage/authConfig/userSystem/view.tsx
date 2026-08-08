import React, { useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { Button, Popconfirm } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { EyeAuthButton, AuthButton, StatusAuthButton, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { STATUS_ENUM } from '@/constants'
import { getMemberManageUserPage, postMemberManageUserDelete, postMemberManageUserUpdatestatus } from '@apps/apis'

// 模拟请求
const fetchData = async (params) => {
  const { data } = await getMemberManageUserPage(params)
  return data
}

const UserSystem: React.FC = () => {
  const ref = useRef({} as ActionType)

  const deleteItem = (record) => {
    // 删除该项
    postMemberManageUserDelete({
      userId: record.userId,
    }).then(() => {
      ref.current.reload()
    })
  }

  const updateItem = (record) => {
    history.push(`/systemManage/authConfig/userSystem/edit?id=${record.userId}&preview=0`)
  }

  const handleStatus = (record) => {
    postMemberManageUserUpdatestatus({
      userId: record.userId,
      status: record.status === 1 ? 0 : 1,
    }).then((res) => {
      ref.current.reload()
    })
  }
  const columns: RecordColumns<any>[] = [
    {
      title: '账号',
      dataIndex: 'account',
      key: 'account',
      className: 'commonPickColor',
      fixed: 'left',
      searchField: {
        main: true,
      },
      render: (text, record) => (
        <EyeAuthButton url={`/systemManage/authConfig/userSystem/detail?id=${record.userId}&preview=1`}>
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: '用户姓名',
      dataIndex: 'name',
      key: 'name',
      searchField: 'Input',
    },
    {
      title: '所属机构',
      dataIndex: 'orgName',
      key: 'orgName',
    },
    {
      title: '绑定手机号码',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '所属角色',
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title: '最后登录时间',
      dataIndex: 'lastLoginTime',
      key: 'lastLoginTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      searchField: {
        type: 'Select',
        valueEnum: STATUS_ENUM,
      },
      fixed: 'right',
      render: (text: any, record: any) => (
        <StatusAuthButton customStyle={{ paddingLeft: 0 }} handleConfirm={() => handleStatus(record)} record={record} />
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
              <Button type="link" style={{ paddingLeft: 0 }} onClick={() => updateItem(record)}>
                修改
              </Button>
            </AuthButton>
            <AuthButton type="custom" code="delete">
              <Popconfirm title="确定要执行这个操作?" onConfirm={() => deleteItem(record)} okText="是" cancelText="否">
                <Button type="link">删除</Button>
              </Popconfirm>
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
              history.push('/systemManage/authConfig/userSystem/add')
            },
          },
        ]}
      />
    </PageHeaderWrapper>
  )
}

export default UserSystem
