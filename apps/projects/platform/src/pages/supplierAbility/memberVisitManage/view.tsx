/**
 * @Description 会员拜访管理 - 列表
 */
import React, { useState, useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Card, Button, Space, Popconfirm, Modal, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { ColumnType } from 'antd/lib/table/interface'
import { PageHeaderWrapper } from '@apps/components'
import { createFormActions } from '@apps/formily'
import { formatTimeString } from '@/utils'
import {
  GetMemberVisitListResponseDetail,
  postMemberSupplierVisitDelete,
  getMemberSupplierVisitList,
  getMemberSupplierVisitVisitTypeItems,
} from '@apps/apis'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { EyeAuthButton } from '@apps/components'
import PolymericTable, { FetchParamsType, NormalTableRefHandleType } from '@/components/PolymericTable'
import { querySchema } from './querySchema'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
const queryFormActions = createFormActions()

type GetMemberVisitListRequestParams = FetchParamsType & {
  memberName: string
  visitTheme: string
  visitType: number
  visitLevel: number
  visitor: string
  peer: string
}

type GetMemberVisitListRequestResponse = GetMemberVisitListResponseDetail & {}

const MemberVisitManageIndex: React.FC<{}> = (props) => {
  const [deleteLoadingKey, setDeleteLoadingKey] = useState(0)
  const intl = useIntl()
  const polymericRef = useRef<NormalTableRefHandleType | null>(null)
  const { pathname } = useLocation()
  const handleJumpFormPage = (record?: GetMemberVisitListRequestResponse) => {
    history.push(
      !record ? '/supplierAbility/memberVisitManage/add' : `/supplierAbility/memberVisitManage/edit?id=${record.id}`,
    )
  }

  const handleDeleteMemberVisitRecord = (record: GetMemberVisitListRequestResponse) => {
    if (record.id === deleteLoadingKey) {
      return
    }
    const msg = message.loading({
      content: intl.formatMessage({
        id: 'member.memberVisitManage.delete.deleting',
        defaultMessage: '正在删除，请稍候...',
      }),
      duration: 0,
    })
    setDeleteLoadingKey(record.id)
    postMemberSupplierVisitDelete({
      id: record.id,
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

  const columns: ColumnType<GetMemberVisitListRequestResponse>[] = [
    {
      title: intl.formatMessage({ id: 'member.memberVisitManage.index', defaultMessage: '序号' }),
      dataIndex: 'index',
      width: '10%',
      render: (_, record, index) => index + 1,
    },
    {
      title: intl.formatMessage({ id: 'member.memberVisitManage.visitTheme', defaultMessage: '拜访主题' }),
      dataIndex: 'visitTheme',
      width: '15%',
      render: (text: any, record) => (
        <>
          <EyeAuthButton
            url={`/supplierAbility/memberVisitManage/detail?id=${record.id}`}
            type={authUrl(pathname, 'detail') ? 'link' : 'button'}
          >
            {text}
          </EyeAuthButton>
        </>
      ),
    },
    {
      title: intl.formatMessage({ id: 'supplier.supplierVisitManage.supplierName', defaultMessage: '供应商名称' }),
      dataIndex: 'memberName',
      width: '10%',
    },
    {
      title: intl.formatMessage({ id: 'member.memberVisitManage.visitTypeName', defaultMessage: '拜访类型' }),
      dataIndex: 'visitTypeName',
      width: '10%',
    },
    {
      title: intl.formatMessage({ id: 'member.memberVisitManage.visitDate', defaultMessage: '拜访日期' }),
      dataIndex: 'visitDate',
      width: '10%',
      render: (text) => (text ? formatTimeString(text, 'YYYY-MM-DD') : ''),
    },
    {
      title: intl.formatMessage({ id: 'member.memberVisitManage.visitLevelName', defaultMessage: '拜访级别' }),
      dataIndex: 'visitLevelName',
      width: '10%',
    },
    {
      title: intl.formatMessage({ id: 'member.memberVisitManage.visitor', defaultMessage: '拜访人' }),
      dataIndex: 'visitor',
      width: '10%',
    },
    {
      title: intl.formatMessage({ id: 'member.memberVisitManage.peer', defaultMessage: '同行人' }),
      dataIndex: 'peer',
      width: '10%',
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
            <Button type="link" onClick={() => handleJumpFormPage(record)}>
              {intl.formatMessage({ id: 'member.memberVisitManage.modify', defaultMessage: '编辑' })}
            </Button>
          </EditAuthButton>
          <AuthButton type="custom" code="delete">
            <Popconfirm
              title={intl.formatMessage({
                id: 'member.memberVisitManage.delete.confirm.title',
                defaultMessage: '是否确认删除该拜访信息？',
              })}
              onConfirm={() => handleDeleteMemberVisitRecord(record)}
              okText={intl.formatMessage({ id: 'common.button.yes', defaultMessage: '确认' })}
              cancelText={intl.formatMessage({ id: 'common.button.no', defaultMessage: '取消' })}
            >
              <Button type="link" loading={record.id === deleteLoadingKey}>
                {intl.formatMessage({ id: 'member.memberVisitManage.delete', defaultMessage: '删除' })}
              </Button>
            </Popconfirm>
          </AuthButton>
        </>
      ),
    },
  ]

  const fetchMemberVisitList = async (params: GetMemberVisitListRequestParams) => {
    const res = await getMemberSupplierVisitList({
      ...params,
      visitType: params.visitType ? `${params.visitType}` : undefined,
      visitLevel: params.visitLevel ? `${params.visitLevel}` : undefined,
      current: `${params.current}`,
      pageSize: `${params.pageSize}`,
    })
    if (res.code === 1000) {
      return res.data
    }
    return { data: [], totalCount: 0 }
  }

  const RoleRuleConfigCtl = () => (
    <Space>
      <AddAuthButton>
        <Button type="primary" onClick={() => handleJumpFormPage()} icon={<PlusOutlined />}>
          {intl.formatMessage({ id: 'member.memberVisitManage.add', defaultMessage: '新增' })}
        </Button>
      </AddAuthButton>
    </Space>
  )

  return (
    <PageHeaderWrapper>
      <Card>
        <PolymericTable
          rowKey="id"
          columns={columns}
          fetchDataSource={(params) => fetchMemberVisitList(params as GetMemberVisitListRequestParams)}
          defaultPageSize={10}
          searchFormProps={{
            actions: queryFormActions,
            schema: querySchema,
            components: {
              RoleRuleConfigCtl,
            },
            effects: ($, actions) => {
              useStateFilterSearchLinkageEffect($, actions, 'memberName', FORM_FILTER_PATH)

              useAsyncInitSelect(['visitType', 'visitLevel'], async () => {
                const { data, code } = await getMemberSupplierVisitVisitTypeItems()
                if (code === 1000) {
                  return {
                    visitType: data.visitTypes.map((item) => ({ label: item.visitTypeName, value: item.visitType })),
                    visitLevel: data.visitLevels.map((item) => ({
                      label: item.visitLevelName,
                      value: item.visitLevel,
                    })),
                  }
                }
                return {}
              })
            },
          }}
          scroll={{ x: 1200 }}
          ref={polymericRef}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default MemberVisitManageIndex
