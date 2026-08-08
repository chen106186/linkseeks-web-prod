import React, { Suspense, useEffect, useState } from 'react'
import { PageHeader, Descriptions, Spin, Badge } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { isNumber } from 'lodash'
import {
  getPayCreditHandleGetApplyDetail,
  GetPayCreditHandleGetApplyDetailResponse,
  postPayCreditHandleUpdateVerify,
} from '@apps/apis'
import {
  CREDIT_INNER_STATUS,
  CREDIT_OUTER_STATUS,
  CREDIT_STATUS,
  CREDIT_INNER_STATUS_UNCOMMITTED,
} from '@/constants/payment'
import { normalizeFiledata, FileData, findLastIndexFlowState } from '@/utils'
import { PageHeaderWrapper } from '@apps/components'
import AvatarWrap from '@/components/AvatarWrap'
import StatusTag from '@/components/StatusTag'
import AuditProcess from '@/components/AuditProcess'
import { CREDIT_STATUS_TAG_MAP, CREDIT_OUTER_STATUS_TAG_MAP, CREDIT_INNER_STATUS_BADGE_MAP } from '../../../constant'
import { QuotaInfoData, VerifyData } from '../QuotaApplicationInfo'

const QuotaApplicationInfo = React.lazy(() => import('../QuotaApplicationInfo'))
const HitoryList = React.lazy(() => import('../HistoryList'))
const FlowRecords = React.lazy(() => import('../FlowRecords'))

interface QuotaValues {
  /**
   * 审批额度
   */
  quota: number | undefined
  /**
   * 申请调整账单日期
   */
  billDay: number | undefined
  /**
   * 申请还款周期
   */
  repayPeriod: number | undefined
}

interface DetailInfoProps {
  /**
   * 申请id
   */
  id: string
  /**
   * 授信id
   */
  creditId: string
  /**
   * 审批信息是否可编辑
   */
  approvalEditable?: boolean
  /**
   * 历史记录目标路径
   */
  target?: string
  /**
   * 头部右侧拓展
   */
  headExtra?: (info: QuotaInfo) => React.ReactNode
}

interface QuotaInfo extends GetPayCreditHandleGetApplyDetailResponse {
  quotaInfo: QuotaInfoData
  verify: VerifyData
}

