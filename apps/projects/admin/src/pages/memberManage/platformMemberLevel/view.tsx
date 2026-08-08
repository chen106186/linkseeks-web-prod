/**
 * @Description 平台会员等级管理 - 列表
 */
import React, { useState, useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { Button, Popconfirm, Modal, message } from 'antd'
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import type { GetMemberManageLevelPageResponseDetail } from '@apps/apis'
import {
  getMemberManageLevelPage,
  postMemberManageLevelDelete,
  postMemberManageLevelRebuild,
  postMemberManageLevelStatus,
  getMemberSelectGetMemberRoleList,
} from '@apps/apis'
import { EyeAuthButton, AuthButton, StatusAuthButton, StandardFormTable, PageHeaderWrapper } from '@apps/components'
import type { RecordColumns } from '@apps/components/src/web/StandardFormTable/types'
import type { FetchParamsType, NormalTableRefHandleType } from '@/components/PolymericTable'
import { useRequestApi } from '@linkseeks/hooks'

const { confirm } = Modal

type GetMemberLevelListRequestParams = FetchParamsType & {
  levelTag: string
  roleName: string
}

type GetMemberLevelListRequestResponse = GetMemberManageLevelPageResponseDetail & {}

const PlatformMemberLevelIndexIndex: React.FC<{}> = (props) => {
  const [statusLoadingKey, setStatusLoadingKey] = useState(0)
  const [deleteLoadingKey, setDeleteLoadingKey] = useState(0)

  const polymericRef = useRef<NormalTableRefHandleType | null>(null)
  const { data } = useRequestApi(getMemberSelectGetMemberRoleList)

  const handleJumpFormPage = (record?: GetMemberLevelListRequestResponse) => {
    history.push(
      !record ? '/memberManage/platformMemberLevel/add' : `/memberManage/platformMemberLevel/edit?id=${record.levelId}`,
    )
  }

  const handleJumpSetMemberLevelRight = (record: GetMemberLevelListRequestResponse) => {
    history.push(`/memberManage/platformMemberLevel/setMemberLevelRight?id=${record.levelId}`)
  }

  const handleChangeMemberLevelStatus = (record: GetMemberLevelListRequestResponse) => {
    if (record.levelId === statusLoadingKey) {
      return
    }
    const msg = message.loading({
      content: '正在更改，请稍候...',
      duration: 0,
    })
    setStatusLoadingKey(record.levelId)
    postMemberManageLevelStatus({
      status: record.status === 1 ? 0 : 1,
      levelId: record.levelId,
    })
      .then((res) => {
        if (res.code === 1000) {
          polymericRef.current?.reload()
        }
      })
      .finally(() => {
        msg()
        setStatusLoadingKey(0)
      })
  }

  const handleDeleteMemberLevel = (record: GetMemberLevelListRequestResponse) => {
    if (record.levelId === deleteLoadingKey) {
      return
    }
    const msg = message.loading({
      content: '正在删除，请稍候...',
      duration: 0,
    })
    setDeleteLoadingKey(record.levelId)
    postMemberManageLevelDelete({
      levelId: record.levelId,
    })
      .then((res) => {
        if (res.code === 1000) {
          polymericRef.current?.reload()
        }
      })
      .finally(() => {
        msg()
        setDeleteLoadingKey(0)
      })
  }

  const defaultColumns: RecordColumns<GetMemberLevelListRequestResponse>[] = [
    {
      title: '会员等级ID',
      key: 'levelId',
      fixed: 'left',
    },
    {
      title: '会员等级',
      key: 'level',
      fixed: 'left',
    },
    {
      title: '会员等级标签',
      key: 'levelTag',
      searchField: {
        main: true,
      },
      render: (text: any, record) => (
        <>
          <EyeAuthButton url={`/memberManage/platformMemberLevel/detail?id=${record.levelId}`}>{text}</EyeAuthButton>
        </>
      ),
    },
    {
      title: '会员等级类型',
      key: 'levelTypeName',
    },
    {
      title: '升级分值标签',
      key: 'scoreTag',
    },
    {
      title: '会员角色名称',
      key: 'roleName',
      searchField: {
        type: 'SearchSelect',
        name: 'roleName',
        valueEnum: data?.map((item) => ({ ...item, value: item.label })),
      },
    },
    {
      title: '角色类型',
      key: 'roleTypeName',
    },
    {
      title: '会员类型',
      key: 'memberTypeName',
    },
    {
      title: '升级阀值',
      key: 'point',
    },
    {
      title: '状态',
      key: 'statusName',
      render: (text, record) => (
        <StatusAuthButton handleConfirm={() => handleChangeMemberLevelStatus(record)} record={record} />
      ),
    },
    {
      title: '操作',
      key: 'actions',
      align: 'center',
      fixed: 'right',
      width: 200,
      render: (text: any, record) => (
        <>
          <AuthButton type="custom" code="edit">
            <Button type="link" onClick={() => handleJumpFormPage(record)} disabled={record.status === 1}>
              编辑
            </Button>
          </AuthButton>
          <AuthButton type="custom" code="delete">
            <Popconfirm
              title="是否确认删除该会员等级？"
              disabled={record.status === 1}
              onConfirm={() => handleDeleteMemberLevel(record)}
              okText="确认"
              cancelText="取消"
            >
              <Button type="link" loading={record.levelId === deleteLoadingKey} disabled={record.status === 1}>
                删除
              </Button>
            </Popconfirm>
          </AuthButton>
          <AuthButton type="custom" code="setMemberLevelRight">
            <Button type="link" onClick={() => handleJumpSetMemberLevelRight(record)}>
              设置权益与升级阀值
            </Button>
          </AuthButton>
        </>
      ),
    },
  ]

  const fetchData = async (params) => {
    const res = await getMemberManageLevelPage(params)
    if (res.code === 1000) {
      return res.data
    }
    return { data: [], totalCount: 0 }
  }

  const handleInitial = () => {
    confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: '点击“确定”，会将所有平台会员的会员等级初始化为初始等级，并享有该等级的所有权益！',
      cancelText: '取消',
      okText: '确定',
      onOk() {
        return postMemberManageLevelRebuild()
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  return (
    <PageHeaderWrapper>
      <StandardFormTable
        columns={defaultColumns}
        autoScrollX
        actionRef={polymericRef}
        request={(params) => fetchData(params)}
        searchButtons={[
          {
            children: '新增',
            onClick() {
              handleJumpFormPage()
            },
            icon: <PlusOutlined />,
            key: 'add',
            type: 'primary',
          },
          {
            children: '初始化会员等级与权益',
            onClick() {
              handleInitial()
            },
            key: 'init',
            type: 'primary',
          },
        ]}
        rowKey="validateId"
      />
    </PageHeaderWrapper>
  )
}

export default PlatformMemberLevelIndexIndex
