import React, { useState, useRef } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Card, Badge, Progress, Button } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'
import StandardTable from '@/components/StandardTable'
import moment from 'moment'
import { ColumnType } from 'antd/lib/table/interface'
import { PageHeaderWrapper } from '@apps/components'
import { createFormActions } from '@apps/formily'
import { getPayCreditApplyPageCreditApply, getPayCreditApplyPageItemsByConsumer } from '@apps/apis'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { coverColFiltersItem } from '@/utils'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import StatusTag from '@/components/StatusTag'
import { listSearchSchema } from './schema'
import { CREDIT_OUTER_STATUS_TAG_MAP, CREDIT_INNER_STATUS_BADGE_MAP_PURCHASER } from '../../constant'
import styles from './index.less'
import { customAuthUrl as AuthUrl } from '@apps/domains'

const formActions = createFormActions()

const QuotaFormQuery: React.FC = () => {
  const ref = useRef<any>({})
  const intl = useIntl()

  const defaultColumns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'payandSettle.creditApplication.quotaFormQuery.defaultColumns.applyNo' }),
      dataIndex: 'applyNo',
      align: 'center',
      render: (text, record) => (
        <DetailAuthButton>
          <EyeAuthButton
            url={`/payandSettle/creditApplication/quotaFormQuery/detail?id=${record.id}&creditId=${record.creditId}`}
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
      title: intl.formatMessage({
        id: 'payandSettle.creditApplication.quotaFormQuery.defaultColumns.parentMemberName',
      }),
      dataIndex: 'parentMemberName',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditApplication.quotaFormQuery.defaultColumns.memberTypeName' }),
      dataIndex: 'memberTypeName',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditApplication.quotaFormQuery.defaultColumns.memberRoleName' }),
      dataIndex: 'memberRoleName',
      align: 'center',
      render: (text, record) => <>{text}</>,
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditApplication.quotaFormQuery.defaultColumns.memberLevelName' }),
      dataIndex: 'memberLevelName',
      align: 'center',
      render: (text, record) => <>{text}</>,
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditApplication.quotaFormQuery.defaultColumns.originalQuota' }),
      dataIndex: 'originalQuota',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditApplication.quotaFormQuery.defaultColumns.applyQuota' }),
      dataIndex: 'applyQuota',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditApplication.quotaFormQuery.defaultColumns.outerStatusName' }),
      dataIndex: 'outerStatusName',
      align: 'center',
      render: (text, record) => <StatusTag type={CREDIT_OUTER_STATUS_TAG_MAP[record.outerStatus]} title={text} />,
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditApplication.quotaFormQuery.defaultColumns.innerStatusName' }),
      dataIndex: 'innerStatusName',
      align: 'center',
      render: (text, record) => (
        <Badge color={CREDIT_INNER_STATUS_BADGE_MAP_PURCHASER[record.innerStatus] || '#606266'} text={text} />
      ),
    },
  ]

  const [columns, setColumns] = useState<any[]>(defaultColumns)

  const fetchListData = (params: any) => {
    const { startTime, endTime, ...rest } = params
    return new Promise((resolve, reject) => {
      getPayCreditApplyPageCreditApply({
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

  // 初始化高级筛选选项
  const fetchSearchItems = async () => {
    const res = await getPayCreditApplyPageItemsByConsumer()

    if (res.code === 1000) {
      const { data } = res
      const { outerStatusList = [], innerStatusList = [] } = data

      return {
        outerStatus: outerStatusList
          .map((item) => ({ label: item.name, value: item.status }))
          .filter((item) => item.value),
        innerStatus: innerStatusList
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
                useStateFilterSearchLinkageEffect($, actions, 'memberName', FORM_FILTER_PATH)
                useAsyncInitSelect(['innerStatus', 'outerStatus'], fetchSearchItems)
              }}
              schema={listSearchSchema}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default QuotaFormQuery
