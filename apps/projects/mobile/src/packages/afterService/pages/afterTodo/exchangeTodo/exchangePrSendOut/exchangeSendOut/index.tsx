import GlobalWrapper from '@/components/GlobalWrapper'
/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-18 14:13:07
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-01 15:25:35
 * @Description: 换货退货发货
 */
import React, { useState, useEffect, useRef } from 'react'
import cx from 'classnames'
import { getCurrentInstance, showModal, pxTransform, showToast } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import { View, Button } from '@apps/mobile-ui'
import Router from '@/utils/router'
import { useSafeArea } from '@apps/mobile-services'
import {
  EXCHANGE_GOODS_MANUAL_DELIVERY,
  EXCHANGE_INNER_STATUS_UNCONFIRMED_REFUND_DELIVERY,
} from '@/constants/const/exchange'
import { MAIL_INNER_STATUS_CONFIRMED_DELIVER, MAIL_INNER_STATUS_UNCONFIRMED_DELIVER } from '@/constants/const/refund'
import { dateFormat } from '@/utils/date'
import { themeLayout } from '@/constants/theme'
import {
  getAftersalesMobileReplaceGoodsGetDetailByConsumer,
  postAftersalesMobileReplaceGoodsConfirmReturnDeliveryGoods,
  GetAftersalesMobileReplaceGoodsGetDetailByConsumerResponse,
  postAftersalesMobileReplaceGoodsManualReturnDeliveryGoods,
} from '@apps/apis'
import Scene from '@/components/Scene'
import Gap from '../../../../afterRecords/components/Gap'
import AsPageHeader from '../../../../afterRecords/components/AsPageHeader'
import LogisticsCard from '../../../../afterRecords/components/LogisticsCard'
import LogisticsDetailList, { LogisticsDetailItemType } from '../../../../afterRecords/components/LogisticsDetailList'
import DeliveryInfoPopup from '../../../../afterRecords/components/DeliveryInfoPopup'
import ConsigneeAddressCard from '../../../../afterRecords/components/ConsigneeAddressCard'
import ManualDelivery, {
  Values,
  ManualDeliveryRefHandle,
} from '../../../../afterRecords/refundRecords/components/ManualDelivery'
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
export interface DetailsData
  extends Omit<GetAftersalesMobileReplaceGoodsGetDetailByConsumerResponse, 'goodsDetailList'> {}
