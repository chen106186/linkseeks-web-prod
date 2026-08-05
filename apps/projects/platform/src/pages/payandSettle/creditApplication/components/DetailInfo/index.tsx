import React, { Suspense, useEffect, useState } from 'react'
import { PageHeader, Descriptions, Card, Spin, Button, Badge, message } from 'antd'
import { FormOutlined } from '@ant-design/icons'
import { PageHeaderWrapper } from '@apps/components'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { isNumber } from 'lodash'
import { GetPayCreditApplyGetApplyDetailResponse, postPayCreditApplyAddCreditApply } from '@apps/apis'
import { CREDIT_INNER_STATUS, CREDIT_OUTER_STATUS, CREDIT_STATUS } from '@/constants/payment'
import { normalizeFiledata, FileData } from '@/utils'
import AvatarWrap from '@/components/AvatarWrap'
import StatusTag from '@/components/StatusTag'
import {
  CREDIT_STATUS_TAG_MAP,
  CREDIT_OUTER_STATUS_TAG_MAP,
  CREDIT_INNER_STATUS_BADGE_MAP_PURCHASER,
} from '../../../constant'
import { getPayCreditApplyGetApplyDetail } from '@apps/apis'

const OuterCirculation = React.lazy(() => import('../OuterCirculation'))
const QuotaApplicationInfo = React.lazy(() => import('../QuotaApplicationInfo'))
const HitoryList = React.lazy(() => import('../HistoryList'))
const OuterCirculationRecord = React.lazy(() => import('../OuterCirculationRecord'))

interface DetailInfoProps {
  // 申请id
  id: string
  // 授信id
  creditId: string
  // 是否是编辑的
  isEdit?: boolean
  // 历史记录目标路径
  target?: string
}

interface QuotaValues {
  // 申请调整额度
  applyQuota: number | null
  // 申请调整账单日期
  billDay: number | null
  // 申请还款周期
  repayPeriod: number | null
  // 申请附件
  fileList: FileData[]
}

