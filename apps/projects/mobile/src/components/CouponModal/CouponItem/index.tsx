import React from 'react'
import { Image, View, Text } from '@apps/mobile-ui'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import { getOssUrlPath } from '@apps/constants'

import styles from './index.module.scss'

const CouponPlatfromIcon = getOssUrlPath('/miniprogram/assets/coupon/coupon_platform.png')
const CouponShopIcon = getOssUrlPath('/miniprogram/assets/coupon/coupon_shop.png')

interface CouponItemProps {
  name?: string
  belongType?: number
  useConditionMoney?: number | string
  expiredDay?: number | string
  denomination?: number | string
  closeModal?: () => void
  storeId?: number
  [key: string]: any
}

const CouponItem: React.FC<CouponItemProps> = (props: CouponItemProps) => {
  const {
    name,
    belongType,
    useConditionMoney,
    validTimeEnd,
    denomination,
    brandIds,
    categoryIds,
    productIds,
    storeId,
    closeModal,
  } = props
  const intl = useIntl()
  const _tab = () => {
    closeModal?.()
    const param: any = {
      priceTypeList: '1',
    }
    if (belongType === 1) {
      Router.navigateTo('commodityMerge/stocksSourcing/index')
    } else {
      if (storeId) {
        param.id = storeId
      }
      if (brandIds) {
        param.brandIdList = brandIds
      }
      if (categoryIds) {
        param.categoryIdList = brandIds
      }
      if (productIds) {
        param.idInList = productIds ? productIds.join(',') : ''
      }
      Router.navigateTo('commodityMerge/stocksSourcing/index', { ...param })
    }
  }

  const getExpiredDay = (endTime: number) => {
    const nowTime = new Date().getTime()

    const lefttime = endTime - nowTime // 距离结束时间的毫秒数

    if (lefttime > 0) {
      const leftd = Math.floor(lefttime / (1000 * 60 * 60 * 24)) // 计算天数
      return leftd === 0 ? 1 : leftd
    } else {
      return 0
    }
  }

  return (
    <View className={styles['container']}>
      {/* <Image className={styles['icon']} src={belongType === 1 ? CouponPlatfromIcon : CouponShopIcon} /> */}
      {/* <View className={styles['left']}>
        <Text className={styles['title']}>{name}</Text>
        <Text className={styles['info']}>
          {intl.formatMessage({ id: 'couponModal_couponItem_useConditionMoney', data: useConditionMoney })}｜{' '}
          {intl.formatMessage({ id: 'couponModal_couponItem_expiredDay', data: getExpiredDay(validTimeEnd) })}
        </Text>
        <View className={styles['bottom']}>
          <Text className={styles['money']}>
            {intl.formatMessage({ id: 'currency' })}
            <Text className={styles['moneyInner']}>{denomination}</Text>
          </Text>
          <View className={styles['btn']} onClick={_tab}>
            <Text className={styles['btnText']}>{intl.formatMessage({ id: 'couponModal_couponItem_btnText' })}</Text>
          </View>
        </View>
      </View> */}
      <View className={styles['left']}>
        <Text className={styles['money']}>
          {intl.formatMessage({ id: 'currency' })}
          <Text className={styles['moneyInner']}>{denomination}</Text>
        </Text>
      </View>
      <View className={styles['right']}>
        <Text className={styles['title']}>{name}</Text>
        <Text className={styles['info']}>
          {intl.formatMessage({ id: 'couponModal_couponItem_useConditionMoney', data: useConditionMoney })}｜{' '}
          {intl.formatMessage({ id: 'couponModal_couponItem_expiredDay', data: getExpiredDay(validTimeEnd) })}
        </Text>
        <Text className={styles['btnText']} onClick={_tab}>
          立即使用
        </Text>
      </View>
    </View>
  )
}

CouponItem.defaultProps = {
  name: '',
  belongType: 1,
  useConditionMoney: '',
  expiredDay: '',
  denomination: '',
}

export default CouponItem
