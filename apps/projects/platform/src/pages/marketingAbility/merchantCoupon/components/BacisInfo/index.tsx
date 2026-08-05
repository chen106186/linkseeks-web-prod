/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-22 15:34:47
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-09-30 17:10:42
 * @Description: 基本信息
 */
import React from 'react'
import { Badge } from 'antd'
import moment from 'moment'
import { getIntl } from '@linkseeks/i18n'
import {
  MERCHANT_COUPON_TYPE_VOUCHER,
  MERCHANT_COUPON_TYPE_UNIVERSAL,
  MERCHANT_COUPON_TYPE_CATEGORY,
  MERCHANT_COUPON_TYPE_BRAND,
  MERCHANT_COUPON_TYPE_PRODUCT,
} from '@/constants/marketing'
import CustomizeColumn, { IProps as CustomizeColumnProps, DataItem } from '@/components/CustomizeColumn'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()
export type PropsType = Omit<CustomizeColumnProps, 'data' | 'column'> & {
  /**
   * 数据，模拟数据
   */
  dataSource: {
    /**
     * 数据id
     */
    id: number
    /**
     * 优惠券类型
     */
    type: number
    /**
     * 优惠券类型名称
     */
    typeName: string
    /**
     * 领(发)券起始时间
     */
    releaseTimeStart: number
    /**
     * 领(发)券结束时间
     */
    releaseTimeEnd: number
    /**
     * 优惠券名称
     */
    name: string
    /**
     * 券面额
     */
    denomination: number
    /**
     * 状态名称
     */
    statusName: string
    /**
     * 发券数量
     */
    quantity: number
  }
}

const intl = getIntl()

const TIPS_TEXT_MAP = {
  [MERCHANT_COUPON_TYPE_VOUCHER]: intl.formatMessage({ id: 'merchantCoupon.couponUsingCanPurchase' }),
  [MERCHANT_COUPON_TYPE_UNIVERSAL]: intl.formatMessage({ id: 'merchantCoupon.generalAllCategoriesCommodities' }),
  [MERCHANT_COUPON_TYPE_CATEGORY]: intl.formatMessage({ id: 'merchantCoupon.suitForSpecialCustomerCategoryName' }),
  [MERCHANT_COUPON_TYPE_BRAND]: intl.formatMessage({ id: 'merchantCoupon.suitForSpecialBrandName' }),
  [MERCHANT_COUPON_TYPE_PRODUCT]: intl.formatMessage({ id: 'merchantCoupon.suitForSpecialGoods' }),
}

const CouponBacisInfo: React.FC<PropsType> = (props: PropsType) => {
  const { dataSource, ...rest } = props

  const basicInfo: DataItem[] = [
    {
      title: intl.formatMessage({ id: 'merchantCoupon.activityID' }),
      value: dataSource.id || '',
    },
    {
      title: intl.formatMessage({ id: 'merchantCoupon.couponTypeName' }),
      value: dataSource.typeName || '',
      columnProps: {
        tips: true,
        tipsText: TIPS_TEXT_MAP[dataSource.type] || '',
      },
    },
    {
      title: intl.formatMessage({ id: 'merchantCoupon.couponStartTime' }),
      value: dataSource.releaseTimeStart ? moment(dataSource.releaseTimeStart).format('YYYY-MM-DD HH:mm:ss') : '',
    },
    {
      title: intl.formatMessage({ id: 'merchantCoupon.activityName' }),
      value: dataSource.name,
    },
    {
      title: intl.formatMessage({ id: 'merchantCoupon.moneySize' }),
      value: `${translate('web.common.currencySymbol')} ${dataSource.denomination || ''}`,
    },
    {
      title: intl.formatMessage({ id: 'merchantCoupon.couponEndTime' }),
      value: dataSource.releaseTimeEnd ? moment(dataSource.releaseTimeEnd).format('YYYY-MM-DD HH:mm:ss') : '',
    },
    {
      title: intl.formatMessage({ id: 'merchantCoupon.innerState' }),
      value: <Badge color="blue" text={dataSource.statusName} />,
    },
    {
      title: intl.formatMessage({ id: 'merchantCoupon.couponAmount' }),
      value: dataSource.quantity,
    },
  ]

  return <CustomizeColumn title={intl.formatMessage({ id: 'merchantCoupon.baseInfo' })} {...rest} data={basicInfo} />
}

export default CouponBacisInfo
