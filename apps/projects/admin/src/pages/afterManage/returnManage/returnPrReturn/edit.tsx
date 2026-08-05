import React, { useRef } from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import {
  getAftersalesReturnGoodsGetDetailPlatform,
  getAftersalesReturnGoodsPageOuterWorkflowRecord,
  postAftersalesReturnGoodsRefund,
} from '@apps/apis'
import { IProps as FlowRecordsProps } from '@/components/FlowRecords'
import fetchDetailHoc from '../common/hoc/fetchDetailHoc'
import ReturnProfile, { ReturnProfileRefHandle } from '../components/ReturnProfile'

const ReturnVerify: React.FC = () => {
  const { id } = usePageStatus()

  const profileRef = useRef<ReturnProfileRefHandle | null>(null)

  const ReturnProfilePro = fetchDetailHoc(
    {
      fetchDetail: () =>
        getAftersalesReturnGoodsGetDetailPlatform({
          returnId: id,
        }),
    },
    ReturnProfile,
  )

  const fetchOuterHistory: FlowRecordsProps['fetchOuterList'] = (params) => {
    return new Promise((resolve) => {
      getAftersalesReturnGoodsPageOuterWorkflowRecord({
        current: `${params.current}`,
        pageSize: `${params.pageSize}`,
        dataId: id,
      }).then((res) => {
        if (res.code === 1000) {
          resolve(res.data)
        }
      })
    })
  }

  // 退款
  const handleRefund = (values): Promise<any> => {
    const { id, refundAmount, ...rest } = values
    return postAftersalesReturnGoodsRefund({
      dataId: id,
      ...rest,
    }).then((res) => {
      if (res.code === 1000) {
        profileRef.current?.refresh?.()
      }
    })
  }

  return (
    <ReturnProfilePro
      fetchOuterHistory={fetchOuterHistory}
      onRefund={handleRefund}
      ref={profileRef}
      editableDetailInfo
    />
  )
}

export default ReturnVerify