const DetailInfo: React.FC<DetailInfoProps> = ({ id, creditId, isEdit = false, target }) => {
  const intl = useIntl()
  const [quotaInfo, setQuotaInfo] = useState<GetPayCreditApplyGetApplyDetailResponse>(null)
  const [quotaValues, setQuotaValues] = useState<QuotaValues>({
    applyQuota: null,
    billDay: null,
    repayPeriod: null,
    fileList: [],
  })
  const [infoLoading, setInfoloading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  // 获取授信详情
  const getQuotaInfo = () => {
    if (!id) {
      return
    }
    setInfoloading(true)
    getPayCreditApplyGetApplyDetail({
      applyId: id,
      creditId,
    })
      .then((res) => {
        if (res.code === 1000) {
          setQuotaInfo(res.data)
          setQuotaValues({
            applyQuota: res.data?.apply?.applyQuota,
            billDay: res.data?.apply?.billDay,
            repayPeriod: res.data?.apply?.repayPeriod,
            fileList: res.data?.apply?.fileList
              ? res.data.apply.fileList.map((item) => normalizeFiledata(item.fileUrl))
              : [],
          })
        }
      })
      .catch((err) => {
        console.warn(err)
      })
      .finally(() => {
        setInfoloading(false)
      })
  }

  useEffect(() => {
    getQuotaInfo()
  }, [])

  // 调整授信申请信息
  const handleQuotaSubmit = (values) => {
    setQuotaValues(values)
  }

  const handleSubmit = () => {
    setSubmitLoading(true)
    const { fileList, ...rest } = quotaValues

    postPayCreditApplyAddCreditApply({
      applyId: +id,
      creditId: creditId ? +creditId : 0,
      fileList: fileList.map((item: any) => ({ name: item.name, fileUrl: item.url })),
      ...rest,
    })
      .then((res) => {
        if (res.code === 1000) {
          setTimeout(() => {
            history.redirect('/payandSettle/creditApplication/quotaPrSubmit')
          }, 800)
        }
      })
      .finally(() => {
        setSubmitLoading(false)
      })
  }

  return (
    <Spin spinning={infoLoading}>
      <PageHeaderWrapper
        title={
          <>
            <PageHeader
              style={{ padding: '0' }}
              onBack={() => history.goBack()}
              title={
                <AvatarWrap
                  info={{
                    aloneTxt: intl.formatMessage({
                      id: 'payandSettle.creditApplication.components.detailInfo.avatarWrap.aloneTxt',
                    }),
                    name: `${intl.formatMessage({
                      id: 'payandSettle.creditApplication.components.detailInfo.avatarWrap.name',
                    })}${quotaInfo && quotaInfo.member ? quotaInfo.member.applyNo : ''}`,
                  }}
                  extra={quotaInfo && quotaInfo.member ? quotaInfo.member.levelTag || '' : ''}
                />
              }
              extra={
                <>
                  {isEdit && (
                    <Button type="primary" onClick={handleSubmit} loading={submitLoading}>
                      {intl.formatMessage({ id: 'payandSettle.creditApplication.components.detailInfo.extra' })}
                    </Button>
                  )}
                </>
              }
            >
              <Descriptions
                size="small"
                column={3}
                style={{
                  padding: '0 32px',
                }}
              >
                <Descriptions.Item
                  label={intl.formatMessage({
                    id: 'payandSettle.creditApplication.components.detailInfo.descriptions.1',
                  })}
                >
                  {quotaInfo?.member?.parentMemberName}
                </Descriptions.Item>
                <Descriptions.Item
                  label={intl.formatMessage({
                    id: 'payandSettle.creditApplication.components.detailInfo.descriptions.2',
                  })}
                >
                  {quotaInfo?.member?.memberTypeName}
                </Descriptions.Item>
                <Descriptions.Item
                  label={intl.formatMessage({
                    id: 'payandSettle.creditApplication.components.detailInfo.descriptions.3',
                  })}
                >
                  {quotaInfo?.member?.roleName}
                </Descriptions.Item>
                <Descriptions.Item
                  label={intl.formatMessage({
                    id: 'payandSettle.creditApplication.components.detailInfo.descriptions.4',
                  })}
                >
                  <StatusTag
                    type={CREDIT_STATUS_TAG_MAP[quotaInfo && quotaInfo.member ? quotaInfo.member.status : 'default']}
                    title={quotaInfo && quotaInfo.member ? CREDIT_STATUS[quotaInfo.member.status] : ''}
                  />
                </Descriptions.Item>
                <Descriptions.Item
                  label={intl.formatMessage({
                    id: 'payandSettle.creditApplication.components.detailInfo.descriptions.5',
                  })}
                >
                  <StatusTag
                    type={CREDIT_OUTER_STATUS_TAG_MAP[quotaInfo?.member.outerStatus]}
                    title={CREDIT_OUTER_STATUS[quotaInfo?.member.outerStatus]}
                  />
                </Descriptions.Item>
                <Descriptions.Item
                  label={intl.formatMessage({
                    id: 'payandSettle.creditApplication.components.detailInfo.descriptions.6',
                  })}
                >
                  <Badge
                    color={CREDIT_INNER_STATUS_BADGE_MAP_PURCHASER[quotaInfo?.member.innerStatus] || '#606266'}
                    text={quotaInfo?.member.innerStatusName}
                  />
                </Descriptions.Item>
              </Descriptions>
            </PageHeader>
          </>
        }
      >
        <Suspense fallback={null}>
          <OuterCirculation
            steps={
              quotaInfo && quotaInfo.outerTaskList
                ? quotaInfo.outerTaskList.map((item) => ({
                    title: item.taskName,
                    description: item.roleName,
                  }))
                : []
            }
            current={
              quotaInfo && quotaInfo.outerTaskList
                ? quotaInfo && quotaInfo.outerTaskList.findIndex((item) => item.isExecute === 0)
                : 0
            }
          />
        </Suspense>

        <Suspense fallback={null}>
          <QuotaApplicationInfo
            quotaInfo={{
              originalQuota: quotaInfo?.apply.originalQuota,
              applyQuota: quotaValues.applyQuota,
              billDay: quotaValues.billDay,
              repayPeriod: quotaValues.repayPeriod,
              applyTime: quotaInfo?.apply.applyTime,
              fileList: quotaValues.fileList,
            }}
            verify={
              quotaInfo && quotaInfo.verify && isNumber(quotaInfo.verify.quota)
                ? {
                    quota: quotaInfo?.verify?.quota,
                    billDay: quotaInfo?.verify?.billDay,
                    repayPeriod: quotaInfo?.verify?.repayPeriod,
                    verifyTime: quotaInfo?.verify?.verifyTime,
                    maxApplyQuota: quotaInfo?.verify?.maxApplyQuota,
                  }
                : null
            }
            editable={isEdit}
            onSubmit={handleQuotaSubmit}
          />
        </Suspense>

        <Suspense fallback={null}>
          <HitoryList dataSource={quotaInfo?.historyApplyList} target={target} />
        </Suspense>

        <Suspense fallback={null}>
          <OuterCirculationRecord dataSource={quotaInfo?.outerVerifyRecordList} />
        </Suspense>
      </PageHeaderWrapper>
    </Spin>
  )
}

export default DetailInfo
