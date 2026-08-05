/*
 * @Description: 商品详情配送区块组件
 */
import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { getWebIntl } from '@/utils/locales'
import { getLogisticsShipperAddressGet, GetLogisticsShipperAddressGetResponse } from '@apps/apis'
import { SelectAreaItemType, UserInfoType } from '@/types/global'
import { deliveryService } from '@apps/services'
import DeliveryAddress from '@/components/DeliveryAddress'
import useDelivertAddress from '@/hooks/useDelivertAddress'
import { ProductInfoType } from '../../types'
import styles from './index.module.less'
import { useGlobalConext } from '@/context/globalProvider'

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
  /** 限制模式1: 配送区域，2：不配送区域 */
  limitWay?: number
  onAreaState: (state: boolean) => void
  setDeliveryStateMain?: (state: boolean) => void
}

const Delivery: React.FC<DeliveryProps> = (props) => {
  const { productInfo, limitWay = 1, onAreaState, setDeliveryStateMain } = props
  const { userInfo, currentCity } = useGlobalConext()
  const receiverInfo = deliveryService.getDelivery()
  const [currentReceiverInfo, setCurrentReceiverInfo] = useState<SelectAreaItemType | undefined>(
    receiverInfo || currentCity,
  )
  const [addressInfo, setAddressInfo] = useState<GetLogisticsShipperAddressGetResponse>()
  const [deliveryState, setDeliveryState] = useState<boolean>(true)
  const translate = getWebIntl()

  const LogisticsType: { [key: number]: string } = {
    1: translate('web.resource.mall.wuliu'),
    2: translate('web.resource.mall.ziti'),
    3: translate('web.resource.mall.wuxupeisong'),
    4: translate('web.resource.mall.wuliu') + '+' + translate('web.resource.mall.ziti'),
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
        const sendAddressId = productInfo.logistics?.sendAddressId
        if (sendAddressId) {
          getAddressInfo(sendAddressId)
        }
        // 全区域配送或者是无需配送的物流方式时
        if (productInfo.isAllArea || productInfo.logistics.deliveryType === 3) {
          onAreaState(true)
          if (setDeliveryStateMain) {
            setDeliveryStateMain(true)
          }
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
              if (setDeliveryStateMain) {
                setDeliveryStateMain(state)
              }
            } else {
              const state = limitWay === 1 ? false : true
              setDeliveryState(state)
              onAreaState(state)
              if (setDeliveryStateMain) {
                setDeliveryStateMain(state)
              }
            }
          }
        }
      } else {
        onAreaState(true)
        if (setDeliveryStateMain) {
          setDeliveryStateMain(true)
        }
      }
    }
  }, [productInfo])

  const handleCityChange = (selectInfo: SelectAreaItemType, isSave = false) => {
    setCurrentReceiverInfo(selectInfo)
    if (isSave) {
      deliveryService.setDelivery(JSON.stringify(selectInfo))
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
          const state = limitWay === 1 ? true : false
          setDeliveryState(state)
          onAreaState(state)
          if (setDeliveryStateMain) {
            setDeliveryStateMain(state)
          }
        } else {
          const state = limitWay === 1 ? false : true
          setDeliveryState(state)
          onAreaState(state)
          if (setDeliveryStateMain) {
            setDeliveryStateMain(state)
          }
        }
      }
    }
  }

  return (
    <>
      <div className={cx(styles.product_info_line, styles.mar_top_10, styles.logistics)}>
        <div className={styles.product_info_line_label}>{translate('web.resource.mall.peisong')}</div>
        <div className={cx(styles.product_info_line_brief, styles.row)}>
          {/* 自提和无需配送时不显示配送地址 */}
          {![2, 3].includes(productInfo?.logistics.deliveryType) && (
            <>
              <span className={styles.text} style={{ marginRight: 4 }}>
                {addressInfo?.provinceName}
                {addressInfo?.cityName}
              </span>
              <span className={styles.text_to}>{translate('web.common.zhi')}</span>
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
            <span className={styles.text_not_allow}>{translate('web.resource.mall.gaidiquzanbuzhichipeisong')}</span>
          </div>
        </div>
      )}
    </>
  )
}

export default Delivery
