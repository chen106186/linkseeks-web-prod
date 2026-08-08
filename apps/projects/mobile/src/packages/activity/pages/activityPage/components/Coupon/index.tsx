import React, { useEffect, useState } from 'react'
import { Toast, View, Text } from '@apps/mobile-ui'
import { dateFmt } from '@/utils/date'
import { pxTransform, hideLoading, showLoading } from '@apps/mobile-services/utils/taro'
import classNames from 'classnames'
import Coupon, { CouponDataType } from '@/components/Coupon'
import { useIntl, getI18n } from '@linkseeks/i18n'
import Router from '@/utils/router'
import { postMarketingMobileCouponReceive } from '@apps/apis'
import { CouponType } from '../../useActivityLayout'
import styles from './index.module.scss'

interface Iprops {
  dataSource: CouponType
  shopId: number
  activityId: number
}
/** 未登录 */
const NO_LOGIN = 0
/** 不符合领取条件 */
const ILLEGAL = 1
/** 未领取 */
const CAN_PICK = 2
/** 已领取，去使用 */
const HAS_PICK = 3

const CouponContainer = (props: Iprops) => {
  const { dataSource, shopId, activityId } = props
  const intl = useIntl()
  const [couponList, setCouponList] = useState<CouponType>([])
  const language = getI18n().language

  useEffect(() => {
    setCouponList(dataSource)
  }, [dataSource])

  const handleClick = async (values: CouponDataType & { canReceive: 0 | 1 | 2 | 3 | (number & {}) }) => {
    if (values.canReceive === NO_LOGIN) {
      Router.navigateTo('user/login', {
        redirect: {
          name: 'Activity',
          params: {
            id: activityId,
          },
        },
      })
      return
    }
    if (values.canReceive === HAS_PICK) {
      // 已领取
      Toast.show({
        title: intl.formatMessage({
          id: 'activity.coupon.hasReceive',
          defaultMessage: '优惠券已领取，请到我的优惠券查看使用',
        }),
        icon: 'none',
      })
      return
    }

    if (values.canReceive === ILLEGAL) {
      Toast.show({
        title: intl.formatMessage({ id: 'activity.coupon.illegal', defaultMessage: '您不满足该券领取条件！' }),
        icon: 'none',
      })
      return
    }
    try {
      showLoading({ title: intl.formatMessage({ id: 'activity.coupon.receiving', defaultMessage: '正在领取' }) })
      const { data, code, message } = await postMarketingMobileCouponReceive({
        shopId,
        belongType: values.belongType,
        couponId: values.id,
      })
      if (code === 1000) {
        setCouponList((prev) =>
          prev.map((_item) => {
            if (_item.id === values.id) {
              return {
                ..._item,
                canReceive: data.canReceive,
              }
            }
            return _item
          }),
        )
        Toast.show({
          title: intl.formatMessage({
            id: 'activity.coupon.hasReceive',
            defaultMessage: '优惠券已领取，请到我的优惠券查看使用',
          }),
          icon: 'none',
        })
      } else {
        Toast.show({
          title: intl.formatMessage({ id: `${code}`, defaultMessage: message }),
          icon: 'none',
        })
      }
    } finally {
      hideLoading()
    }
  }

  const renderRight = (data: any) => {
    return (
      <>
        {data.status === 0 ? (
          <View
            className={classNames(styles['coupon-small-action'], language !== 'zh-CN' ? styles['auto-width'] : {})}
            onClick={() => handleClick(data)}
          >
            <Text className={styles['coupon-small-action-text']}>
              {intl.formatMessage({ id: 'activity.coupon.getIt', defaultMessage: '立即领取' })}
            </Text>
          </View>
        ) : null}
        {data.status === 1 ? (
          <View
            className={classNames(styles['coupon-small-action'], language !== 'zh-CN' ? styles['auto-width'] : {})}
            // onClick={() => handleClick(data)}
          >
            <Text className={classNames(styles['coupon-small-action-text'], styles['coupon-disabled'])}>
              {intl.formatMessage({ id: 'activity.coupon.hasGet', defaultMessage: '已领取' })}
            </Text>
          </View>
        ) : null}
      </>
    )
  }

  if (couponList.length === 0) {
    return <View style={{ marginTop: pxTransform(12) }} />
  }

  return (
    <View className={styles.coupon}>
      {couponList?.map((_item: any) => {
        const {
          id,
          denomination,
          useConditionMoney,
          name,
          releaseTimeStart,
          releaseTimeEnd,
          typeName,
          canReceive,
          belongType,
        } = _item
        // const isGot = hasGotCouponList.includes(`${shopId}-${belongType}-${id}`);
        const data = {
          id,
          denomination,
          useConditionMoney,
          name,
          effectiveTimeEnd: dateFmt(new Date(releaseTimeEnd), 'YYYY-MM-DD HH:mm:ss'),
          /** canReceive 1: 不符合条件， 2：可领取， 3：已领取 */
          status: canReceive > 2 ? 1 : 0,
          from: typeName,
          belongType,
          canReceive,
        }
        return (
          <View className={styles.couponItem} key={_item.id}>
            <Coupon
              data={data as unknown as CouponDataType}
              size="small"
              onClick={handleClick}
              customRenderRight={renderRight}
            />
          </View>
        )
      })}
    </View>
  )
}

export default CouponContainer
