import React, { useRef } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Card, Space, Button, Input } from 'antd'
import NiceForm from '@/components/NiceForm'
import StandardTable from '@/components/StandardTable'
import { StatusAuthButton, EyeAuthButton, AuthButton } from '@apps/components'
import { createFormActions, FormEffectHooks, FormPath } from '@apps/formily'
import { PlusOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/es/table'
import { history } from '@linkseeks/router-manager'
import { Link } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { indexSchema } from './schema'
import {
  getSettlementPlatformConfigPageMemberSettlementStrategy,
  postSettlementPlatformConfigDeleteMemberSettlementStrategy,
  postSettlementPlatformConfigSetMemberSettlementStrategyStatus,
} from '@apps/apis'
import styles from './index.less'

const formActions = createFormActions()

const MemberSettle: React.FC<{}> = () => {
  const ref = useRef<any>({})
  const intl = useIntl()

  const fetchData = async (params: any) => {
    console.log(params)
    const { current, pageSize, name } = params
    const postData = { current, pageSize, name: name || '' }
    const { data } = await getSettlementPlatformConfigPageMemberSettlementStrategy(postData)
    return data
  }

  const handleModify = async (record) => {
    const { code } = await postSettlementPlatformConfigSetMemberSettlementStrategyStatus({
      id: record.id,
      status: record.status ? 0 : 1,
    })
    if (code == 1000) {
      formActions.submit()
    }
  }

  const columns: ColumnsType<any> = [
    { title: intl.formatMessage({ id: 'balance.settleRules.memberSettle.columns.id' }), dataIndex: 'id' },
    {
      title: intl.formatMessage({ id: 'balance.settleRules.memberSettle.columns.name' }),
      dataIndex: 'name',
      render: (text, record) => {
        return (
          <EyeAuthButton type="link" url={`/balance/settleRules/memberSettle/detail?id=${record.id}&preview=1`}>
            {text}
          </EyeAuthButton>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'balance.settleRules.memberSettle.columns.settlementOrderTypeName' }),
      dataIndex: 'settlementOrderTypeName',
    },
    {
      title: intl.formatMessage({ id: 'balance.settleRules.memberSettle.columns.settlementWayName' }),
      dataIndex: 'settlementWayName',
    },
    {
      title: intl.formatMessage({ id: 'balance.settleRules.memberSettle.columns.status' }),
      dataIndex: 'status',
      render: (text, record) => {
        return (
          <div className={styles.status}>
            <StatusAuthButton handleConfirm={() => handleModify(record)} record={record} fieldNames="status" />
          </div>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'balance.settleRules.memberSettle.columns.operation' }),
      render: (text, record) => {
        if (record.status == 1) {
          return null
        }
        return (
          <Space>
            {/* <Link to={`/balance/settleRules/memberSettleList/edit?id=${record.id}`}> */}
            <AuthButton type="edit">
              <Link to={`/balance/settleRules/memberSettle/edit?id=${record.id}`}>
                {intl.formatMessage({ id: 'balance.settleRules.memberSettle.columns.operation.button.1' })}
              </Link>
            </AuthButton>
            <AuthButton type="custom" code="delete">
              <Button type="link" onClick={() => handleRemove({ id: record.id })}>
                {intl.formatMessage({ id: 'balance.settleRules.memberSettle.columns.operation.button.2' })}
              </Button>
            </AuthButton>
          </Space>
        )
      },
    },
  ]

  const handleRemove = (params) => {
    postSettlementPlatformConfigDeleteMemberSettlementStrategy({ id: params.id }).then(({ code }) => {
      if (code === 1000) {
        formActions.submit()
      }
    })
  }

  const goToCreate = () => {
    history.push('/balance/settleRules/memberSettle/add')
  }
  return (
    <PageHeaderWrapper title={intl.formatMessage({ id: 'balance.settleRules.memberSettle.title' })}>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'id',
          }}
          columns={columns}
          currentRef={ref}
          fetchTableData={(params: any) => fetchData(params)}
          controlRender={
            <NiceForm
              actions={formActions}
              expressionScope={{
                createBtn: (
                  <div style={{ width: '112px' }}>
                    <Button type="primary" onClick={goToCreate}>
                      <PlusOutlined /> {intl.formatMessage({ id: 'balance.settleRules.memberSettle.createBtn' })}
                    </Button>
                  </div>
                ),
              }}
              onSubmit={(values) => ref.current.reload(values)}
              schema={indexSchema}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default MemberSettle
