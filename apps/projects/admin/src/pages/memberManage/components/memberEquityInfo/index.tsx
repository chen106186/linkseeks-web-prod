import React, { useEffect, useState } from 'react'
import { Spin } from 'antd'
import { usePageStatus } from '@/hooks/usePageStatus'
import {
  getMemberMaintenanceDetailRightBasic,
  GetMemberMaintenanceDetailRightBasicResponse,
  getMemberMaintenanceDetailRightHistoryPage,
  getMemberMaintenanceDetailRightSpendHistoryPage,
} from '@apps/apis'
import Info, { ReceivedData, UsageData } from '../EquityInfo'

const EquityInfo: React.FC<{}> = () => {
  const { id, validateId } = usePageStatus()
  const [equityInfo, setEquityInfo] = useState<GetMemberMaintenanceDetailRightBasicResponse>()
  const [infoLoading, setInfoLoading] = useState(false)

  const getEquityInfo = () => {
    setInfoLoading(true)
    getMemberMaintenanceDetailRightBasic({
      memberId: id,
      validateId,
    })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        setEquityInfo(res.data)
      })
      .catch((err) => {
        console.warn(err)
      })
      .finally(() => {
        setInfoLoading(false)
      })
  }

  useEffect(() => {
    getEquityInfo()
  }, [])

  const getReceivedList = (params) => {
    return new Promise<{ data: ReceivedData[]; totalCount: number }>((resolve, reject) => {
      getMemberMaintenanceDetailRightHistoryPage({
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

  const getUsageList = (params) => {
    return new Promise<{ data: UsageData[]; totalCount: number }>((resolve, reject) => {
      getMemberMaintenanceDetailRightSpendHistoryPage({
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
    <Spin spinning={infoLoading}>
      <Info
        equityInfo={{
          sumReturnMoney: equityInfo?.sumReturnMoney,
          sumUsedPoint: equityInfo?.sumUsedPoint,
          sumPoint: equityInfo?.sumPoint,
          rights: equityInfo?.rights,
        }}
        fetchReceivedList={getReceivedList}
        fetchUsageList={getUsageList}
      />
    </Spin>
  )
}

export default EquityInfo
