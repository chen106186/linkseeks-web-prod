import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { getAftersalesReturnGoodsGetDetailPlatform, getAftersalesReturnGoodsPageOuterWorkflowRecord } from '@apps/apis'
import { IProps as FlowRecordsProps } from '@/components/FlowRecords'
import fetchDetailHoc from '../common/hoc/fetchDetailHoc'
import ReturnProfile from '../components/ReturnProfile'

const ReturnQueryDetail: React.FC = () => {
  const { id } = usePageStatus()

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

  return <ReturnProfilePro fetchOuterHistory={fetchOuterHistory} isPurchaser />
}

export default ReturnQueryDetail
