import React from 'react'
import {
  getAftersalesReturnGoodsGetDetailBySupplier,
  getAftersalesReturnGoodsPageInnerWorkflowRecord,
  getAftersalesReturnGoodsPageOuterWorkflowRecord,
} from '@apps/apis'
import { usePageStatus } from '@/hooks/usePageStatus'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import AsReturnProfile, { AsReturnInfo } from '../components/AsReturnProfile'
import { InnerHistoryData, OuterHistoryData } from '../../components/FlowRecords'

const ReturnQueryDetail: React.FC = () => {
  const { id } = usePageStatus()
  const { data, loading } = useHttpRequest<AsReturnInfo>(
    () => getAftersalesReturnGoodsGetDetailBySupplier({ returnId: id }),
    {
      manual: false,
    },
  )

  const fetchOuterHistory = (params): Promise<OuterHistoryData> => {
    return new Promise((resolve, reject) => {
      getAftersalesReturnGoodsPageOuterWorkflowRecord({
        ...params,
        dataId: id,
      })
        .then((res) => {
          if (res.code === 1000) {
            resolve(res.data)
          }
          reject(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  const fetchInnerHistory = (params): Promise<InnerHistoryData> => {
    return new Promise((resolve, reject) => {
      getAftersalesReturnGoodsPageInnerWorkflowRecord({
        ...params,
        dataId: id,
      })
        .then((res) => {
          if (res.code === 1000) {
            resolve(res.data)
          }
          reject(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  return (
    <AsReturnProfile
      data={data}
      loading={loading}
      orderDetailedPrefix="/afterAbility/returnManage/returnQuery"
      fetchOuterHistory={fetchOuterHistory}
      fetchInnerHistory={fetchInnerHistory}
    />
  )
}

export default ReturnQueryDetail
