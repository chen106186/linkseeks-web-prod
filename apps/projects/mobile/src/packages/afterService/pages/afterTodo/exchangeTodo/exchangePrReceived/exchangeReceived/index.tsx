import GlobalWrapper from '@/components/GlobalWrapper'
/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-18 15:33:29
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-01 15:03:31
 * @Description: 换货收货
 */
import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { getCurrentInstance, showModal, pxTransform } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import { View, Button } from '@apps/mobile-ui'
import { useSafeArea } from '@apps/mobile-services'
import { MAIL_INNER_STATUS_CONFIRMED_DELIVER, MAIL_INNER_STATUS_CONFIRMED_RECEIVING } from '@/constants/const/refund'
import { themeLayout } from '@/constants/theme'
import { EXCHANGE_INNER_STATUS_UNCONFIRMED_REPLACE_RECEIVE } from '@/constants/const/exchange'
import {
  getAftersalesMobileReplaceGoodsGetDetailByConsumer,
  postAftersalesMobileReplaceGoodsConfirmReplaceReceiveGoods,
  GetAftersalesMobileReplaceGoodsGetDetailByConsumerResponse,
} from '@apps/apis'
import Scene from '@/components/Scene'
import Gap from '../../../../afterRecords/components/Gap'
import AsPageHeader from '../../../../afterRecords/components/AsPageHeader'
import LogisticsCard from '../../../../afterRecords/components/LogisticsCard'
import LogisticsDetailList from '../../../../afterRecords/components/LogisticsDetailList'
import DeliveryInfoPopup from '../../../../afterRecords/components/DeliveryInfoPopup'
import styles from './index.module.scss'
import { requestSubscribeMessage } from '@tarojs/taro'
import { IS_WEB } from '@/constants'
interface RouteParams {
  /**
   * 数据id
   */
  replaceId: number
  /**
   * 是否可编辑的，这里用来区分是 提交/修改 操作
   */
  isEdit: boolean
  /**
   * 提交成功之后会回调的函数，通常会用作 重新请求数据
   */
  onRefresh: () => void
}
export interface DetailsData extends GetAftersalesMobileReplaceGoodsGetDetailByConsumerResponse {}
const ExchangeReceived: React.FC = () => {
  const params = getCurrentInstance().preloadData as RouteParams
  const [details, setDetails] = useState<DetailsData>()
  const [loading, setLoading] = useState(false)
  const [activeKey, setActiveKey] = useState<string>('')
  const [current, setCurrent] = useState<DetailsData['replaceDeliveryGoodsList'][0]>()
  const [visibleDeliveryInfoPopup, setVisibleDeliveryInfoPopup] = useState(false)
  const { safeBottomHeight } = useSafeArea()
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

  // 确认换货收货
  const handleConfirmReturnDeliver = async (deliveryId: number) => {
    if (!IS_WEB) {
      await requestSubscribeMessage({
        tmplIds: ['UKQ2Aw81Af_CyNE9HpT8apmFcR-b6IYEjzYTH8f13xo'],
        entityIds: [],
      }).catch(() => {})
    }

    showModal({
      title: '',
      confirmText: intl.formatMessage({
        id: 'confirm',
        defaultMessage: '确认',
      }),
      cancelText: intl.formatMessage({
        id: 'cancel',
        defaultMessage: '取消',
      }),
      content: intl.formatMessage({
        id: 'exchangeTodo.exchangeReceived.confirm.tip',
        defaultMessage: '是否确认换货收货？',
      }),
      success: (result: Taro.showModal.SuccessCallbackResult) => {
        if (result.confirm) {
          return new Promise<void>((resolve) => {
            postAftersalesMobileReplaceGoodsConfirmReplaceReceiveGoods({
              id: deliveryId,
            })
              .then((res) => {
                if (res.code === 1000) {
                  if (params.onRefresh) {
                    params.onRefresh()
                  }
                  if (details) {
                    const { replaceDeliveryGoodsList } = details
                    const newData = [...replaceDeliveryGoodsList]
                    const index = newData.findIndex((item) => item.deliveryId === deliveryId)
                    if (index !== -1) {
                      const newItem = {
                        ...newData[index],
                        innerStatus: MAIL_INNER_STATUS_CONFIRMED_RECEIVING,
                        innerStatusName: intl.formatMessage({
                          id: 'exchangeTodo.exchangeReceived.status.confirmed',
                          defaultMessage: '已确认换货收货',
                        }),
                      }
                      newData.splice(index, 1, newItem)
                      setCurrent(newItem)
                    }
                    setDetails({
                      ...details,
                      replaceDeliveryGoodsList: newData,
                    })
                  }
                  resolve()
                } else {
                  resolve()
                }
              })
              .catch(() => {
                resolve()
              })
          })
        }
      },
    })
  }
  const handlevisibleDeliveryInfoPopup = (flag?: boolean) => {
    setVisibleDeliveryInfoPopup(!!flag)
  }
  return (
    <View className={styles['exchange-received']}>
      <AsPageHeader
        title={intl.formatMessage({
          id: 'exchangeTodo.exchangeReceived.nav',
          defaultMessage: '待换货收货',
        })}
        extra={
          details && details.replaceDeliveryGoodsList && details.replaceDeliveryGoodsList.length > 0
            ? intl.formatMessage({
                id: 'exchangeTodo.exchangeReceived.replaceDeliveryGoodsList',
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
                  details && details.replaceDeliveryGoodsList.length == 1 ? '' : styles['logisticsTabWrap-item-small'],
                )}
                onClick={() => handleSelectBatch(`${item.batch}`, item)}
              >
                <LogisticsCard
                  data={item}
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
                  count: detailItem.deliveryCount,
                  skuPic: detailItem.skuPic,
                }))}
                afterType={2}
                flowType="exchangeReceived"
                orderType={details.orderType}
              />
            </View>
          ))}
        <Gap />
        {current?.innerStatus === MAIL_INNER_STATUS_CONFIRMED_DELIVER &&
        details?.innerStatus === EXCHANGE_INNER_STATUS_UNCONFIRMED_REPLACE_RECEIVE ? (
          <View
            className={styles['actions']}
            style={{
              paddingBottom: safeBottomHeight ? `${safeBottomHeight}PX` : pxTransform(themeLayout['padding-xs']),
            }}
          >
            <Button type="primary" onClick={() => handleConfirmReturnDeliver(current?.deliveryId!)}>
              {intl.formatMessage({
                id: 'exchangeTodo.exchangeReceived.confirm',
                defaultMessage: '确认换货收货',
              })}
            </Button>
          </View>
        ) : null}
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
export default GlobalWrapper(ExchangeReceived)
