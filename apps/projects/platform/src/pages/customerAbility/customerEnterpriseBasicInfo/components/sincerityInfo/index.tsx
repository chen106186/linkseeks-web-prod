/*
 * @Description: 供应商信用信息详情
 */
import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Row, Col } from 'antd'
import {
  getMemberCustomerAbilityInfoDetailCreditAftersaleHistoryPage,
  getMemberCustomerAbilityInfoDetailCreditAftersaleSummary,
  getMemberCustomerAbilityInfoDetailCreditBasic,
  getMemberCustomerAbilityInfoDetailCreditComplainHistoryPage,
  getMemberCustomerAbilityInfoDetailCreditComplainSummary,
  getMemberCustomerAbilityInfoDetailCreditTradeHistoryPage,
  getMemberCustomerAbilityInfoDetailCreditTradeSummary,
} from '@apps/apis'
import MemberDetailsContext from '../../../memberDetailsContext'
import MemberSincerityAnalysis from '../../../components/MemberSincerityAnalysis'
import MemberEvaluation, { EstimateSumItems, ListItem } from '../../../components/MemberEvaluation'
import MemberFeedbackRecords, {
  ListItem as FeedbackItem,
  AnalysisData,
} from '../../../components/MemberFeedbackRecords'

export interface BasicInfo {
  pieData: {
    x: string
    y: number
  }[]
  items: {
    id: number
    creditTypeName: string
    remark: string
    creditPoint: number
    currentPoint: number
  }[]
  loading?: boolean
}