const ExchangeSendOut: React.FC = () => {
  const params = getCurrentInstance().preloadData as RouteParams
  const [details, setDetails] = useState<DetailsData>()
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<LogisticsDetailItemType[]>([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const [manualDeliveryValue] = useState<Values>({
    deliveryAddress: '',
    deliveryTime: dateFormat(new Date(), 'YYYY-MM-DD'),
    logisticsOrderNo: '',
    logisticsName: '',
  })
  const [activeKey, setActiveKey] = useState<string>('')
  const [current, setCurrent] = useState<DetailsData['returnDeliveryGoodsList'][0]>()
  const [visibleDeliveryInfoPopup, setVisibleDeliveryInfoPopup] = useState(false)
  const manualDeliveryRef = useRef<ManualDeliveryRefHandle | null>(null)
  const { safeBottomHeight } = useSafeArea()
  const intl = useIntl()

  // eslint-disable-next-line no-undef
  let timer: NodeJS.Timeout | null = null

  // 选择批次信息
  const handleSelectBatch = (key: string, record: DetailsData['returnDeliveryGoodsList'][0]) => {
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
          const { goodsDetailList, ...rest } = res.data
          setDetails(rest)
          setProducts(
            goodsDetailList
              .filter((item) => item.isNeedReturn && item.noDeliveryCount > 0)
              .map((item) => ({
                purchaseCount: item.purchaseCount,
                productId: item.productId,
                productName: item.productName,
                unit: item.unit,
                orderRecordId: item.orderRecordId,
                applyCount: item.replaceCount,
                count: item.noDeliveryCount,
                detailId: item.detailId,
                skuPic: item.skuPic,
              })),
          )
          if (res.data.returnDeliveryGoodsList && res.data.returnDeliveryGoodsList.length) {
            const lastOne = res.data.returnDeliveryGoodsList[res.data.returnDeliveryGoodsList.length - 1]
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
    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [])

  // 确认退货发货
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
        id: 'exchangeTodo.exchangeSendOut.confirm.tip',
        defaultMessage: '是否确认退货发货？',
      }),
      success: (result: Taro.showModal.SuccessCallbackResult) => {
        if (result.confirm) {
          return new Promise<void>((resolve) => {
            postAftersalesMobileReplaceGoodsConfirmReturnDeliveryGoods({
              id: deliveryId,
            })
              .then((res) => {
                if (res.code === 1000) {
                  if (params.onRefresh) {
                    params.onRefresh()
                  }
                  if (details) {
                    const { returnDeliveryGoodsList } = details
                    const newData = [...returnDeliveryGoodsList]
                    const index = newData.findIndex((item) => item.deliveryId === deliveryId)
                    if (index !== -1) {
                      const newItem = {
                        ...newData[index],
                        innerStatus: MAIL_INNER_STATUS_CONFIRMED_DELIVER,
                        innerStatusName: intl.formatMessage({
                          id: 'exchangeTodo.exchangeSendOut.status.confirmed',
                          defaultMessage: '已确认退货发货',
                        }),
                      }
                      newData.splice(index, 1, newItem)
                      setCurrent(newItem)
                    }
                    setDetails({
                      ...details,
                      returnDeliveryGoodsList: newData,
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
  const handleStepperChange = (value: LogisticsDetailItemType[]) => {
    setProducts(value)
  }

  // 确认手工发货
  const handleManualDelivery = async () => {
    if (!products.length) {
      showToast({
        title: intl.formatMessage({
          id: 'exchangeTodo.exchangeSendOut.products.required',
          defaultMessage: '没有可退货发货的商品',
        }),
        icon: 'none',
      })
      return
    }
    const deliveryValue = manualDeliveryRef.current?.submit()
    if (!deliveryValue) {
      return
    }
    if (products.some((item) => !item.count)) {
      showToast({
        title: intl.formatMessage({
          id: 'exchangeTodo.exchangeSendOut.products.count.required',
          defaultMessage: '请填写退货发货数量',
        }),
        icon: 'none',
      })
      return
    }

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
        id: 'exchangeTodo.exchangeSendOut.confirm.tip',
        defaultMessage: '是否确认退货发货？',
      }),
      success: (result: Taro.showModal.SuccessCallbackResult) => {
        if (result.confirm) {
          return new Promise<void>((resolve) => {
            postAftersalesMobileReplaceGoodsManualReturnDeliveryGoods({
              dataId: params.replaceId,
              ...deliveryValue,
              deliveryTime: new Date(deliveryValue.deliveryTime).getTime(),
              productList: products.map((item) => ({
                productId: item.productId as string,
                returnCount: item.count as number,
                replaceDetailId: item.detailId as number,
              })),
            })
              .then((res) => {
                if (res.code === 1000) {
                  showToast({
                    title: intl.formatMessage({
                      id: 'exchangeTodo.exchangeSendOut.confirm.success',
                      defaultMessage: '提交成功',
                    }),
                    icon: 'none',
                  })
                  if (params.onRefresh) {
                    params.onRefresh()
                  }
                  timer = setTimeout(() => {
                    setSubmitLoading(false)
                    Router.navigateBack()
                  }, 1000)
                }
                if (res.code !== 1000 && res.message) {
                  showToast({
                    title: intl.formatMessage({
                      id: `${res.code}`,
                      defaultMessage: res.message,
                    }),
                    icon: 'none',
                  })
                  setSubmitLoading(false)
                }
                resolve()
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
    <View className={styles['exchange-send-out']}>
      <AsPageHeader
        title={intl.formatMessage({
          id: 'exchangeTodo.exchangeSendOut.nav',
          defaultMessage: '退货发货',
        })}
        extra={
          details && details.returnDeliveryGoodsList && details.returnDeliveryGoodsList.length > 0
            ? intl.formatMessage({
                id: 'exchangeTodo.exchangeSendOut.returnDeliveryGoodsList',
                length: details.returnDeliveryGoodsList.length,
              })
            : ''
        }
      >
        {details && details.taskType !== EXCHANGE_GOODS_MANUAL_DELIVERY ? (
          <>
            <Scene current={activeKey}>
              {details &&
                details.returnDeliveryGoodsList.map((item) => (
                  <Scene.Item
                    key={item.batch}
                    itemKey={`${item.batch}`}
                    customClassName={cx(
                      styles['logisticsTabWrap-item'],
                      details && details.returnDeliveryGoodsList.length == 1
                        ? ''
                        : styles['logisticsTabWrap-item-small'],
                    )}
                    onClick={() => handleSelectBatch(`${item.batch}`, item)}
                  >
                    <LogisticsCard
                      data={item}
                      isActive={`${item.batch}` === activeKey}
                      type="exchange"
                      roleType="sender"
                      onShowDeliverInfo={() => handlevisibleDeliveryInfoPopup(true)}
                    />
                  </Scene.Item>
                ))}
            </Scene>
            {details &&
              details.returnDeliveryGoodsList.map((item) => (
                <View
                  key={item.batch}
                  style={{
                    display: `${item.batch}` === activeKey ? 'block' : 'none',
                  }}
                >
                  <LogisticsDetailList
                    dataSource={item.detailList}
                    afterType={2}
                    flowType="returnDeliver"
                    orderType={details.orderType}
                  />
                </View>
              ))}
          </>
        ) : null}
        {details && details.taskType === EXCHANGE_GOODS_MANUAL_DELIVERY ? (
          <>
            <ConsigneeAddressCard
              data={{
                receiveAddress: details?.returnGoodsAddress.receiveAddress,
                receiveUserName: details?.returnGoodsAddress.receiveUserName,
                receiveUserTel: details?.returnGoodsAddress.receiveUserTel,
              }}
            />
            <ManualDelivery
              deliveryType={details && details.returnGoodsAddress.deliveryType}
              value={manualDeliveryValue}
              ref={manualDeliveryRef}
              customStyle={{
                marginTop: pxTransform(themeLayout['margin-xs']),
              }}
              isEdit
            />
            <LogisticsDetailList
              dataSource={products}
              onStepperChange={handleStepperChange}
              afterType={2}
              flowType="returnDeliver"
              orderType={details.orderType}
              ediatable
            />
          </>
        ) : null}
        <Gap />
        {details ? (
          <View
            className="actions"
            style={{
              paddingBottom: safeBottomHeight ? `${safeBottomHeight}PX` : pxTransform(themeLayout['padding-xs']),
            }}
          >
            {/* 手工退货发货 */}
            {details.taskType === EXCHANGE_GOODS_MANUAL_DELIVERY ? (
              <Button type="primary" onClick={handleManualDelivery} loading={submitLoading}>
                {intl.formatMessage({
                  id: 'exchangeTodo.exchangeSendOut.confirm',
                  defaultMessage: '确认退货发货',
                })}
              </Button>
            ) : null}
            {/* 非手工退货发货 */}
            {current?.innerStatus === MAIL_INNER_STATUS_UNCONFIRMED_DELIVER &&
            details?.innerStatus === EXCHANGE_INNER_STATUS_UNCONFIRMED_REFUND_DELIVERY ? (
              <Button type="primary" onClick={() => handleConfirmReturnDeliver(current.deliveryId)}>
                {intl.formatMessage({
                  id: 'exchangeTodo.exchangeSendOut.confirm',
                  defaultMessage: '确认退货发货',
                })}
              </Button>
            ) : null}
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
        roleType="sender"
      />
    </View>
  )
}
export default GlobalWrapper(ExchangeSendOut)
