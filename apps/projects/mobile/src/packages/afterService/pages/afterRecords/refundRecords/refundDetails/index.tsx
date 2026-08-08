import GlobalWrapper from '@/components/GlobalWrapper'
/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-08 16:35:31
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-29 10:26:25
 * @Description: 退货单详情
 */
import React, { useState, useEffect } from 'react'
import { View, Text } from '@apps/mobile-ui'
import { useRouter, preload, pxTransform } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import Router from '@/utils/router'
import { DELIVERY_TYPE_ENUM } from '@/constants/const/product'
import { themeLayout } from '@/constants/theme'
import {
  getAftersalesMobileReturnGoodsGetDetailByConsumer,
  GetAftersalesMobileReturnGoodsGetDetailByConsumerResponse,
} from '@apps/apis'
import MellowCard from '@/components/MellowCard'
import Cell from '@/components/Cell'
import Grid from '@/components/Grid'
import Evaluation from '../../components/Evaluation'
import AsProductListCard from '../../components/AsProductListCard'
import AsPageHeader from '../../components/AsPageHeader'
import AsInfoPopup from '../../components/AsInfoPopup'
import ConsigneeAddressPopup from '../../components/ConsigneeAddressPopup'
import styles from './index.module.scss'
type RouteParams = {
  /**
   * 数据id
   */
  returnId: string
}
export interface DetailsData extends GetAftersalesMobileReturnGoodsGetDetailByConsumerResponse {}
const RefundDetails: React.FC = () => {
  const router = useRouter<RouteParams>()
  const { params } = router
  const [details, setDetails] = useState<DetailsData>()
  const [loading, setLoading] = useState(false)
  const [visibleAsInfoPopup, setVisibleAsInfoPopup] = useState(false)
  const [visibleConsigneeAddressPopup, setVisibleConsigneeAddressPopup] = useState(false)
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

  // 跳转相关凭证
  const handleJumpVoucherList = () => {
    const list = details?.faultFileList.map((item) => item.filePath)
    preload({
      dataSource: list || [],
    })
    Router.navigateTo('afterService/afterRecords/voucherList')
  }
  const handleVisibleAsInfoPopup = (flag?: boolean) => {
    setVisibleAsInfoPopup(!!flag)
  }
  const handleVisibleConsigneeAddressPopup = (flag?: boolean) => {
    setVisibleConsigneeAddressPopup(!!flag)
  }
  const handleJumpRefundDeliveryDetails = () => {
    Router.navigateTo('afterService/afterRecords/refundRecords/refundDeliveryDetails', {
      returnId: params.returnId,
    })
  }
  const refundAmount = details?.refundList.reduce((prev, curr) => prev + curr.refundAmount, 0) || ''
  return (
    <View className={styles['refund-details']}>
      <AsPageHeader title={details?.outerStatusName || ''}>
        {/* 退货商品 */}
        <AsProductListCard
          afterType={2}
          dataSource={
            details && details.goodsDetailList
              ? details.goodsDetailList.map((item) => ({
                  productName: item.productName,
                  purchasePrice: item.purchasePrice,
                  unit: item.unit,
                  skuPic: item.skuPic,
                  skuId: item.skuId,
                  applyCount: item.returnCount,
                  remaining: 0,
                }))
              : []
          }
          orderType={details?.orderType!}
        />
        {/* 退款金额 */}
        <MellowCard
          bodyStyle={{
            padding: 0,
          }}
          style={{
            marginTop: pxTransform(themeLayout['margin-xs']),
          }}
        >
          <Cell>
            <Cell.Item
              title={intl.formatMessage({
                id: 'refundRecords.refundDetails.refundAmount',
                defaultMessage: '退货总额',
              })}
              value={
                <Text className={styles['refund-details-refundAmount']}>{`${intl.formatMessage({
                  id: 'currency',
                  defaultMessage: '￥',
                })}${refundAmount}`}</Text>
              }
            />
          </Cell>
        </MellowCard>
        {/* 退货原因 */}
        <MellowCard
          bodyStyle={{
            padding: 0,
          }}
          style={{
            marginTop: pxTransform(themeLayout['margin-xs']),
          }}
        >
          <Cell>
            <Cell.Item
              title={intl.formatMessage({
                id: 'refundRecords.refundDetails.returnReason',
                defaultMessage: '退货原因',
              })}
              value={details?.returnReason}
            />
          </Cell>
        </MellowCard>
        {/* 售后评价 */}
        {details && details.evaluate ? (
          <Evaluation
            customStyle={{
              marginTop: pxTransform(themeLayout['margin-xs']),
            }}
            level={details.evaluate.level}
            content={details.evaluate.content}
          />
        ) : null}
        {/* 操作入口 */}
        <MellowCard
          bodyStyle={{
            padding: 0,
          }}
          style={{
            marginTop: pxTransform(themeLayout['margin-xs']),
          }}
        >
          <Grid column={4} border={false}>
            {/* <Grid.Item
              icon='Detailed-1'
              title={intl.formatMessage({id: 'refundRecords.refundDetails.delivery',  defaultMessage: '退货发货单' })}
             />
             <Grid.Item
              icon='Refund-1'
              title={intl.formatMessage({id: 'refundRecords.refundDetails.logistics',  defaultMessage: '退货物流单' })}
             /> */}
            {details?.returnDeliveryGoodsList && details?.returnDeliveryGoodsList.length > 0 && (
              <Grid.Item
                icon="logisticsDetails"
                title={intl.formatMessage({
                  id: 'refundRecords.refundDetails.returnDeliveryGoodsList',
                  defaultMessage: '退货发货明细',
                })}
                onClick={handleJumpRefundDeliveryDetails}
              />
            )}
            <Grid.Item
              icon="ProductDetails"
              title={intl.formatMessage({
                id: 'refundRecords.refundDetails.applyInfo',
                defaultMessage: '退货申请信息',
              })}
              onClick={() => handleVisibleAsInfoPopup(true)}
            />
            {(details?.returnGoodsAddress.deliveryType === DELIVERY_TYPE_ENUM.LOGISTICS ||
              details?.returnGoodsAddress.deliveryType === DELIVERY_TYPE_ENUM.SELF_PICKUP) && (
              <Grid.Item
                icon="CommodityInformation"
                title={intl.formatMessage({
                  id: 'refundRecords.refundDetails.returnGoodsAddress',
                  defaultMessage: '商品寄回信息',
                })}
                onClick={() => handleVisibleConsigneeAddressPopup(true)}
              />
            )}
            {details && details.faultFileList?.length > 0 ? (
              <Grid.Item
                icon="Certificate"
                title={intl.formatMessage({
                  id: 'refundRecords.refundDetails.faultFileList',
                  defaultValue: '相关凭证',
                })}
                onClick={handleJumpVoucherList}
              />
            ) : null}
          </Grid>
        </MellowCard>
      </AsPageHeader>
      {/* 退货申请信息 */}
      <AsInfoPopup
        afterType={2}
        data={{
          applyNo: details?.applyNo,
          supplierName: details?.shopName,
          applyTime: details?.applyTime,
        }}
        visible={visibleAsInfoPopup}
        onClose={() => handleVisibleAsInfoPopup(false)}
      />
      {/* 商品寄回信息 */}
      <ConsigneeAddressPopup
        data={{
          receiveUserName: details?.returnGoodsAddress?.receiveUserName!,
          receiveAddress: details?.returnGoodsAddress?.receiveAddress!,
          receiveUserTel: details?.returnGoodsAddress?.receiveUserTel!,
        }}
        visible={visibleConsigneeAddressPopup}
        onClose={() => handleVisibleConsigneeAddressPopup(false)}
      />
    </View>
  )
}
export default GlobalWrapper(RefundDetails)
