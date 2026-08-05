/*
 * @Author: XieZhiXiong
 * @Date: 2020-12-18 17:44:26
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-01-22 13:54:53
 * @Description:
 */
import React, { useRef } from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { getAftersalesReturnGoodsGetDetailPlatform, getAftersalesReturnGoodsPageOuterWorkflowRecord } from '@apps/apis'
import { IProps as FlowRecordsProps } from '@/components/FlowRecords'
import fetchDetailHoc from '../common/hoc/fetchDetailHoc'
import ReturnProfile from '../components/ReturnProfile'

const ReturnPrReturnDetailInfo: React.FC = () => {
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

export default ReturnPrReturnDetailInfo
