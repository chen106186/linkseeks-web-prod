import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { observer } from 'mobx-react-lite'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import Coupon from '@/components/Coupon'
import ImageBox from '@/components/ImageBox'
import Popup from '@/components/Popup'
import { Toast, View, Text } from '@apps/mobile-ui'
import { postMarketingMobileCouponReceive } from '@apps/apis'
import { getOssUrlPath } from '@apps/constants'
import styles from './index.module.scss'

const empty = getOssUrlPath('/miniprogram/assets/images/empty.png')

/**
 * 商户下 商品下 对应选购的规格列表
 */

interface Iprops {
  newShop: any
  showCoupon: boolean
  fnClose: Function
  shopId: number
  fnFullScreenLoading: Function
  seclctCouponList: any
}

const CouponLayer: React.FC<Iprops> = (props: Iprops) => {
  const intl = useIntl()
  const { showCoupon, fnClose, fnFullScreenLoading, shopId = 161, seclctCouponList } = props
  const [couponList, setcouponList] = useState<any>([])
  const fnClosePopup = () => {
    if (fnClose) {
      fnClose()
    }
  }
  /**
   * @param item 当前优惠券
   * @returns 领取优惠券
   */
  const fnGetCoupon = (item: any) => {
    if (item.completeReceive === 3) {
      const params = {
        couponId: item.couponId,
        belongType: item.belongType,
      }
      Router.navigateTo('commodityMerge/stocksSourcing/conponSimilarList', params)
      return
    }
    if (item.completeReceive !== 2) {
      return
    }
    const parmas = {
      shopId,
      belongType: item.belongType,
      couponId: item.couponId,
    }
    fnFullScreenLoading('show')
    postMarketingMobileCouponReceive(parmas).then((res) => {
      fnFullScreenLoading('hide')
      if (res.code === 1000) {
        Toast.show({ title: intl.formatMessage({ id: 'purchase_components_couponLayer_show' }) })
        item.completeReceive = 3
        setcouponList([...couponList])
        // fnetCouponList();
      } else {
        Toast.show({ title: intl.formatMessage({ id: `${res.code}`, defaultMessage: res.message }), icon: 'none' })
      }
    })
  }

  useEffect(() => {
    if (showCoupon) {
      setcouponList(seclctCouponList)
    }
  }, [showCoupon])

  return (
    <Popup visible={showCoupon} onClose={fnClosePopup}>
      <View className={styles['warp']}>
        <View className={styles['title']}>{intl.formatMessage({ id: 'purchase_components_couponLayer_title' })}</View>
        <View className={styles['tips']}>{intl.formatMessage({ id: 'purchase_components_couponLayer_tips' })}</View>
      </View>
      {couponList.length !== 0 && (
        <View className={styles['money-main']}>
          <Coupon.List
            dataSource={couponList}
            customRenderRight={(item: any) => (
              <View
                onClick={() => {
                  fnGetCoupon(item)
                }}
                className={item.completeReceive === 2 ? styles['money-btn'] : styles['un-money-btn']}
              >
                {item.completeReceive === 2
                  ? intl.formatMessage({ id: 'purchase_components_couponLayer_completeReceive_1' })
                  : intl.formatMessage({ id: 'purchase_components_couponLayer_completeReceive_2' })}
              </View>
            )}
          />
        </View>
      )}
      {couponList.length === 0 && (
        <View className={cx(styles['empty'], styles['section'])}>
          <ImageBox source={empty} width={160} height={120} />
          <Text className={styles['empty-text']}>
            {intl.formatMessage({ id: 'purchase_components_couponLayer_empty' })}
          </Text>
        </View>
      )}
    </Popup>
  )
}

export default observer(CouponLayer)
