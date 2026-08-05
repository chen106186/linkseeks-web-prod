/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-22 16:45:58
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-12 11:48:27
 * @Description: 优惠券规则
 */
import React from 'react'
import { formatTimeString } from '@/utils'
import {
  MERCHANT_COUPON_RECEIVE_FRONT,
  MERCHANT_COUPON_RECEIVE_DESIGNATED,
  MERCHANT_COUPON_RECEIVE_ACTIVITY,
  MERCHANT_COUPON_RECEIVE_OPERATE,
} from '@/constants/const/marketing'
import CustomizeColumn, { IProps as CustomizeColumnProps, DataItem } from '@/components/CustomizeColumn'

export type PropsType = Omit<CustomizeColumnProps, 'data' | 'column'> & {
  /**
   * 数据，模拟数据
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
  [MERCHANT_COUPON_RECEIVE_FRONT]: '用户在前台商城内主动领取优惠券',
  [MERCHANT_COUPON_RECEIVE_DESIGNATED]: '运营人员在发券页面将优惠券分发给指定会员',
  [MERCHANT_COUPON_RECEIVE_ACTIVITY]: '在各类营销活动中绑定的活动用优惠券',
  [MERCHANT_COUPON_RECEIVE_OPERATE]:
    '用于会员运营时使用发放会员运营优惠券激励会员完成某个任务，如成为会员、签到、登录等',
}

const CouponRules: React.FC<PropsType> = (props: PropsType) => {
  const { dataSource, ...rest } = props

  const basicInfo: DataItem[] = [
    {
      title: '领券方式',
      value: dataSource.getWayName,
      columnProps: {
        tips: true,
        tipsText: TIPS_TEXT_MAP[dataSource.getWay] || '',
      },
    },
    {
      title: '有效期开始时间',
      value: dataSource.effectiveTimeStart ? formatTimeString(dataSource.effectiveTimeStart) : '-',
    },
    {
      title: '使用条件',
      value: `订单满 ¥ ${dataSource.useConditionMoney || ''} 使用`,
    },
    dataSource.conditionGetTotal && dataSource.conditionGetDay
      ? {
          title: '领取条件',
          value: `每会员ID总共可领取 ${dataSource.conditionGetTotal} 张，每日 ${dataSource.conditionGetDay} 张`,
        }
      : null,
    {
      title: '有效期结束时间',
      value: dataSource.effectiveTimeEnd
        ? formatTimeString(dataSource.effectiveTimeEnd)
        : `领取${dataSource.invalidDay || ''}天后失效`,
    },
    {
      title: '使用说明',
      value: dataSource.useConditionDesc,
    },
  ].filter(Boolean) as DataItem[]

  return <CustomizeColumn title="优惠券规则" {...rest} data={basicInfo} />
}

export default CouponRules
