import React, { useEffect, useState } from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import Info, { BasicInfo, ComplaintSum, EstimateSum, SalesProps, ComplaintProps } from '../SincerityInfo'
import {
  getMemberMaintenanceDetailCreditAftersaleHistoryPage,
  getMemberMaintenanceDetailCreditAftersaleSummary,
  getMemberMaintenanceDetailCreditBasic,
  getMemberMaintenanceDetailCreditComplainHistoryPage,
  getMemberMaintenanceDetailCreditComplainSummary,
  getMemberMaintenanceDetailCreditTradeHistoryPage,
  getMemberMaintenanceDetailCreditTradeSummary,
} from '@apps/apis'

const SincerityInfo: React.FC<{}> = () => {
  const { id, validateId } = usePageStatus()
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({ pieData: [], items: [] })
  const [infoLoading, setInfoLoading] = useState(false)
  const [salesEstimateSum, setSalesEstimateSum] = useState<EstimateSum>({ dataSource: [] })
  const [salesEstimateSumLoading, setSalesEstimateSumLoading] = useState(false)
  const [afterEstimateSum, setAfterEstimateSum] = useState<EstimateSum>({ dataSource: [] })
  const [afterEstimateSumLoading, setAfterEstimateSumLoading] = useState(false)
  const [complainSum, setComplainSum] = useState<ComplaintSum>({ dataSource: {} })
  const [complainSumLoading, setComplainSumLoading] = useState(false)

  const getBasicInfo = () => {
    setInfoLoading(true)
    getMemberMaintenanceDetailCreditBasic({
      memberId: id,
      validateId,
    })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        const { tradeCommentPoint, afterSaleCommentPoint, complainPoint, registerYearsPoint, configs } = res.data || {}
        const pieData = [
          {
            x: '交易评价积分',
            y: tradeCommentPoint || 0,
          },
          {
            x: '售后评价积分',
            y: afterSaleCommentPoint || 0,
          },
          {
            x: '投诉扣分',
            y: complainPoint || 0,
          },
          {
            x: '入驻年数积分',
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
        setInfoLoading(false)
      })
  }

  // 交易评价汇总
  const getSalesEstimateSum = () => {
    setSalesEstimateSumLoading(true)
    getMemberMaintenanceDetailCreditTradeSummary({
      memberId: id,
      validateId,
    })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        const { rows = [] } = res.data || {}

        setSalesEstimateSum({
          dataSource: rows,
        })
      })
      .catch((err) => {
        console.warn(err)
      })
      .finally(() => {
        setSalesEstimateSumLoading(false)
      })
  }

  // 售后评价汇总
  const getAfterEstimateSum = () => {
    setAfterEstimateSumLoading(true)
    getMemberMaintenanceDetailCreditAftersaleSummary({
      memberId: id,
      validateId,
    })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        const { rows = [] } = res.data || {}

        setAfterEstimateSum({
          dataSource: rows,
        })
      })
      .catch((err) => {
        console.warn(err)
      })
      .finally(() => {
        setAfterEstimateSumLoading(false)
      })
  }

  // 投诉汇总
  const getComplaintSum = () => {
    setComplainSumLoading(true)
    getMemberMaintenanceDetailCreditComplainSummary({
      memberId: id,
      validateId,
    })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        setComplainSum({
          dataSource: res.data,
        })
      })
      .catch((err) => {
        console.warn(err)
      })
      .finally(() => {
        setComplainSumLoading(false)
      })
  }

  useEffect(() => {
    getBasicInfo()
    getSalesEstimateSum()
    getAfterEstimateSum()
    getComplaintSum()
  }, [])

  // 交易评论历史记录
  const getSalesList = (params) => {
    return new Promise<{ data: SalesProps[]; totalCount: number }>((resolve, reject) => {
      getMemberMaintenanceDetailCreditTradeHistoryPage({
        memberId: id,
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
  const getAfterList = (params) => {
    return new Promise<{ data: SalesProps[]; totalCount: number }>((resolve, reject) => {
      getMemberMaintenanceDetailCreditAftersaleHistoryPage({
        memberId: id,
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

  // 投诉历史记录
  const getComplaintList = (params) => {
    return new Promise<{ data: ComplaintProps[]; totalCount: number }>((resolve, reject) => {
      getMemberMaintenanceDetailCreditComplainHistoryPage({
        memberId: id,
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
    <div>
      <Info
        basicInfo={{
          ...basicInfo,
          loading: infoLoading,
        }}
        salesEstimateSum={{
          ...salesEstimateSum,
          loading: salesEstimateSumLoading,
        }}
        fetchSalesList={getSalesList}
        afterEstimateSum={{
          ...afterEstimateSum,
          loading: afterEstimateSumLoading,
        }}
        fetchAfterList={getAfterList}
        complaintSum={{
          ...complainSum,
          loading: complainSumLoading,
        }}
        fetchComplaintList={getComplaintList}
      />
    </div>
  )
}

export default SincerityInfo
