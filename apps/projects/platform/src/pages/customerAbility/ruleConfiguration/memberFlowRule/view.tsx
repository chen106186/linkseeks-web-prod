/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-27 16:01:23
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 17:04:10
 * @Description: 会员管理流程规则配置
 */
import React, { useState, useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Card, Space, Button, Popconfirm, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { PageHeaderWrapper } from '@apps/components'
import StandardTable from '@/components/StandardTable'
import { formatTimeString } from '@/utils'
import { ColumnType } from 'antd/lib/table/interface'
import { createFormActions } from '@apps/formily'
import { EyeAuthButton } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import { StatusAuthButton } from '@apps/components'
import { querySchema } from './schema'
import {
  getMemberCustomerProcessRulePage,
  postMemberCustomerProcessRuleDelete,
  postMemberCustomerProcessRuleUpdateStatus,
} from '@apps/apis'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { useWebIntl } from '@apps/locales'

const formActions = createFormActions()

const fetchListData = async (params: any) => {
  const { startDate = null, endDate = null } = params
  const payload = { ...params }

  if (startDate) {
    payload.startDate = formatTimeString(+startDate, 'YYYY-MM-DD')
  }
  if (endDate) {
    payload.endDate = formatTimeString(+endDate, 'YYYY-MM-DD')
  }
  const res = await getMemberCustomerProcessRulePage(payload)

  if (res.code === 1000) {
    return res.data
  }
  return { data: [], totalCount: 0 }
}

const MemberFlowRule: React.FC<any> = (props) => {
  const { pathname } = useLocation()

  const ref = useRef<any>({})

  const intl = useIntl()
  const translate = useWebIntl()
  const handleDelete = (id: number) => {
    const mesInstance = message.loading({
      content: intl.formatMessage({ id: 'member.memberFlowRule.delete.message' }),
      duration: 0,
    })
    postMemberCustomerProcessRuleDelete({
      id,
    })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        ref.current.reload()
      })
      .finally(() => {
        mesInstance()
      })
  }

  const handleModify = (id: number, status: number) => {
    const mesInstance = message.loading({
      content: intl.formatMessage({ id: 'member.memberFlowRule.modify.message' }),
      duration: 0,
    })
    postMemberCustomerProcessRuleUpdateStatus({
      id,
      status: status === 0 ? 1 : 0,
    })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        ref.current.reload()
      })
      .finally(() => {
        mesInstance()
      })
  }

  const defaultColumns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'member.memberFlowRule.defaultColumns.id' }),
      dataIndex: 'id',
    },
    {
      title: intl.formatMessage({ id: 'member.memberFlowRule.defaultColumns.ruleName' }),
      dataIndex: 'ruleName',
      render: (text, record) => (
        <>
          <EyeAuthButton
            type={authUrl(pathname, 'detail') ? 'link' : 'button'}
            url={`${pathname}/detail?id=${record.id}`}
          >
            {text}
          </EyeAuthButton>
        </>
      ),
    },
    {
      title: translate('web.resource.member.memberRole'),
      dataIndex: 'roleName',
    },
    {
      title: intl.formatMessage({ id: 'member.memberFlowRule.defaultColumns.roleTypeName' }),
      dataIndex: 'roleTypeName',
    },
    {
      title: translate('web.resource.member.memberType'),
      dataIndex: 'memberTypeName',
    },
    {
      title: intl.formatMessage({ id: 'member.memberFlowRule.defaultColumns.createTime' }),
      dataIndex: 'createTime',
    },
    {
      title: intl.formatMessage({ id: 'member.memberFlowRule.defaultColumns.status' }),
      dataIndex: 'status',
      render: (_, record) => (
        <AuthButton type="custom" code="state">
          <StatusAuthButton
            fieldNames="status"
            handleConfirm={() => handleModify(record.id, record.status)}
            record={record}
          />
        </AuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'common.table.action' }),
      dataIndex: 'option',
      width: '20%',
      render: (_, record: any) => (
        <>
          <EditAuthButton>
            <Button type="link" onClick={() => history.push(`${pathname}/edit?id=${record.id}`)}>
              {intl.formatMessage({ id: 'member.memberFlowRule.modify' })}
            </Button>
          </EditAuthButton>
          <AuthButton type="custom" code="delete">
            <Popconfirm
              title={intl.formatMessage({ id: 'member.memberFlowRule.delete.tip' })}
              okText={intl.formatMessage({ id: 'member.memberFlowRule.delete.yes' })}
              cancelText={intl.formatMessage({ id: 'member.memberFlowRule.delete.no' })}
              onConfirm={() => handleDelete(record.id)}
            >
              <Button type="link" danger>
                {intl.formatMessage({ id: 'member.memberFlowRule.delete' })}
              </Button>
            </Popconfirm>
          </AuthButton>
        </>
      ),
    },
  ]

  const [columns, setColumns] = useState<any[]>(defaultColumns)

  const controllerBtns = (
    <>
      <Space>
        <AddAuthButton>
          <Button type="primary" onClick={() => history.push(`${pathname}/add`)}>
            <PlusOutlined />
            {intl.formatMessage({ id: 'member.memberFlowRule.add' })}
          </Button>
        </AddAuthButton>
      </Space>
    </>
  )

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'id',
          }}
          columns={columns}
          currentRef={ref}
          fetchTableData={(params: any) => fetchListData(params)}
          controlRender={
            <NiceForm
              actions={formActions}
              onSubmit={(values) => ref.current.reload(values)}
              expressionScope={{
                controllerBtns,
              }}
              effects={($, actions) => {}}
              schema={querySchema}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default MemberFlowRule
