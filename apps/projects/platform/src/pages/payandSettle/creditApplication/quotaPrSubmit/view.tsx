import React, { useState, useRef } from 'react'
import { Card, Badge, Progress, Button, Popconfirm, message } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'
import StandardTable from '@/components/StandardTable'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import moment from 'moment'
import { ColumnType } from 'antd/lib/table/interface'
import { PageHeaderWrapper } from '@apps/components'
import { createFormActions } from '@apps/formily'
import {
  postPayCreditApplySubmitCreditApply,
  postPayCreditApplyDeleteCreditApply,
  getPayCreditApplyPageWaitSubmitCreditApply,
} from '@apps/apis'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import StatusTag from '@/components/StatusTag'
import { listSearchSchema } from './schema'
import { CREDIT_INNER_STATUS_UNCOMMITTED, CREDIT_OUTER_STATUS_FAILED } from '@/constants/payment'
import { CREDIT_OUTER_STATUS_TAG_MAP, CREDIT_INNER_STATUS_BADGE_MAP_PURCHASER } from '../../constant'
import styles from './index.less'
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'

const formActions = createFormActions()

const QuotaPrSubmit: React.FC = () => {
  const intl = useIntl()
  const ref = useRef<any>({})

  const handleSubmit = (record) => {
    const msg = message.loading({
      content: intl.formatMessage({ id: 'payandSettle.creditApplication.quotaPrSubmit.handleSubmit' }),
      duration: 0,
    })
    postPayCreditApplySubmitCreditApply({
      applyId: record.id,
    })
      .then((res) => {
        if (res.code === 1000) {
          ref.current.reloadCurrent()
        }
      })
      .finally(() => {
        msg()
      })
  }

  const handleJumpVerify = (record) => {
    history.push(`/payandSettle/creditApplication/quotaPrSubmit/verify?id=${record.id}&creditId=${record.creditId}`)
  }

  const handleDelete = (record) => {
    const msg = message.loading({
      content: intl.formatMessage({ id: 'payandSettle.creditApplication.quotaPrSubmit.handleDelete' }),
      duration: 0,
    })
    postPayCreditApplyDeleteCreditApply({
      applyId: record.id,
    })
      .then((res) => {
        if (res.code === 1000) {
          ref.current.reloadCurrent()
        }
      })
      .finally(() => {
        msg()
      })
  }

  const defaultColumns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'payandSettle.creditApplication.quotaPrSubmit.defaultColumns.applyNo' }),
      dataIndex: 'applyNo',
      align: 'center',
      render: (text, record) => (
        <DetailAuthButton>
          <EyeAuthButton
            url={`/payandSettle/creditApplication/quotaPrSubmit/detail?id=${record.id}&creditId=${record.creditId}`}
          >
            {text}
          </EyeAuthButton>
          <div>
            <ClockCircleOutlined /> {record.applyTime}
          </div>
        </DetailAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditApplication.quotaPrSubmit.defaultColumns.parentMemberName' }),
      dataIndex: 'parentMemberName',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditApplication.quotaPrSubmit.defaultColumns.memberTypeName' }),
      dataIndex: 'memberTypeName',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditApplication.quotaPrSubmit.defaultColumns.memberRoleName' }),
      dataIndex: 'memberRoleName',
      align: 'center',
      render: (text, record) => <>{text}</>,
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditApplication.quotaPrSubmit.defaultColumns.memberLevelName' }),
      dataIndex: 'memberLevelName',
      align: 'center',
      render: (text, record) => <>{text}</>,
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditApplication.quotaPrSubmit.defaultColumns.originalQuota' }),
      dataIndex: 'originalQuota',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditApplication.quotaPrSubmit.defaultColumns.applyQuota' }),
      dataIndex: 'applyQuota',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditApplication.quotaPrSubmit.defaultColumns.outerStatus' }),
      dataIndex: 'outerStatus',
      align: 'center',
      render: (text, record) => (
        <StatusTag type={CREDIT_OUTER_STATUS_TAG_MAP[record.outerStatus]} title={record.outerStatusName} />
      ),
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditApplication.quotaPrSubmit.defaultColumns.innerStatus' }),
      dataIndex: 'innerStatus',
      align: 'center',
      render: (text, record) => (
        <Badge
          color={CREDIT_INNER_STATUS_BADGE_MAP_PURCHASER[record.innerStatus] || '#606266'}
          text={record.innerStatusName}
        />
      ),
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditApplication.quotaPrSubmit.defaultColumns.option' }),
      dataIndex: 'option',
      align: 'center',
      render: (text, record) => (
        <>
          {record.outerStatus === CREDIT_INNER_STATUS_UNCOMMITTED && (
            <AuthButton type="custom" code="submit">
              <Button type="link" onClick={() => handleSubmit(record)}>
                {intl.formatMessage({
                  id: 'payandSettle.creditApplication.quotaPrSubmit.defaultColumns.option.button.1',
                })}
              </Button>
            </AuthButton>
          )}
          {record.outerStatus === CREDIT_INNER_STATUS_UNCOMMITTED && (
            <AuthButton type="custom" code="del">
              <Popconfirm
                title={intl.formatMessage({
                  id: 'payandSettle.creditApplication.quotaPrSubmit.defaultColumns.option.button.2.popconfirm.title',
                })}
                okText={intl.formatMessage({
                  id: 'payandSettle.creditApplication.quotaPrSubmit.defaultColumns.option.button.2.popconfirm.okText',
                })}
                cancelText={intl.formatMessage({
                  id: 'payandSettle.creditApplication.quotaPrSubmit.defaultColumns.option.button.2.popconfirm.cancelText',
                })}
                onConfirm={() => handleDelete(record)}
              >
                <Button type="link" danger>
                  {intl.formatMessage({
                    id: 'payandSettle.creditApplication.quotaPrSubmit.defaultColumns.option.button.2',
                  })}
                </Button>
              </Popconfirm>
            </AuthButton>
          )}
          {/* 外部状态为不接受申请 或者 内部状态为 待提交申请 都可以进行编辑 */}
          {(record.outerStatus === CREDIT_OUTER_STATUS_FAILED ||
            record.innerStatus === CREDIT_INNER_STATUS_UNCOMMITTED) && (
            <AuthButton type="custom" code="update">
              <Button type="link" onClick={() => handleJumpVerify(record)}>
                {intl.formatMessage({
                  id: 'payandSettle.creditApplication.quotaPrSubmit.defaultColumns.option.button.3',
                })}
              </Button>
            </AuthButton>
          )}
        </>
      ),
    },
  ]

  const [columns, setColumns] = useState<any[]>(defaultColumns)

  const fetchListData = (params: any) => {
    const { startTime, endTime, ...rest } = params
    return new Promise((resolve, reject) => {
      getPayCreditApplyPageWaitSubmitCreditApply({
        startTime: startTime ? moment(+startTime).format('YYYY-MM-DD HH:mm:ss') : null,
        endTime: endTime ? moment(+endTime).format('YYYY-MM-DD HH:mm:ss') : null,
        ...rest,
      })
        .then((res) => {
          if (res.code === 1000) {
            resolve(res.data)
          }
          reject()
        })
        .catch(() => {
          reject()
        })
    })
  }

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
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'memberName', FORM_FILTER_PATH)
              }}
              schema={listSearchSchema}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default QuotaPrSubmit
