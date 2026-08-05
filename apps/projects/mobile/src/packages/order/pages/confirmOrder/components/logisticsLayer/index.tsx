import React, { useEffect, useState, useMemo } from 'react'
import { View, Text, Icons } from '@apps/mobile-ui'
import { observer } from 'mobx-react-lite'
import Router from '@/utils/router'
import Popup from '@/components/Popup'
import useStores from '@/store/useStores'
import { useIntl } from '@linkseeks/i18n'
import {
  GetLogisticsMobileShipperAddressStoreListResponse,
  getLogisticsMobileShipperAddressStoreList,
  getLogisticsShipperAddressGet,
} from '@apps/apis'
import { combinationAddress } from '@/utils/dataMerge'
import { DELIVERY_TYPE_ENUM } from '@/constants/const/product'
import { fnKeepTwo } from '../../../../commonlyFn'
import styles from './index.module.scss'

/**
 * 商户下 商品下 对应选购的规格列表
 */

interface LogisticsLayerProps {
  logisticsLayer: any
  showLogisticsLayer: boolean
  fnClose: Function
  addressInfo: any
  freightTotal: number
  onSelect: Function
  vendorMember: any
  SelectItem: any
}

const LogisticsLayer: React.FC<LogisticsLayerProps> = (props: LogisticsLayerProps) => {
  const intl = useIntl()
  const { showLogisticsLayer, fnClose, logisticsLayer, addressInfo, freightTotal, onSelect, vendorMember, SelectItem } =
    props
  const [logisticsMessage, setLogisticsMessage] = useState<any>({})
  const [storeList, setStoreList] = useState<GetLogisticsMobileShipperAddressStoreListResponse>([])
  const {
    confirmOrderStore: { orderstore, setstoreItem },
  } = useStores()
  // 设置是物流还是上门自提
  const [Index, setIndex] = useState<number>(0)
  const fnClosePopup = () => {
    if (fnClose) {
      fnClose()
    }
  }

  const link = async () => {
    const res = await getLogisticsMobileShipperAddressStoreList({
      vendorMemberId: vendorMember.vendorMemberId,
      vendorRoleId: vendorMember.vendorRoleId,
      receiveId: logisticsMessage?.id,
    })
    if (res.data.length > 0) {
      Router.navigateTo('order/selfMention', { ...vendorMember, id: logisticsMessage.id })
    }
  }

  /**
   * 获取配送地址
   */
  const fnGetAddress = async (flag?: boolean) => {
    const parma = {
      id: logisticsLayer.logistics.sendAddressId,
    }
    const res = await getLogisticsShipperAddressGet(parma)
    if (SelectItem?.logisticsMessage && Object.keys(SelectItem?.logisticsMessage)?.length > 0) {
      setLogisticsMessage({ ...SelectItem.logisticsMessage })
      return
    }
    // 若没有门店地址就默认拿店铺发货地址作为自提地址
    if (flag) {
      setstoreItem({
        ...res.data,
        receiverName: res.data?.shipperName,
        fullAddress: combinationAddress([
          res.data.provinceName,
          res.data.cityName,
          res.data.districtName,
          res.data.streetName,
          res.data.address,
        ]),
      })
      return
    }
    setLogisticsMessage({
      ...res.data,
      fullAddress: combinationAddress([
        res.data.provinceName,
        res.data.cityName,
        res.data.districtName,
        res.data.streetName,
        res.data.address,
      ]),
    })
  }
  // 获取默认的自提地址
  const getStoreList = async () => {
    const res: any = await getLogisticsMobileShipperAddressStoreList(vendorMember)
    let store = {}
    if (res.code === 1000) {
      if (res.data.length > 0) {
        setStoreList(res.data)
        res.data.forEach((element: any) => {
          if (element.isDefault) {
            store = element
            setLogisticsMessage({ ...element })
          }
        })
        if (SelectItem?.logisticsMessage && Object.keys(SelectItem?.logisticsMessage).length > 0) {
          setLogisticsMessage({ ...SelectItem.logisticsMessage })
          return
        }

        if (Object.keys(store).length === 0) {
          setLogisticsMessage({ ...res.data[0] })
        }
      } else {
        // 没有门店地址就查询配送地址
        fnGetAddress(true)
      }
    }
  }
  useEffect(() => {
    if (
      logisticsLayer &&
      logisticsLayer.logistics &&
      logisticsLayer.logistics.deliveryType === DELIVERY_TYPE_ENUM.SELF_PICKUP
    ) {
      fnGetAddress()
    }
    if (
      logisticsLayer &&
      logisticsLayer.logistics &&
      logisticsLayer.logistics.deliveryType === DELIVERY_TYPE_ENUM.LOGISTICS_AND_SELF
    ) {
      getStoreList()
    }
  }, [logisticsLayer])

  useEffect(() => {
    setLogisticsMessage({ ...orderstore })
  }, [orderstore])
  // 跳过去选自提地址那边回调用方法
  const Submit = () => {
    onSelect({
      Index,
      logisticsMessage,
    })
    fnClosePopup()
  }

  const addressText = useMemo(() => {
    if (addressInfo) {
      return combinationAddress([
        addressInfo.provinceName,
        addressInfo.cityName,
        addressInfo.districtName,
        addressInfo.address,
      ])
    }
    return null
  }, [addressInfo])

  const logisticsMessageText = useMemo(() => {
    if (logisticsMessage) {
      return combinationAddress([
        logisticsMessage.provinceName,
        logisticsMessage.cityName,
        logisticsMessage.districtName,
        logisticsMessage.address,
      ])
    }
    return null
  }, [logisticsMessage])

  const returnContentTitle = () => {
    // 无需配送
    if (logisticsLayer?.logistics?.deliveryType === DELIVERY_TYPE_ENUM.NO_DELIVERY) {
      return intl.formatMessage({
        id: 'confirmOrder_components_logisticsLayer_contentTitle_1',
        defaultMessage: '免运费',
      })
    }
    if (freightTotal > 0 && Index === 0) {
      return intl.formatMessage({
        id: 'confirmOrder_components_logisticsLayer_contentTitle_2',
        data: fnKeepTwo(freightTotal),
        defaultMessage: '运费: 0',
      })
    }
    return intl.formatMessage({ id: 'confirmOrder_components_logisticsLayer_contentTitle_1', defaultMessage: '免运费' })
  }

  return (
    <Popup visible={showLogisticsLayer} onClose={fnClosePopup}>
      <View className={styles['warp']}>
        <View className={styles['title']}>
          <Text className={styles['text']}>
            {intl.formatMessage({ id: 'confirmOrder_components_logisticsLayer_title', defaultMessage: '配送' })}
          </Text>
        </View>
        {logisticsLayer.logistics && logisticsLayer.logistics.deliveryType === DELIVERY_TYPE_ENUM.LOGISTICS && (
          <View className={styles['content-warp']}>
            <Text className={styles['content-title']}>{returnContentTitle()}</Text>
            <Text className={styles['content-btn']}>
              {intl.formatMessage({
                id: 'confirmOrder_components_logisticsLayer_contentBtn_3',
                defaultMessage: '物流运输',
              })}
            </Text>
          </View>
        )}
        {logisticsLayer.logistics && logisticsLayer.logistics.deliveryType === DELIVERY_TYPE_ENUM.SELF_PICKUP && (
          <View className={styles['content-warp']}>
            <Text className={styles['content-title']}>{returnContentTitle()}</Text>
            <Text className={styles['content-btn']}>
              {intl.formatMessage({
                id: 'confirmOrder_components_logisticsLayer_contentBtn_2',
                defaultMessage: '上门自提',
              })}
            </Text>
            <View className={styles['content-flex']}>
              <View className={styles['address-warp']} onClick={link}>
                <Text className={`${styles['address-text']} ${styles['address-text-first']}`}>{`${
                  logisticsMessage.shipperName ?? intl.formatMessage({ id: 'user.wu', defaultMessage: '无' })
                }: ${logisticsMessage.phone ?? intl.formatMessage({ id: 'user.wu', defaultMessage: '无' })}`}</Text>
                <Text className={styles['address-text']}>{logisticsMessageText}</Text>
              </View>
              <Icons name="ChevronRight" size={12} />
            </View>
          </View>
        )}
        {logisticsLayer.logistics && logisticsLayer.logistics.deliveryType === DELIVERY_TYPE_ENUM.NO_DELIVERY && (
          <View className={styles['content-warp']}>
            <Text className={styles['content-title']}>{returnContentTitle()}</Text>
            <Text className={styles['content-btn']}>
              {intl.formatMessage({
                id: 'confirmOrder_components_logisticsLayer_contentBtn_1',
                defaultMessage: '收货地点',
              })}
            </Text>
            <View className={styles['address-warp']}>
              <Text
                className={`${styles['address-text']} ${styles['address-text-first']}`}
              >{`${addressInfo?.receiverName}: ${addressInfo?.phone}`}</Text>
              <Text className={styles['address-text']}>{addressText}</Text>
            </View>
          </View>
        )}
        {logisticsLayer.logistics &&
          logisticsLayer.logistics.deliveryType === DELIVERY_TYPE_ENUM.LOGISTICS_AND_SELF && (
            <View className={styles['content-warp']}>
              <Text className={styles['content-title']}>{returnContentTitle()}</Text>
              <View className={styles['content-box']}>
                <Text
                  className={Index === 0 ? styles['content-btn'] : styles['content-btn1']}
                  onClick={() => setIndex(0)}
                >
                  {intl.formatMessage({ id: 'order.wuliuyunshu', defaultMessage: '物流运输' })}
                </Text>
                <Text
                  className={Index === 1 ? styles['content-btn'] : styles['content-btn1']}
                  style={{ marginLeft: 10 }}
                  onClick={() => setIndex(1)}
                >
                  {intl.formatMessage({
                    id: 'confirmOrder_components_logisticsLayer_contentBtn_2',
                    defaultMessage: '上门自提',
                  })}
                </Text>
              </View>
              {Index === 1 ? (
                <View className={styles['content-flex']}>
                  <View className={styles['address-warp']} onClick={link}>
                    <Text className={`${styles['address-text']} ${styles['address-text-first']}`}>{`${
                      logisticsMessage.shipperName ?? intl.formatMessage({ id: 'user.wu', defaultMessage: '无' })
                    } ${logisticsMessage.phone ?? intl.formatMessage({ id: 'user.wu', defaultMessage: '无' })}`}</Text>
                    <Text className={styles['address-text']}>{logisticsMessage.fullAddress}</Text>
                  </View>
                  {storeList.length > 0 && <Icons name="ChevronRight" size={12} />}
                </View>
              ) : (
                <View className={styles['address-warp']}>
                  <Text
                    className={`${styles['address-text']} ${styles['address-text-first']}`}
                  >{`${addressInfo?.receiverName} ${addressInfo?.phone}`}</Text>
                  <Text className={styles['address-text']}>{addressText}</Text>
                </View>
              )}
            </View>
          )}
      </View>
      <View className={styles['submit']} onClick={Submit}>
        {intl.formatMessage({ id: 'confirm', defaultMessage: '确认' })}
      </View>
    </Popup>
  )
}

export default observer(LogisticsLayer)
