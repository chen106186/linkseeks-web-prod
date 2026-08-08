import GlobalWrapper from '@/components/GlobalWrapper'
/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-03 19:46:04
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-11 14:47:02
 * @Description: 确认退款结果
 */
import React, { useState, useEffect } from 'react'
import { View } from '@apps/mobile-ui'
import { getCurrentInstance, preload } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import {
  getAftersalesMobileReturnGoodsGetDetailByConsumer,
  GetAftersalesMobileReturnGoodsGetDetailByConsumerResponse,
} from '@apps/apis'
import Gap from '../../../../afterRecords/components/Gap'
import RefundList, { DataItem } from '../../../../afterRecords/refundRecords/components/RefundList'
import AsPageHeader from '../../../../afterRecords/components/AsPageHeader'
import styles from './index.module.scss'
type RouteParams = {
  /**
   * 数据id
   */
  returnId: string
  /**
   * 是否可编辑的，这里用来区分是 提交/修改 操作
   */
  isEdit: string
  /**
   * 提交成功之后会回调的函数，通常会用作 重新请求数据
   */
  onRefresh: () => void
}
export interface DetailsData extends GetAftersalesMobileReturnGoodsGetDetailByConsumerResponse {}
const RefundConfirmResult: React.FC = () => {
  const params = getCurrentInstance().preloadData as RouteParams
  const [details, setDetails] = useState<DetailsData>()
  const [loading, setLoading] = useState(false)
  const intl = useIntl()
  const getDetails = () => {
    if (!params.returnId || loading) {
      return
    }
    setLoading(true)
    getAftersalesMobileReturnGoodsGetDetailByConsumer({
      replaceId: `${params.returnId}`,
    })
      .then((res) => {
        if (res.code === 1000) {
          setDetails(res.data)
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false)
      })
  }
  useEffect(() => {
    getDetails()
  }, [])
  const handleConfirmRefundTransferred = (record: DataItem) => {
    preload({
      data: record.detailList,
      onRefresh: () => {
        if (params.onRefresh) {
          params.onRefresh()
        }
        getDetails()
      },
    })
    Router.navigateTo('afterService/afterTodo/refundPrConfirmResult/refundConfirmTransferred')
  }
  return (
    <View className={styles['refund-confirm-result']}>
      <AsPageHeader
        title={intl.formatMessage({
          id: 'refundTodo.refundConfirmResult.nav',
          defaultMessage: '待确认退款结果',
        })}
      >
        <RefundList
          data={details && details.refundList ? (details.refundList as any[]) : []}
          onConfirmRefundTransferred={handleConfirmRefundTransferred}
          isEdit
        />
        <Gap />
      </AsPageHeader>
    </View>
  )
}
export default GlobalWrapper(RefundConfirmResult)
