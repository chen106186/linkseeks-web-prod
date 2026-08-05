/**
 * @Description 会员等级管理 - 列表
 */
import React, { useState, useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Card, Button, Space, Popconfirm, Modal, message } from 'antd'
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import type { ColumnType } from 'antd/lib/table/interface'
import { PageHeaderWrapper } from '@apps/components'
import { createFormActions } from '@apps/formily'
import type { GetMemberSupplierAbilityLevelPageResponseDetail } from '@apps/apis'
import {
  getMemberSupplierAbilityLevelPage,
  postMemberSupplierAbilityLevelDelete,
  postMemberSupplierAbilityLevelRebuild,
  postMemberSupplierAbilityLevelStatus,
} from '@apps/apis'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { EyeAuthButton } from '@apps/components'
import type { FetchParamsType, NormalTableRefHandleType } from '@/components/PolymericTable'
import PolymericTable from '@/components/PolymericTable'
import { StatusAuthButton } from '@apps/components'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { querySchema } from './querySchema'
import { useWebIntl } from '@apps/locales'

const { confirm } = Modal

const queryFormActions = createFormActions()

type GetMemberLevelListRequestParams = FetchParamsType & {
  levelTag: string
  roleName: string
}

type GetMemberLevelListRequestResponse = GetMemberSupplierAbilityLevelPageResponseDetail & {}

const PlatformMemberLevelIndexIndex: React.FC<{}> = () => {
  const [statusLoadingKey, setStatusLoadingKey] = useState(0)
  const [deleteLoadingKey, setDeleteLoadingKey] = useState(0)
  const { pathname } = useLocation()
  const intl = useIntl()
  const translate = useWebIntl()
  const polymericRef = useRef<NormalTableRefHandleType | null>(null)

  const handleJumpFormPage = (record?: GetMemberLevelListRequestResponse) => {
    history.push(
      !record
        ? '/supplierAbility/ruleConfiguration/memberLevel/add'
        : `/supplierAbility/ruleConfiguration/memberLevel/edit?id=${record.levelId}`,
    )
  }

  const handleJumpSetMemberLevelRight = (record: GetMemberLevelListRequestResponse) => {
    history.push(`/supplierAbility/ruleConfiguration/memberLevel/setMemberLevelRight?id=${record.levelId}`)
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
    postMemberSupplierAbilityLevelStatus({
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
      content: translate('web.common.deleteloading'),
      duration: 0,
    })
    setDeleteLoadingKey(record.levelId)
    postMemberSupplierAbilityLevelDelete({
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
      title: translate('web.resource.member.levelId'),
      dataIndex: 'levelId',
      width: '10%',
    },
    {
      title: translate('web.resource.member.level'),
      dataIndex: 'level',
      width: '10%',
    },
    {
      title: translate('web.resource.member.levelTag'),
      dataIndex: 'levelTag',
      render: (text: any, record) => (
        <>
          <EyeAuthButton
            url={`/supplierAbility/ruleConfiguration/memberLevel/detail?id=${record.levelId}`}
            type={authUrl(pathname, 'detail') ? 'link' : 'button'}
          >
            {text}
          </EyeAuthButton>
        </>
      ),
      width: '10%',
    },
    {
      title: translate('web.resource.member.levelType'),
      dataIndex: 'levelTypeName',
      width: '10%',
    },
    {
      title: translate('web.resource.member.levelSouceTag'),
      dataIndex: 'scoreTag',
      width: '10%',
    },
    {
      title: translate('web.resource.member.memberRoleName'),
      dataIndex: 'roleName',
      width: '10%',
    },
    {
      title: translate('web.resource.member.roleType'),
      dataIndex: 'roleTypeName',
      width: '10%',
    },
    {
      title: translate('web.resource.member.memberSupperType'),
      dataIndex: 'memberTypeName',
      width: '10%',
    },
    {
      title: translate('web.resource.member.shengjiyuzhi'),
      dataIndex: 'point',
      width: '10%',
    },
    {
      title: translate('web.common.status'),
      dataIndex: 'statusName',
      width: '15%',
      render: (text, record) => (
        <StatusAuthButton handleConfirm={() => handleChangeMemberLevelStatus(record)} record={record} />
      ),
    },
    {
      title: translate('web.common.control'),
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
              {translate('web.resource.member.shezhiquanyiyushengji')}
            </Button>
          </AuthButton>
        </>
      ),
    },
  ]

  const fetchMemberRoleRuleList = async (params: GetMemberLevelListRequestParams) => {
    const res = await getMemberSupplierAbilityLevelPage({
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
      title: translate('web.common.tip'),
      icon: <ExclamationCircleOutlined />,
      content: translate('web.resource.member.memberLevelInitialTip'),
      cancelText: translate('web.common.cancel'),
      okText: translate('web.common.confirm'),
      onOk() {
        return postMemberSupplierAbilityLevelRebuild()
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