const DetailInfo: React.FC<DetailInfoProps> = (props) => {
  const intl = useIntl()
  const { id, creditId, approvalEditable = false, target, headExtra } = props
  const [quotaInfo, setQuotaInfo] = useState<QuotaInfo>(null)
  const [infoLoading, setInfoloading] = useState(false)

  // 获取授信详情
  const getQuotaInfo = () => {
    if (!id) {
      return
    }
    setInfoloading(true)
    getPayCreditHandleGetApplyDetail({
      applyId: id,
      creditId,
    })
      .then((res) => {
        if (res.code === 1000) {
          const { verify, apply } = res.data

          const quotaValuesData: QuotaValues = {
            quota: undefined,
            billDay: undefined,
            repayPeriod: undefined,
          }

          // 审批信息不存在 或者 审批信息里边 审批额度不存在
          // 说明没有 修改过 审批信息，手动赋值 授信申请里的数据
          if (
            (!verify || !isNumber(verify.quota)) &&
            res.data?.member?.innerStatus === CREDIT_INNER_STATUS_UNCOMMITTED
          ) {
            quotaValuesData.quota = apply?.applyQuota
            quotaValuesData.billDay = apply?.billDay
            quotaValuesData.repayPeriod = apply?.repayPeriod
          }

          // 如果有审批信息则直接赋值 审批信息
          if (verify && isNumber(verify.quota)) {
            quotaValuesData.quota = verify.quota
            quotaValuesData.billDay = verify.billDay
            quotaValuesData.repayPeriod = verify.repayPeriod
          }

          setQuotaInfo({
            ...res.data,
            quotaInfo: {
              originalQuota: res.data?.apply?.originalQuota,
              applyQuota: res.data?.apply?.applyQuota,
              billDay: res.data?.apply?.billDay,
              repayPeriod: res.data?.apply?.repayPeriod,
              applyTime: res.data?.apply?.applyTime,
              fileList: res.data?.apply?.fileList
                ? res.data.apply.fileList.map((item) => normalizeFiledata(item.fileUrl))
                : [],
              applyType: res.data?.apply?.applyType,
            },
            verify: isNumber(quotaValuesData.quota)
              ? {
                  quota: quotaValuesData.quota,
                  billDay: quotaValuesData.billDay,
                  repayPeriod: quotaValuesData.repayPeriod,
                  verifyTime: verify?.verifyTime,
                  maxApplyQuota: verify?.maxApplyQuota,
                }
              : null,
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

  // 调整审批信息
  const handleQuotaSubmit = (values) => {
    if (!id) {
      return
    }

    return new Promise<void>((resolve, reject) => {
      postPayCreditHandleUpdateVerify({
        applyId: id,
        ...values,
      })
        .then((res) => {
          if (res.code === 1000) {
            setQuotaInfo({
              ...quotaInfo,
              verify: {
                ...quotaInfo.verify,
                ...values,
              },
            })
            resolve()
          }
          reject()
        })
        .catch(() => {
          reject()
        })
    })
  }

  return (
    <Spin spinning={infoLoading}>
      <PageHeaderWrapper
        backDom={false}
        title={
          <>
            <PageHeader
              style={{ padding: '0' }}
              onBack={() => history.goBack()}
              title={
                <AvatarWrap
                  info={{
                    aloneTxt: intl.formatMessage({
                      id: 'payandSettle.creditManage.components.detailInfo.avatarWrap.aloneTxt',
                    }),
                    name: `${intl.formatMessage({
                      id: 'payandSettle.creditManage.components.detailInfo.avatarWrap.name',
                    })}${quotaInfo && quotaInfo.member ? quotaInfo.member.applyNo : ''}`,
                  }}
                  extra={quotaInfo?.member?.levelTag}
                />
              }
              extra={<>{headExtra && headExtra(quotaInfo)}</>}
            >
              <Descriptions
                size="small"
                column={3}
                style={{
                  padding: '0 32px',
                }}
              >
                <Descriptions.Item
                  label={intl.formatMessage({ id: 'payandSettle.creditManage.components.detailInfo.descriptions.1' })}
                >
                  {quotaInfo?.member.memberName}
                </Descriptions.Item>
                <Descriptions.Item
                  label={intl.formatMessage({ id: 'payandSettle.creditManage.components.detailInfo.descriptions.2' })}
                >
                  {quotaInfo?.member.memberTypeName}
                </Descriptions.Item>
                <Descriptions.Item
                  label={intl.formatMessage({ id: 'payandSettle.creditManage.components.detailInfo.descriptions.3' })}
                >
                  {quotaInfo?.member.roleName}
                </Descriptions.Item>
                <Descriptions.Item
                  label={intl.formatMessage({ id: 'payandSettle.creditManage.components.detailInfo.descriptions.4' })}
                >
                  <StatusTag
                    type={CREDIT_STATUS_TAG_MAP[quotaInfo && quotaInfo.member ? quotaInfo.member.status : 'default']}
                    title={quotaInfo && quotaInfo.member ? CREDIT_STATUS[quotaInfo.member.status] : ''}
                  />
                </Descriptions.Item>
                <Descriptions.Item
                  label={intl.formatMessage({ id: 'payandSettle.creditManage.components.detailInfo.descriptions.5' })}
                >
                  <StatusTag
                    type={CREDIT_OUTER_STATUS_TAG_MAP[quotaInfo?.member.outerStatus]}
                    title={CREDIT_OUTER_STATUS[quotaInfo?.member.outerStatus]}
                  />
                </Descriptions.Item>
                <Descriptions.Item
                  label={intl.formatMessage({ id: 'payandSettle.creditManage.components.detailInfo.descriptions.6' })}
                >
                  <Badge
                    color={CREDIT_INNER_STATUS_BADGE_MAP[quotaInfo?.member.innerStatus] || '#606266'}
                    text={quotaInfo?.member.innerStatusName}
                  />
                </Descriptions.Item>
              </Descriptions>
            </PageHeader>
          </>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <AuditProcess
            outerVerifySteps={
              quotaInfo && quotaInfo.outerTaskList
                ? quotaInfo.outerTaskList.map((item) => ({
                    step: item.step,
                    stepName: item.taskName,
                    roleName: item.roleName,
                    status: item.isExecute ? 'finish' : 'wait',
                  }))
                : []
            }
            outerVerifyCurrent={findLastIndexFlowState(quotaInfo?.outerTaskList)}
            innerVerifySteps={
              quotaInfo && quotaInfo.innerTaskList
                ? quotaInfo.innerTaskList.map((item) => ({
                    step: item.step,
                    stepName: item.taskName,
                    roleName: item.roleName,
                    status: item.isExecute ? 'finish' : 'wait',
                  }))
                : []
            }
            innerVerifyCurrent={findLastIndexFlowState(quotaInfo?.innerTaskList)}
          />
        </div>

        <Suspense fallback={null}>
          <QuotaApplicationInfo
            editable={approvalEditable}
            quotaInfo={quotaInfo?.quotaInfo}
            verify={quotaInfo?.verify}
            onSubmit={handleQuotaSubmit}
          />
        </Suspense>

        <Suspense fallback={null}>
          <HitoryList dataSource={quotaInfo?.historyApplyList} target={target} />
        </Suspense>

        <Suspense fallback={null}>
          {/* 授信申请类型为 外部 = 1 才有 外部流转记录 */}
          <FlowRecords
            outerHistory={
              quotaInfo && quotaInfo.outerVerifyRecordList && quotaInfo.apply && quotaInfo.apply.applyType === 1
                ? quotaInfo.outerVerifyRecordList
                : null
            }
            innerHistory={quotaInfo?.innerVerifyRecordList}
          />
        </Suspense>
      </PageHeaderWrapper>
    </Spin>
  )
}

export default React.memo(DetailInfo)
