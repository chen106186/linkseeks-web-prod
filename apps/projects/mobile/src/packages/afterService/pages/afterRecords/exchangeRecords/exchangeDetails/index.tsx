import GlobalWrapper from '@/components/GlobalWrapper'
/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-18 10:51:29
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-01 11:52:57
 * @Description: 换货单详情
 */
import React, { useState, useEffect } from 'react'
import { View } from '@apps/mobile-ui'
import { useRouter, preload, pxTransform } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import Router from '@/utils/router'
import { themeLayout } from '@/constants/theme'
import { DELIVERY_TYPE_ENUM } from '@/constants/const/product'
import {
  getAftersalesMobileReplaceGoodsGetDetailByConsumer,
  GetAftersalesMobileReplaceGoodsGetDetailByConsumerResponse,
} from '@apps/apis'
import MellowCard from '@/components/MellowCard'
import Cell from '@/components/Cell'
import Grid from '@/components/Grid'
import AddressCard from '@/components/AddressCard'
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
  replaceId: string
}
export interface DetailsData extends GetAftersalesMobileReplaceGoodsGetDetailByConsumerResponse {}
const ExchangeDetails: React.FC = () => {
  const router = useRouter<RouteParams>()
  const { params } = router
  const [details, setDetails] = useState<DetailsData>()
  const [loading, setLoading] = useState(false)
  const [visibleAsInfoPopup, setVisibleAsInfoPopup] = useState(false)
  const [visibleConsigneeAddressPopup, setVisibleConsigneeAddressPopup] = useState(false)
  const intl = useIntl()
  const getDetails = () => {
    if (!params.replaceId || loading) {
      return
    }
    setLoading(true)
    getAftersalesMobileReplaceGoodsGetDetailByConsumer({
      replaceId: `${params.replaceId}`,
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
    Router.navigateTo('afterService/afterRecords/exchangeRecords/exchangeRefundDeliveryDetails', {
      replaceId: params.replaceId,
    })
  }
  const handleJumpExchangeReceivedDetails = () => {
    Router.navigateTo('afterService/afterRecords/exchangeRecords/exchangeReceivedDetails', {
      replaceId: params.replaceId,
    })
  }
  return (
    <View className={styles['exchange-details']}>
      <AsPageHeader title={details?.outerStatusName || ''}>
        {/* 换货商品 */}
        <AsProductListCard
          afterType={3}
          dataSource={
            details && details.goodsDetailList
              ? details?.goodsDetailList.map((item) => ({
                  productName: item.productName,
                  purchasePrice: item.purchasePrice,
                  unit: item.unit,
                  skuPic: item.skuPic,
                  applyCount: item.replaceCount,
                  skuId: 0,
                  remaining: 0,
                }))
              : []
          }
          orderType={details?.orderType!}
        />
        {/* 换货原因 */}
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
                id: 'exchangeRecords.exchangeDetails.replaceReason',
                defaultMessage: '换货原因',
              })}
              value={details?.replaceReason}
            />
          </Cell>
        </MellowCard>
        {/* 换货收货地址 */}
        <MellowCard
          title={intl.formatMessage({
            id: 'exchangeRecords.exchangeDetails.replaceGoodsAddress',
            defaultMessage: '换货收货地址',
          })}
          style={{
            marginTop: pxTransform(themeLayout['margin-xs']),
          }}
        >
          <AddressCard
            data={{
              id: details?.replaceGoodsAddress.receiveId!,
              name: details?.replaceGoodsAddress.receiveUserName!,
              phoneNum: details?.replaceGoodsAddress.receiveUserTel!,
              fullAddress: details?.replaceGoodsAddress.receiveAddress!,
            }}
          />
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
          <Grid column={4}>
            {/* <Grid.Item
              icon='Detailed'
              title={intl.formatMessage({id: 'exchangeRecords.exchangeDetails.delivery',  defaultMessage: '退货发货单' })}
             />
             <Grid.Item
              icon='Refund'
              title={intl.formatMessage({id: 'exchangeRecords.exchangeDetails.logistics',  defaultMessage: '退货物流单' })}
             /> */}
            {details?.returnDeliveryGoodsList && details?.returnDeliveryGoodsList.length > 0 && (
              <Grid.Item
                icon="logisticsDetails"
                title={intl.formatMessage({
                  id: 'exchangeRecords.exchangeDetails.returnDeliveryGoodsList',
                  defaultMessage: '退货发货明细',
                })}
                onClick={handleJumpRefundDeliveryDetails}
              />
            )}
            {details?.replaceDeliveryGoodsList && details?.replaceDeliveryGoodsList.length > 0 && (
              <Grid.Item
                icon="ProductInquire"
                title={intl.formatMessage({
                  id: 'exchangeRecords.exchangeDetails.replaceDeliveryGoodsList',
                  defaultMessage: '换货收货明细',
                })}
                onClick={handleJumpExchangeReceivedDetails}
              />
            )}
            <Grid.Item
              icon="ProductExchange"
              title={intl.formatMessage({
                id: 'exchangeRecords.exchangeDetails.applyInfo',
                defaultMessage: '换货申请信息',
              })}
              onClick={() => handleVisibleAsInfoPopup(true)}
            />
            {(details?.returnGoodsAddress.deliveryType === DELIVERY_TYPE_ENUM.LOGISTICS ||
              details?.returnGoodsAddress.deliveryType === DELIVERY_TYPE_ENUM.SELF_PICKUP) && (
              <Grid.Item
                icon="CommodityInformation"
                title={intl.formatMessage({
                  id: 'exchangeRecords.exchangeDetails.returnGoodsAddress',
                  defaultMessage: '商品寄回信息',
                })}
                onClick={() => handleVisibleConsigneeAddressPopup(true)}
              />
            )}
            {details && details.faultFileList?.length > 0 ? (
              <Grid.Item
                icon="Certificate"
                title={intl.formatMessage({
                  id: 'exchangeRecords.exchangeDetails.faultFileList',
                  defaultMessage: '相关凭证',
                })}
                onClick={handleJumpVoucherList}
              />
            ) : null}
          </Grid>
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
        </MellowCard>
      </AsPageHeader>
      {/* 换货申请信息 */}
      <AsInfoPopup
        afterType={3}
        data={{
          applyNo: details?.applyNo,
          supplierName: details?.shopName,
          applyTime: details?.applyTime,
        }}
        visible={visibleAsInfoPopup}
        onClose={() => handleVisibleAsInfoPopup(false)}
      />
    </View>
  )
}
export default GlobalWrapper(ExchangeDetails)
