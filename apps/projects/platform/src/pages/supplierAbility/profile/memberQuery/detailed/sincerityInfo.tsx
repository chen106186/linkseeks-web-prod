/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-06 11:36:35
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 18:39:41
 * @Description: 会员信用信息详情
 */
import React, { useEffect, useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Row, Col } from 'antd'
import {
  getMemberSupplierAbilityInfoDetailCreditAftersaleHistoryPage,
  getMemberSupplierAbilityInfoDetailCreditAftersaleSummary,
  getMemberSupplierAbilityInfoDetailCreditBasic,
  getMemberSupplierAbilityInfoDetailCreditComplainHistoryPage,
  getMemberSupplierAbilityInfoDetailCreditComplainSummary,
  getMemberSupplierAbilityInfoDetailCreditTradeHistoryPage,
  getMemberSupplierAbilityInfoDetailCreditTradeSummary,
} from '@apps/apis'
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

  const intl = useIntl()

  const getBasicInfo = () => {
    setBasicInfoLoading(true)
    getMemberSupplierAbilityInfoDetailCreditBasic({
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
    getMemberSupplierAbilityInfoDetailCreditTradeSummary({
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
    getMemberSupplierAbilityInfoDetailCreditAftersaleSummary({
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
    getMemberSupplierAbilityInfoDetailCreditComplainSummary({
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

  // 交易评论历史记录
  const getOrderEvaluationList = (params) => {
    return new Promise<{ data: ListItem[]; totalCount: number }>((resolve, reject) => {
      getMemberSupplierAbilityInfoDetailCreditTradeHistoryPage({
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
      getMemberSupplierAbilityInfoDetailCreditAftersaleHistoryPage({
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
      getMemberSupplierAbilityInfoDetailCreditComplainHistoryPage({
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
