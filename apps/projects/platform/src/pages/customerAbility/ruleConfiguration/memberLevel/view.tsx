/**
 * @Description 会员等级管理 - 列表
 */
import React, { useState, useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Card, Button, Space, Popconfirm, Modal, message } from 'antd'
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { ColumnType } from 'antd/lib/table/interface'
import { PageHeaderWrapper } from '@apps/components'
import { createFormActions } from '@apps/formily'
import {
  getMemberCustomerAbilityLevelPage,
  GetMemberCustomerAbilityLevelPageResponseDetail,
  postMemberCustomerAbilityLevelDelete,
  postMemberCustomerAbilityLevelRebuild,
  postMemberCustomerAbilityLevelStatus,
} from '@apps/apis'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { EyeAuthButton } from '@apps/components'
import PolymericTable, { FetchParamsType, NormalTableRefHandleType } from '@/components/PolymericTable'
import { StatusAuthButton } from '@apps/components'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { querySchema } from './querySchema'

const { confirm } = Modal

const queryFormActions = createFormActions()

type GetMemberLevelListRequestParams = FetchParamsType & {
  levelTag: string
  roleName: string
}

type GetMemberLevelListRequestResponse = GetMemberCustomerAbilityLevelPageResponseDetail & {}

const PlatformMemberLevelIndexIndex: React.FC<{}> = (props) => {
  const [statusLoadingKey, setStatusLoadingKey] = useState(0)
  const [deleteLoadingKey, setDeleteLoadingKey] = useState(0)
  const { pathname } = useLocation()
  const intl = useIntl()

  const polymericRef = useRef<NormalTableRefHandleType | null>(null)

  const handleJumpFormPage = (record?: GetMemberLevelListRequestResponse) => {
    history.push(
      !record
        ? '/customerAbility/ruleConfiguration/memberLevel/add'
        : `/customerAbility/ruleConfiguration/memberLevel/edit?id=${record.levelId}`,
    )
  }

  const handleJumpSetMemberLevelRight = (record: GetMemberLevelListRequestResponse) => {
    history.push(`/customerAbility/ruleConfiguration/memberLevel/setMemberLevelRight?id=${record.levelId}`)
  }

  const handleChangeMemberLevelStatus = (record: GetMemberLevelListRequestResponse) => {
    if (record.levelId === statusLoadingKey) {
      return
    }
    const msg = message.loading({
      content: intl.formatMessage({ id: 'member.memberLevel.status.changing', defaultMessage: '正在更改，请稍候...' }),
      duration: 0,
    })
    setStatusLoadingKey(record.levelId)
    postMemberCustomerAbilityLevelStatus({
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
      content: intl.formatMessage({ id: 'member.memberLevel.delete.deleting', defaultMessage: '正在删除，请稍候...' }),
      duration: 0,
    })
    setDeleteLoadingKey(record.levelId)
    postMemberCustomerAbilityLevelDelete({
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

  const columns: ColumnType<GetMemberLevelListRequestResponse>[] = [
    {
      title: intl.formatMessage({ id: 'member.memberLevel.levelId', defaultMessage: '会员等级ID' }),
      dataIndex: 'levelId',
      width: '10%',
    },
    {
      title: intl.formatMessage({ id: 'member.memberLevel.level', defaultMessage: '会员等级' }),
      dataIndex: 'level',
      width: '10%',
    },
    {
      title: intl.formatMessage({ id: 'member.memberLevel.levelTag', defaultMessage: '会员等级标签' }),
      dataIndex: 'levelTag',
      render: (text: any, record) => (
        <>
          <EyeAuthButton
            url={`/customerAbility/ruleConfiguration/memberLevel/detail?id=${record.levelId}`}
            type={authUrl(pathname, 'detail') ? 'link' : 'button'}
          >
            {text}
          </EyeAuthButton>
        </>
      ),
      width: '10%',
    },
    {
      title: intl.formatMessage({ id: 'member.memberLevel.levelTypeName', defaultMessage: '会员等级类型' }),
      dataIndex: 'levelTypeName',
      width: '10%',
    },
    {
      title: intl.formatMessage({ id: 'member.memberLevel.scoreTag', defaultMessage: '升级分值标签' }),
      dataIndex: 'scoreTag',
      width: '10%',
    },
    {
      title: intl.formatMessage({ id: 'member.memberLevel.roleName', defaultMessage: '会员角色名称' }),
      dataIndex: 'roleName',
      width: '10%',
    },
    {
      title: intl.formatMessage({ id: 'member.memberLevel.roleTypeName', defaultMessage: '角色类型' }),
      dataIndex: 'roleTypeName',
      width: '10%',
    },
    {
      title: intl.formatMessage({ id: 'member.memberLevel.memberTypeName', defaultMessage: '会员类型' }),
      dataIndex: 'memberTypeName',
      width: '10%',
    },
    {
      title: intl.formatMessage({ id: 'member.memberLevel.point', defaultMessage: '升级阀值' }),
      dataIndex: 'point',
      width: '10%',
    },
    {
      title: intl.formatMessage({ id: 'member.memberLevel.status', defaultMessage: '状态' }),
      dataIndex: 'statusName',
      width: '15%',
      render: (text, record) => (
        <StatusAuthButton handleConfirm={() => handleChangeMemberLevelStatus(record)} record={record} />
      ),
    },
    {
      title: intl.formatMessage({ id: 'common.table.action', defaultMessage: '操作' }),
      dataIndex: 'actions',
      align: 'center',
      fixed: 'right',
      width: 200,
      render: (text: any, record) => (
        <>
          <EditAuthButton>
            <Button type="link" onClick={() => handleJumpFormPage(record)} disabled={record.status === 1}>
              {intl.formatMessage({ id: 'member.memberLevel.modify', defaultMessage: '编辑' })}
            </Button>
          </EditAuthButton>
          <AuthButton type="custom" code="delete">
            <Popconfirm
              title={intl.formatMessage({
                id: 'member.memberLevel.delete.confirm.title',
                defaultMessage: '是否确认删除该会员等级？',
              })}
              onConfirm={() => handleDeleteMemberLevel(record)}
              okText={intl.formatMessage({ id: 'common.button.yes', defaultMessage: '确认' })}
              cancelText={intl.formatMessage({ id: 'common.button.no', defaultMessage: '取消' })}
            >
              <Button type="link" loading={record.levelId === deleteLoadingKey}>
                {intl.formatMessage({ id: 'member.memberLevel.delete', defaultMessage: '删除' })}
              </Button>
            </Popconfirm>
          </AuthButton>
          <AuthButton type="custom" code="setMemberLevelRight">
            <Button type="link" onClick={() => handleJumpSetMemberLevelRight(record)}>
              {intl.formatMessage({ id: 'member.memberLevel.setRights', defaultMessage: '设置权益与升级阀值' })}
            </Button>
          </AuthButton>
        </>
      ),
    },
  ]

  const fetchMemberRoleRuleList = async (params: GetMemberLevelListRequestParams) => {
    const res = await getMemberCustomerAbilityLevelPage({
      ...params,
      current: `${params.current}`,
      pageSize: `${params.pageSize}`,
    })
    if (res.code === 1000) {
      return res.data
    }
    return { data: [], totalCount: 0 }
  }

  const handleInitial = () => {
    confirm({
      title: intl.formatMessage({ id: 'member.memberLevel.rebuild.confirm.title', defaultMessage: '提示' }),
      icon: <ExclamationCircleOutlined />,
      content: intl.formatMessage({
        id: 'member.memberLevel.rebuild.confirm.content',
        defaultMessage: '点击“确定”，会将所有平台会员的会员等级初始化为初始等级，并享有该等级的所有权益！',
      }),
      cancelText: intl.formatMessage({ id: 'common.button.cancel', defaultMessage: '取消' }),
      okText: intl.formatMessage({ id: 'common.button.confirm', defaultMessage: '确定' }),
      onOk() {
        return postMemberCustomerAbilityLevelRebuild()
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  const RoleRuleConfigCtl = () => (
    <Space>
      <AddAuthButton>
        <Button type="primary" onClick={() => handleJumpFormPage()} icon={<PlusOutlined />}>
          {intl.formatMessage({ id: 'member.memberLevel.add', defaultMessage: '新增' })}
        </Button>
      </AddAuthButton>
      <AuthButton type="custom" code="rebuild">
        <Button type="primary" onClick={() => handleInitial()}>
          {intl.formatMessage({ id: 'member.memberLevel.rebuild', defaultMessage: '初始化会员等级与权益' })}
        </Button>
      </AuthButton>
    </Space>
  )

  return (
    <PageHeaderWrapper>
      <Card>
        <PolymericTable
          rowKey="levelId"
          columns={columns}
          fetchDataSource={(params) => fetchMemberRoleRuleList(params as GetMemberLevelListRequestParams)}
          defaultPageSize={10}
          searchFormProps={{
            actions: queryFormActions,
            schema: querySchema,
            components: {
              RoleRuleConfigCtl,
            },
            effects: ($, actions) => {
              useStateFilterSearchLinkageEffect($, actions, 'levelTag', FORM_FILTER_PATH)
            },
          }}
          scroll={{ x: 1200 }}
          ref={polymericRef}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default PlatformMemberLevelIndexIndex
