/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-22 16:45:58
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-12 11:47:16
 * @Description: 优惠券规则
 */
import React from 'react'
import { getIntl } from '@linkseeks/i18n'
import moment from 'moment'
import {
  MERCHANT_COUPON_RECEIVE_FRONT,
  MERCHANT_COUPON_RECEIVE_DESIGNATED,
  MERCHANT_COUPON_RECEIVE_ACTIVITY,
  MERCHANT_COUPON_RECEIVE_OPERATE,
} from '@/constants/marketing'
import CustomizeColumn, { IProps as CustomizeColumnProps, DataItem } from '@/components/CustomizeColumn'
import { getWebIntl } from '@apps/locales'

const intl = getIntl()
const translate = getWebIntl()
export type PropsType = Omit<CustomizeColumnProps, 'data' | 'column'> & {
  /**
   * 数据
   */
  dataSource: {
    /**
     * 领券方式
     */
    getWay: number
    /**
     * 领券方式名称
     */
    getWayName: string
    /**
     * 券有效起始时间
     */
    effectiveTimeStart: number
    /**
     * 券有效结束时间
     */
    effectiveTimeEnd: number
    /**
     * 自领取开始时间,券多少天失效
     */
    invalidDay: number
    /**
     * 使用条件,满多少金额可用
     */
    useConditionMoney: number
    /**
     * 使用条件说明
     */
    useConditionDesc: string
    /**
     * 每日可领取
     */
    conditionGetDay: number
    /**
     * 每会员ID总共可领取
     */
    conditionGetTotal: number
  }
}

const TIPS_TEXT_MAP = {
  [MERCHANT_COUPON_RECEIVE_FRONT]: intl.formatMessage({ id: 'merchantCoupon.usersReceiveCoupons' }),
  [MERCHANT_COUPON_RECEIVE_DESIGNATED]: intl.formatMessage({ id: 'merchantCoupon.distributeCoupons' }),
  [MERCHANT_COUPON_RECEIVE_ACTIVITY]: intl.formatMessage({ id: 'merchantCoupon.variatyUseCoupons' }),
  [MERCHANT_COUPON_RECEIVE_OPERATE]: intl.formatMessage({ id: 'merchantCoupon.operationCoupons' }),
}

const CouponRules: React.FC<PropsType> = (props: PropsType) => {
  const { dataSource, ...rest } = props

  const basicInfo: DataItem[] = [
    {
      title: intl.formatMessage({ id: 'merchantCoupon.getCouponsWay' }),
      value: dataSource.getWayName,
      columnProps: {
        tips: true,
        tipsText: TIPS_TEXT_MAP[dataSource.getWay] || '',
      },
    },
    {
      title: intl.formatMessage({ id: 'merchantCoupon.ValidityStartTime' }),
      value: dataSource.effectiveTimeStart ? moment(dataSource.effectiveTimeStart).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
    {
      title: intl.formatMessage({ id: 'merchantCoupon.useCondition' }),
      value: `${intl.formatMessage({ id: 'merchantCoupon.OrderFull' })} ${translate('web.common.currencySymbol')}${
        dataSource.useConditionMoney || ''
      } ${intl.formatMessage({ id: 'merchantCoupon.use' })}`,
    },
    dataSource.conditionGetTotal && dataSource.conditionGetDay
      ? {
          title: intl.formatMessage({ id: 'merchantCoupon.ReceivingConditions' }),
          value: `${
            intl.formatMessage({ id: 'merchantCoupon.vipTotalHas' }) +
            dataSource.conditionGetTotal +
            intl.formatMessage({ id: 'merchantCoupon.zhang' })
          } ， ${
            intl.formatMessage({ id: 'merchantCoupon.daily' }) +
            dataSource.conditionGetDay +
            intl.formatMessage({ id: 'merchantCoupon.zhang' })
          } `,
        }
      : null,
    {
      title: intl.formatMessage({ id: 'merchantCoupon.ExpirationDate' }),
      value: dataSource.effectiveTimeEnd
        ? moment(dataSource.effectiveTimeEnd).format('YYYY-MM-DD HH:mm:ss')
        : `${intl.formatMessage({
            id: 'merchantCoupon.components.couponRules.effectiveTimeEnd',
            days: dataSource.invalidDay || '',
          })}`,
    },
    {
      title: intl.formatMessage({ id: 'merchantCoupon.instructions' }),
      value: dataSource.useConditionDesc,
    },
  ].filter(Boolean)

  return <CustomizeColumn title={intl.formatMessage({ id: 'merchantCoupon.couponRules' })} {...rest} data={basicInfo} />
}

export default CouponRules
