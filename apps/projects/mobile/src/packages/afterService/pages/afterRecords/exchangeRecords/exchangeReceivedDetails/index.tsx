import GlobalWrapper from '@/components/GlobalWrapper'
/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-29 10:45:11
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-01 15:18:06
 * @Description: 换货收货明细
 */
import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { useRouter } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import { View } from '@apps/mobile-ui'
import {
  getAftersalesMobileReplaceGoodsGetDetailByConsumer,
  GetAftersalesMobileReplaceGoodsGetDetailByConsumerResponse,
} from '@apps/apis'
import Scene from '@/components/Scene'
import Gap from '../../../afterRecords/components/Gap'
import AsPageHeader from '../../../afterRecords/components/AsPageHeader'
import LogisticsCard from '../../../afterRecords/components/LogisticsCard'
import LogisticsDetailList from '../../../afterRecords/components/LogisticsDetailList'
import DeliveryInfoPopup from '../../../afterRecords/components/DeliveryInfoPopup'
import styles from './index.module.scss'
type RouteParams = {
  /**
   * 数据id
   */
  replaceId: string
}
export interface DetailsData extends GetAftersalesMobileReplaceGoodsGetDetailByConsumerResponse {}
const ExchangeReceivedDetails: React.FC = () => {
  const router = useRouter<RouteParams>()
  const { params } = router
  const [details, setDetails] = useState<DetailsData>()
  const [loading, setLoading] = useState(false)
  const [activeKey, setActiveKey] = useState<string>('')
  const [current, setCurrent] = useState<DetailsData['replaceDeliveryGoodsList'][0]>()
  const [visibleDeliveryInfoPopup, setVisibleDeliveryInfoPopup] = useState(false)
  const intl = useIntl()

  // 选择批次信息
  const handleSelectBatch = (key: string, record: DetailsData['replaceDeliveryGoodsList'][0]) => {
    setActiveKey(key)
    setCurrent(record)
  }
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
          if (res.data.replaceDeliveryGoodsList && res.data.replaceDeliveryGoodsList.length) {
            const lastOne = res.data.replaceDeliveryGoodsList[res.data.replaceDeliveryGoodsList.length - 1]
            handleSelectBatch(`${lastOne.batch}`, lastOne)
          }
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
  const handlevisibleDeliveryInfoPopup = (flag?: boolean) => {
    setVisibleDeliveryInfoPopup(!!flag)
  }
  return (
    <View className={styles['exchange-received-details']}>
      <AsPageHeader
        title={intl.formatMessage({
          id: 'exchangeRecords.exchangeReceivedDetails.title',
          defaultMessage: '换货收货',
        })}
        extra={
          details && details.replaceDeliveryGoodsList && details.replaceDeliveryGoodsList.length > 0
            ? intl.formatMessage({
                id: 'exchangeRecords.exchangeReceivedDetails.replaceDeliveryGoodsList',
                length: details.replaceDeliveryGoodsList.length,
              })
            : ''
        }
      >
        <Scene current={activeKey}>
          {details &&
            details.replaceDeliveryGoodsList.map((item) => (
              <Scene.Item
                key={item.batch}
                itemKey={`${item.batch}`}
                customClassName={cx(
                  styles['logisticsTabWrap-item'],
                  !(details && details.replaceDeliveryGoodsList.length == 1)
                    ? styles['logisticsTabWrap-item-small']
                    : '',
                )}
                onClick={() => handleSelectBatch(`${item.batch}`, item)}
              >
                <LogisticsCard
                  data={item}
                  details={details}
                  isActive={`${item.batch}` === activeKey}
                  type="exchange"
                  roleType="addressee"
                  onShowDeliverInfo={() => handlevisibleDeliveryInfoPopup(true)}
                />
              </Scene.Item>
            ))}
        </Scene>
        {details &&
          details.replaceDeliveryGoodsList.map((item) => (
            <View
              key={item.batch}
              style={{
                display: `${item.batch}` === activeKey ? 'block' : 'none',
              }}
            >
              <LogisticsDetailList
                dataSource={item.detailList.map((detailItem) => ({
                  productId: detailItem.productId,
                  productName: detailItem.productName,
                  unit: detailItem.unit,
                  applyCount: detailItem.count,
                  deliveryCount: detailItem.deliveryCount,
                  storageCount: detailItem.storageCount,
                  count: detailItem.storageCount,
                  skuPic: detailItem.skuPic,
                }))}
                afterType={2}
                flowType="exchangeReceived"
                orderType={details.orderType}
              />
            </View>
          ))}
        <Gap />
      </AsPageHeader>
      <DeliveryInfoPopup
        visible={visibleDeliveryInfoPopup}
        data={{
          deliveryNo: current?.deliveryNo,
          deliveryNoId: current?.deliveryNoId,
          deliveryTime: current?.deliveryTime,
          logisticsId: current?.logisticsId,
          logisticsOrderNo: current?.logisticsOrderNo,
          logisticsName: current?.logisticsName,
          storageNo: current?.storageNo,
          storageId: current?.storageId,
          storageTime: current?.storageTime,
        }}
        onClose={() => handlevisibleDeliveryInfoPopup(false)}
        type="exchange"
        roleType="addressee"
      />
    </View>
  )
}
export default GlobalWrapper(ExchangeReceivedDetails)
