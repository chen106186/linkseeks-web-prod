import React, { Suspense, useEffect, useState, useMemo, useCallback } from 'react'
import { PageHeader, Descriptions, Spin, Badge, message } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import {
  getPayCreditApplyGetCreditDetail,
  getPayCreditApplyGetCreditBillDetail,
  getPayCreditApplyPageCreditTradeRecord,
  getPayCreditApplyPageCreditOverdue,
  GetPayCreditApplyGetCreditDetailResponse,
} from '@apps/apis'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import { CREDIT_REPAYMENT_STATUS, CREDIT_STATUS } from '@/constants/payment'
import AvatarWrap from '@/components/AvatarWrap'
import StatusTag from '@/components/StatusTag'
import { CREDIT_STATUS_BADGE_MAP, CREDIT_REPAYMENT_STATUS_TAG_MAP } from '../../../constant'
import { BillDetailParams, BillDetailData, BillRecordParams } from './components/IntroduceRow'
import styles from './index.less'

const IntroduceRow = React.lazy(() => import('./components/IntroduceRow'))
const BillInfo = React.lazy(() => import('./components/BillInfo'))
const HistoryList = React.lazy(() => import('../../components/HistoryList'))

const QuotaMenageDetail: React.FC = () => {
  const { id } = usePageStatus()
  const intl = useIntl()
  const [creditInfo, setCreditInfo] = useState<GetPayCreditApplyGetCreditDetailResponse>(null)
  const [creditOverdueList, setCreditOverdueList] = useState([])
  const [infoLoading, setInfoLoading] = useState(false)
  const [creditOverdueListLoading, setCreditOverdueListLoading] = useState(false)

  // 获取授信详情
  const getCreditDetail = () => {
    if (!id) {
      return
    }
    setInfoLoading(true)
    getPayCreditApplyGetCreditDetail({
      id,
    })
      .then((res) => {
        if (res.code === 1000) {
          setCreditInfo(res.data)
        }
      })
      .catch((err) => {
        console.warn(err)
      })
      .finally(() => {
        setInfoLoading(false)
      })
  }

  useEffect(() => {
    getCreditDetail()
    getCreditOverdueList()
  }, [])

  const quotaData = [
    {
      x: intl.formatMessage({ id: 'payandSettle.creditApplication.quotaMenage.detail.quotaData.1' }),
      y: creditInfo && creditInfo.canUseQuota ? creditInfo.canUseQuota : 0,
    },
    {
      x: intl.formatMessage({ id: 'payandSettle.creditApplication.quotaMenage.detail.quotaData.2' }),
      y: creditInfo && creditInfo.useQuota ? creditInfo.useQuota : 0,
    },
  ]

  // 获取账单详情
  const fetchBillDetail = (params: BillDetailParams): Promise<BillDetailData> => {
    return new Promise((resolve, reject) => {
      getPayCreditApplyGetCreditBillDetail(params)
        .then((res) => {
          if (res.code === 1000) {
            resolve(res.data)
          } else {
            reject()
          }
        })
        .catch((error) => {
          reject()
        })
    })
  }

  // 获取账单记录列表
  const fetchBillRecordList = (params: BillRecordParams): Promise<any> => {
    if (!id) {
      return
    }
    return new Promise((resolve, reject) => {
      getPayCreditApplyPageCreditTradeRecord({
        creditId: id,
        ...params,
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

  // 获取逾期列表
  const getCreditOverdueList = () => {
    if (!id) {
      return
    }
    setCreditOverdueListLoading(true)
    getPayCreditApplyPageCreditOverdue({
      creditId: id,
      current: '1',
      pageSize: '9999', // 暂时写死
    })
      .then((res) => {
        if (res.code === 1000) {
          setCreditOverdueList(res.data.data)
        }
      })
      .catch((err) => {
        console.warn(err)
      })
      .finally(() => {
        setCreditOverdueListLoading(false)
      })
  }

  const normalizeOptions = (arr) => {
    if (!arr || !Array.isArray(arr)) {
      return []
    }
    return arr.map((item) => ({
      title: item.name,
      value: item.id,
    }))
  }

  return (
    <Spin spinning={infoLoading}>
      <PageHeaderWrapper
        style={{
          padding: 24,
        }}
        title={
          <>
            <PageHeader
              style={{ padding: '0' }}
              onBack={() => history.goBack()}
              title={
                <AvatarWrap
                  info={{
                    name: creditInfo?.member?.memberName,
                  }}
                  extra={creditInfo?.member?.levelTag}
                />
              }
              extra={<></>}
            >
              <Descriptions
                size="small"
                column={3}
                style={{
                  padding: '0 32px',
                }}
              >
                <Descriptions.Item
                  label={intl.formatMessage({ id: 'payandSettle.creditApplication.quotaMenage.detail.descriptions.1' })}
                >
                  {creditInfo?.member?.memberTypeName}
                </Descriptions.Item>
                <Descriptions.Item
                  label={intl.formatMessage({ id: 'payandSettle.creditApplication.quotaMenage.detail.descriptions.2' })}
                  span={2}
                >
                  {creditInfo?.member?.roleName}
                </Descriptions.Item>
                <Descriptions.Item
                  label={intl.formatMessage({ id: 'payandSettle.creditApplication.quotaMenage.detail.descriptions.3' })}
                >
                  <StatusTag
                    type={CREDIT_REPAYMENT_STATUS_TAG_MAP[creditInfo?.member?.repayStatus]}
                    title={CREDIT_REPAYMENT_STATUS[creditInfo?.member?.repayStatus]}
                  />
                </Descriptions.Item>
                <Descriptions.Item
                  label={intl.formatMessage({ id: 'payandSettle.creditApplication.quotaMenage.detail.descriptions.4' })}
                  span={2}
                >
                  <Badge
                    color={CREDIT_STATUS_BADGE_MAP[creditInfo?.member?.status]}
                    text={CREDIT_STATUS[creditInfo?.member?.status]}
                  />
                </Descriptions.Item>
              </Descriptions>
            </PageHeader>
          </>
        }
      >
        <Suspense fallback={null}>
          <IntroduceRow
            quotaData={quotaData}
            extraData={{
              canUseQuota: creditInfo?.canUseQuota,
              useQuota: creditInfo?.useQuota,
              quota: creditInfo?.quota,
            }}
            options={normalizeOptions(creditInfo?.billSelectList)}
            fetchBillDetail={fetchBillDetail}
            fetchBillRecordList={fetchBillRecordList}
          />
        </Suspense>

        <Suspense fallback={null}>
          <BillInfo overdueList={creditOverdueList} loading={creditOverdueListLoading} />
        </Suspense>

        <Suspense fallback={null}>
          <HistoryList
            dataSource={creditInfo?.historyApplyList}
            target="/payandSettle/creditApplication/quotaMenage/history"
          />
        </Suspense>
      </PageHeaderWrapper>
    </Spin>
  )
}

export default QuotaMenageDetail
