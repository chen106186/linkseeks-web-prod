import React, { useState, useRef } from 'react'
import { Card, Badge, Progress, Button, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import { PageHeaderWrapper } from '@apps/components'
import { createFormActions } from '@apps/formily'
import { getPayCreditApplyPageCredit, getPayCreditApplyPageItemsByConsumer } from '@apps/apis'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { coverColFiltersItem } from '@/utils'
import {
  CREDIT_STATUS_NOT_APPLIED,
  CREDIT_STATUS_APPLYING,
  CREDIT_STATUS_NORMAL,
  CREDIT_STATUS_FROZEN,
  CREDIT_STATUS,
  CREDIT_REPAYMENT_STATUS_OVERDUE,
} from '@/constants/payment'
import { CREDIT_REPAYMENT_STATUS_TAG_MAP, CREDIT_STATUS_BADGE_MAP } from '../../constant'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import StatusTag from '@/components/StatusTag'
import { listSearchSchema } from './schema'
import styles from './index.less'
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'

const formActions = createFormActions()

const QuotaMenage: React.FC = () => {
  const intl = useIntl()
  const ref = useRef<any>({})

  const handleJumpApply = (record) => {
    // 跳转申请页面
    history.push(`/payandSettle/creditApplication/quotaMenage/apply?creditId=${record.id}&applyId=0`)
  }

  const defaultColumns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'payandSettle.creditApplication.quotaMenage.defaultColumns.parentMemberName' }),
      dataIndex: 'parentMemberName',
      align: 'center',
      render: (text, record) => (
        <>
          {/* 未申请过，并且授信状态为未申请 或者 申请中 则显示文本 */}
          {!record.isHasApply &&
          (record.status === CREDIT_STATUS_NOT_APPLIED || record.status === CREDIT_STATUS_APPLYING) ? (
            <>
              {`${text} `}
              <Tooltip
                title={intl.formatMessage({
                  id: 'payandSettle.creditApplication.quotaMenage.defaultColumns.parentMemberName.tooltip',
                })}
              >
                <QuestionCircleOutlined />
              </Tooltip>
            </>
          ) : (
            <DetailAuthButton>
              <EyeAuthButton url={`/payandSettle/creditApplication/quotaMenage/detail?id=${record.id}`}>
                {text}
              </EyeAuthButton>
            </DetailAuthButton>
          )}
        </>
      ),
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditApplication.quotaMenage.defaultColumns.memberTypeName' }),
      dataIndex: 'memberTypeName',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditApplication.quotaMenage.defaultColumns.memberRoleName' }),
      dataIndex: 'memberRoleName',
      align: 'center',
      render: (text, record) => <>{text}</>,
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditApplication.quotaMenage.defaultColumns.memberLevelName' }),
      dataIndex: 'memberLevelName',
      align: 'center',
      render: (text, record) => <>{text}</>,
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditApplication.quotaMenage.defaultColumns.canUseQuota' }),
      dataIndex: 'canUseQuota',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditApplication.quotaMenage.defaultColumns.quota' }),
      dataIndex: 'quota',
      align: 'center',
      render: (text, record) => (
        <>
          <div>
            {intl.formatMessage({ id: 'payandSettle.creditApplication.quotaMenage.defaultColumns.quota.text.1' })}
            {text}
          </div>
          <div>
            {intl.formatMessage({ id: 'payandSettle.creditApplication.quotaMenage.defaultColumns.quota.text.2' })}
            {record.useQuota}
          </div>
        </>
      ),
    },
    {
      title: '',
      dataIndex: 'used',
      align: 'center',
      render: (text, record) => (
        <Progress
          type="circle"
          percent={(record.useQuota / record.quota) * 100}
          strokeColor="#41CC9E"
          strokeWidth={12}
          width={40}
          format={() => ''}
        />
      ),
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditApplication.quotaMenage.defaultColumns.repayStatusName' }),
      dataIndex: 'repayStatusName',
      align: 'center',
      render: (text, record) => (
        <>{text ? <StatusTag type={CREDIT_REPAYMENT_STATUS_TAG_MAP[record.repayStatus]} title={text} /> : null}</>
      ),
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditApplication.quotaMenage.defaultColumns.statusName' }),
      dataIndex: 'statusName',
      align: 'center',
      render: (text, record) => <Badge color={CREDIT_STATUS_BADGE_MAP[record.status] || '#606266'} text={text} />,
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditApplication.quotaMenage.defaultColumns.action' }),
      dataIndex: 'action',
      align: 'center',
      render: (_, record) => (
        <>
          {/* 现有额度为 0，并且授信状态为 未申请 或 到达了可调额时间（会员支付参数配置的时间） */}
          {((record.quota === 0 && record.status === CREDIT_STATUS_NOT_APPLIED) ||
            (!!record.isCanApply && record.status === CREDIT_STATUS_NORMAL)) && (
            <AuthButton type="custom" code="apply">
              <Button type="link" onClick={() => handleJumpApply(record)}>
                申请调额
              </Button>
            </AuthButton>
          )}
        </>
      ),
    },
  ]

  const [columns, setColumns] = useState<any[]>(defaultColumns)

  const fetchListData = (params: any) => {
    const { status = 0, rePayStatus = 0, ...rest } = params
    return new Promise((resolve, reject) => {
      getPayCreditApplyPageCredit({
        status,
        rePayStatus,
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

  // 初始化高级筛选选项
  const fetchSearchItems = async () => {
    const res = await getPayCreditApplyPageItemsByConsumer()

    if (res.code === 1000) {
      const { data } = res
      const { statusList = [], repayStatusList = [] } = data

      return {
        status: statusList.map((item) => ({ label: item.name, value: item.status })).filter((item) => item.value),
        rePayStatus: repayStatusList
          .map((item) => ({ label: item.name, value: item.status }))
          .filter((item) => item.value),
      }
    }
    return {}
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
                useStateFilterSearchLinkageEffect($, actions, 'parentMemberName', FORM_FILTER_PATH)
                useAsyncInitSelect(['status', 'rePayStatus'], fetchSearchItems)
              }}
              schema={listSearchSchema}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default QuotaMenage
