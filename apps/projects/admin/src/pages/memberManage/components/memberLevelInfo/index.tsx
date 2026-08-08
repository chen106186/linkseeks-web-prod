import React, { useState, useEffect } from 'react'
import { Spin } from 'antd'
import { usePageStatus } from '@/hooks/usePageStatus'
import Info, { DataProps } from '../LevelInfo'
import {
  getMemberMaintenanceDetailLevelBasic,
  getMemberMaintenanceDetailLevelHistoryPage,
  GetMemberMaintenanceDetailLevelBasicResponse,
} from '@apps/apis'

const LevelInfo: React.FC<{}> = () => {
  const { id, validateId } = usePageStatus()
  const [levelInfo, setLevelInfo] = useState<GetMemberMaintenanceDetailLevelBasicResponse>()
  const [infoLoading, setInfoLoading] = useState(false)

  const getMemberLevelInfo = () => {
    if (!id && !validateId) {
      return
    }
    setInfoLoading(true)
    getMemberMaintenanceDetailLevelBasic({
      memberId: id,
      validateId,
    })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        setLevelInfo(res.data)
      })
      .catch((err) => {
        console.warn(err)
      })
      .finally(() => {
        setInfoLoading(false)
      })
  }

  useEffect(() => {
    getMemberLevelInfo()
  }, [])

  const getHistroyList = (params) => {
    return new Promise<{ data: DataProps[]; totalCount: number }>((resolve, reject) => {
      getMemberMaintenanceDetailLevelHistoryPage({
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
        levelInfo={{
          level: levelInfo?.levelTag,
          score: levelInfo?.score,
          nextLevel: levelInfo?.nextLevelTag,
          nextScore: levelInfo?.nextScore,
        }}
        chartData={levelInfo?.points}
        fetchList={getHistroyList}
      />
    </Spin>
  )
}

export default LevelInfo