const MemberSincerityInfo: React.FC<any> = (props) => {
  const { validateId } = props
  const [basicInfo, setBasicInfo] = useState<BasicInfo>(null)
  const [basicInfoLoading, setBasicInfoLoading] = useState(false)
  const [orderEstimateSum, setOrderEstimateSum] = useState<EstimateSumItems[]>([])
  const [orderEstimateSumLoading, setOrderEstimateSumLoading] = useState(false)
  const [afterServiceEstimateSum, setAfterServiceEstimateSum] = useState<EstimateSumItems[]>([])
  const [afterServiceEstimateSumLoading, setAfterServiceEstimateSumLoading] = useState(false)
  const [feedbackSum, setFeedbackSum] = useState<AnalysisData>({
    last7days: 0,
    last30days: 0,
    last180days: 0,
    before180days: 0,
    sum: 0,
  })
  const contenxt = useContext(MemberDetailsContext)

  const intl = useIntl()

  const getBasicInfo = () => {
    setBasicInfoLoading(true)
    getMemberCustomerAbilityInfoDetailCreditBasic({
      validateId,
    })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        const { tradeCommentPoint, afterSaleCommentPoint, complainPoint, registerYearsPoint, configs } = res.data || {}
        const pieData = [
          {
            x: intl.formatMessage({ id: 'member.management.maintain.detail.sincerityInfo.tradeCommentPoint' }),
            y: tradeCommentPoint || 0,
          },
          {
            x: intl.formatMessage({ id: 'member.management.maintain.detail.sincerityInfo.afterSaleCommentPoint' }),
            y: afterSaleCommentPoint || 0,
          },
          {
            x: intl.formatMessage({ id: 'member.management.maintain.detail.sincerityInfo.complainPoint' }),
            y: complainPoint || 0,
          },
          {
            x: intl.formatMessage({ id: 'member.management.maintain.detail.sincerityInfo.registerYearsPoint' }),
            y: registerYearsPoint || 0,
          },
        ]
        setBasicInfo({
          pieData,
          items: configs,
        })
      })
      .catch((err) => {
        console.warn(err)
      })
      .finally(() => {
        setBasicInfoLoading(false)
      })
  }

  // 交易评价汇总
  const getOrderEstimateSum = () => {
    setOrderEstimateSumLoading(true)
    getMemberCustomerAbilityInfoDetailCreditTradeSummary({
      validateId,
    })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        const { rows = [] } = res.data || {}
        setOrderEstimateSum(rows)
      })
      .catch((err) => {
        console.warn(err)
      })
      .finally(() => {
        setOrderEstimateSumLoading(false)
      })
  }

  // 售后评价汇总
  const getAfterEstimateSum = () => {
    setAfterServiceEstimateSumLoading(true)
    getMemberCustomerAbilityInfoDetailCreditAftersaleSummary({
      validateId,
    })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        const { rows = [] } = res.data || {}
        setAfterServiceEstimateSum(rows)
      })
      .catch((err) => {
        console.warn(err)
      })
      .finally(() => {
        setAfterServiceEstimateSumLoading(false)
      })
  }

  // 反馈汇总
  const getFeedbackSum = () => {
    getMemberCustomerAbilityInfoDetailCreditComplainSummary({
      validateId,
    })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        setFeedbackSum(res.data)
      })
      .catch((err) => {
        console.warn(err)
      })
  }

  useEffect(() => {
    getBasicInfo()
    getOrderEstimateSum()
    getAfterEstimateSum()
    getFeedbackSum()
  }, [])

  useEffect(() => {
    const anchors = [
      {
        key: 'basicInfo',
        label: intl.formatMessage({ id: 'customerAbility.management.maintain.basic' }),
      },
      {
        key: 'orderEvaluation',
        label: intl.formatMessage({ id: 'customerAbility.management.maintain.detail.orderEvaluation' }),
      },
      {
        key: 'afterServiceEvaluation',
        label: intl.formatMessage({ id: 'customerAbility.management.maintain.detail.afterServiceEvaluation' }),
      },
      {
        key: 'feedbackRecords',
        label: intl.formatMessage({ id: 'customerAbility.management.maintain.detail.feedbackRecords' }),
      },
    ]
    contenxt?.onAnchorsReady(anchors)
  }, [])

  // 交易评论历史记录
  const getOrderEvaluationList = (params) => {
    return new Promise<{ data: ListItem[]; totalCount: number }>((resolve, reject) => {
      getMemberCustomerAbilityInfoDetailCreditTradeHistoryPage({
        validateId,
        ...params,
      })
        .then((res) => {
          const { data = [], totalCount = 0 } = res.data
          resolve({ data, totalCount })
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  // 售后评论历史记录
  const getAfterServiceEvaluationList = (params) => {
    return new Promise<{ data: ListItem[]; totalCount: number }>((resolve, reject) => {
      getMemberCustomerAbilityInfoDetailCreditAftersaleHistoryPage({
        validateId,
        ...params,
      })
        .then((res) => {
          const { data = [], totalCount = 0 } = res.data
          resolve({ data, totalCount })
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  // 反馈历史记录
  const getFeedbackList = (params) => {
    return new Promise<{ data: FeedbackItem[]; totalCount: number }>((resolve, reject) => {
      getMemberCustomerAbilityInfoDetailCreditComplainHistoryPage({
        validateId,
        ...params,
      })
        .then((res) => {
          const { data = [], totalCount = 0 } = res.data
          resolve({ data, totalCount })
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  return (
    <>
      <Row gutter={[16, 16]}>
        {/* 基本信息 */}
        <Col span={24}>
          <div id="basicInfo">
            <MemberSincerityAnalysis
              creditData={basicInfo?.pieData}
              integralItems={basicInfo?.items}
              loading={basicInfoLoading}
            />
          </div>
        </Col>

        {/* 交易评价 */}
        <Col span={24}>
          <div id="orderEvaluation">
            <MemberEvaluation
              title={intl.formatMessage({ id: 'member.management.maintain.detail.orderEvaluation' })}
              analysis={orderEstimateSum}
              loading={orderEstimateSumLoading}
              fetchEvaluationList={getOrderEvaluationList}
            />
          </div>
        </Col>

        {/* 售后评价 */}
        <Col span={24}>
          <div id="afterServiceEvaluation">
            <MemberEvaluation
              title={intl.formatMessage({ id: 'member.management.maintain.detail.afterServiceEvaluation' })}
              analysis={afterServiceEstimateSum}
              loading={afterServiceEstimateSumLoading}
              fetchEvaluationList={getAfterServiceEvaluationList}
            />
          </div>
        </Col>

        {/* 反馈记录 */}
        <Col span={24}>
          <div id="feedbackRecords">
            <MemberFeedbackRecords analysis={feedbackSum} fetchList={getFeedbackList} />
          </div>
        </Col>
      </Row>
    </>
  )
}

export default MemberSincerityInfo
