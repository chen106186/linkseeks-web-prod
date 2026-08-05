/*
 * @Author: GHua
 * @Date: 2022-02-18 10:36:43
 * @LastEditTime: 2022-04-02 10:30:03
 * @LastEditors: GHua
 * @Description: 商品详情配送区块组件
 */
import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { getLogisticsShipperAddressGet, GetLogisticsShipperAddressGetResponse } from '@apps/apis'
import { ProductInfoType } from '../../types'
import useDelivertAddress from '../../../hooks/useDelivertAddress'
import DeliveryAddress from '../../../components/DeliveryAddress'
import { SelectAreaItemType } from '../../../components/DeliveryAddress/types'
import { RECEIVER_INFO_KEY } from '../../../constants'
import { useIntl } from '@linkseeks/i18n'
import { getCookie, setCookie } from '@/utils/cookie'
import styles from './index.less'
interface AreaItemType {
  cityCode: string
  cityName: string
  isAllCity: boolean | null
  isAllRegion?: boolean | null
  provinceCode: string
  provinceName: string
  regionCode?: string
  regionName?: string
}

interface DeliveryProps {
  /** 商品详情信息 */
  productInfo: ProductInfoType
  /** 用户登录信息 */
  userInfo?: {
    memberId: number
    roleId: number
  }
  /** 限制模式1: 配送区域，2：不配送区域 */
  limitWay?: number
  currentCity: SelectAreaItemType | undefined
  onAreaState: (state: boolean) => void
}

const receiverInfo = getCookie(RECEIVER_INFO_KEY, 'json') as SelectAreaItemType | undefined

const Delivery: React.FC<DeliveryProps> = (props) => {
  const { productInfo, limitWay = 1, userInfo, currentCity, onAreaState } = props
  const [currentReceiverInfo, setCurrentReceiverInfo] = useState<SelectAreaItemType | undefined>(
    receiverInfo || currentCity,
  )
  const [addressInfo, setAddressInfo] = useState<GetLogisticsShipperAddressGetResponse>()
  const [deliveryState, setDeliveryState] = useState<boolean>(true)
  const intl = useIntl()

  const LogisticsType: { [key: number]: string } = {
    1: intl.formatMessage({ id: 'order.index.logistics' }),
    2: intl.formatMessage({ id: 'order.index.SelfMention' }),
    3: intl.formatMessage({ id: 'order.index.NoAddress' }),
    4:
      intl.formatMessage({ id: 'order.index.logistics' }) + '+' + intl.formatMessage({ id: 'order.index.SelfMention' }),
  }

  const getAddressInfo = (id: number) => {
    getLogisticsShipperAddressGet({ id: String(id) }).then((res) => {
      if (res.code === 1000) {
        setAddressInfo(res.data)
      }
    })
  }

  useEffect(() => {
    if (productInfo) {
      if (productInfo.logistics.deliveryType !== 2) {
        const sendAddress = productInfo.logistics?.sendAddressId
        if (sendAddress) {
          getAddressInfo(sendAddress)
        }
        // 全区域配送或者是无需配送的物流方式时
        if (productInfo.isAllArea || productInfo.logistics.deliveryType === 3) {
          onAreaState(true)
        } else {
          // 判断当前定位是否在配置范围内
          if (productInfo.commodityAreaList && productInfo.commodityAreaList.length > 0 && currentCity) {
            if (
              productInfo.commodityAreaList.some(
                (item: AreaItemType) =>
                  item.provinceCode === currentCity.provinceCode &&
                  (item.isAllCity === false ? item.cityCode === currentCity.cityCode : true) &&
                  (item.isAllRegion === false ? item.regionCode === currentCity.districtCode : true),
              )
            ) {
              const state = limitWay === 1 ? true : false
              setDeliveryState(limitWay === 1 ? true : false)
              onAreaState(state)
            } else {
              const state = limitWay === 1 ? false : true
              setDeliveryState(state)
              onAreaState(state)
            }
          }
        }
      } else {
        onAreaState(true)
      }
    }
  }, [productInfo])

  const handleCityChange = (selectInfo: SelectAreaItemType, isSave = false) => {
    setCurrentReceiverInfo(selectInfo)
    if (isSave) {
      setCookie(RECEIVER_INFO_KEY, JSON.stringify(selectInfo))
    }
    // 如果商品不是全区域可配送，则根据配送区域判断选中地址是否在配送范围内
    if (productInfo && !productInfo.isAllArea) {
      if (productInfo.commodityAreaList && productInfo.commodityAreaList.length > 0) {
        if (
          productInfo.commodityAreaList.some(
            (item: AreaItemType) =>
              item.provinceCode === selectInfo.provinceCode &&
              (item.isAllCity === false ? item.cityCode === selectInfo.cityCode : true) &&
              (item.isAllRegion === false ? item.regionCode === selectInfo.districtCode : true),
          )
        ) {
          setDeliveryState(true)
          onAreaState(true)
        } else {
          setDeliveryState(false)
          onAreaState(false)
        }
      }
    }
  }

  return (
    <>
      <div className={cx(styles.product_info_line, styles.mar_top_10, styles.logistics)}>
        <div className={styles.product_info_line_label}>{intl.formatMessage({ id: 'mall.peisong' })}</div>
        <div className={cx(styles.product_info_line_brief, styles.row)}>
          {/* 自提和无需配送时不显示配送地址 */}
          {![2, 3].includes(productInfo?.logistics.deliveryType) && (
            <>
              <span className={styles.text} style={{ marginRight: 4 }}>
                {addressInfo?.provinceName}
                {addressInfo?.cityName}
              </span>
              <span className={styles.text_to}>{intl.formatMessage({ id: 'mall.to', defaultMessage: '至' })}</span>
              <DeliveryAddress
                value={currentReceiverInfo}
                hook={() => useDelivertAddress(userInfo)}
                onSelect={handleCityChange}
              />
              <span className={styles.text_split}>|</span>
            </>
          )}
          <span className={styles.text}>{LogisticsType[productInfo?.logistics?.deliveryType || 1]}</span>
        </div>
      </div>
      {!deliveryState && (
        <div className={cx(styles.product_info_line, styles.mar_top_8)}>
          <div className={styles.product_info_line_label}></div>
          <div className={cx(styles.product_info_line_brief, styles.row)}>
            <span className={styles.text_not_allow}>
              {intl.formatMessage({ id: 'delivery.address.notAllow', defaultMessage: '该地区暂不支持配送' })}
            </span>
          </div>
        </div>
      )}
    </>
  )
}

export default Delivery
