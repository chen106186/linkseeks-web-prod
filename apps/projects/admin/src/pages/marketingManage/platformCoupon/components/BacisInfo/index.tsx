/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-22 15:34:47
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-09-30 17:11:02
 * @Description: 基本信息
 */
import React from 'react'
import { Badge } from 'antd'
import { formatTimeString } from '@/utils'
import {
  MERCHANT_COUPON_TYPE_VOUCHER,
  MERCHANT_COUPON_TYPE_UNIVERSAL,
  MERCHANT_COUPON_TYPE_CATEGORY,
  MERCHANT_COUPON_TYPE_BRAND,
  MERCHANT_COUPON_TYPE_PRODUCT,
} from '@/constants/const/marketing'
import CustomizeColumn, { IProps as CustomizeColumnProps, DataItem } from '@/components/CustomizeColumn'

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

const TIPS_TEXT_MAP = {
  [MERCHANT_COUPON_TYPE_VOUCHER]:
    '使用此券，可0元购买绑定的商品，用于特殊使用场景，如抽奖时奖品为商品时，关联0元购买抵扣券',
  [MERCHANT_COUPON_TYPE_UNIVERSAL]: '全品类全商品通用',
  [MERCHANT_COUPON_TYPE_CATEGORY]: '适用于特定品类',
  [MERCHANT_COUPON_TYPE_BRAND]: '适用于特定品牌',
  [MERCHANT_COUPON_TYPE_PRODUCT]: '适用于特定商品',
}

const CouponBacisInfo: React.FC<PropsType> = (props: PropsType) => {
  const { dataSource, ...rest } = props

  const basicInfo: DataItem[] = [
    {
      title: '活动ID',
      value: dataSource.id || '',
    },
    {
      title: '优惠券类型',
      value: dataSource.typeName || '',
      columnProps: {
        tips: true,
        tipsText: TIPS_TEXT_MAP[dataSource.type] || '',
      },
    },
    {
      title: '领(发)券开始时间',
      value: dataSource.releaseTimeStart ? formatTimeString(dataSource.releaseTimeStart) : '',
    },
    {
      title: '活动名称',
      value: dataSource.name,
    },
    {
      title: '券面额',
      value: `¥ ${dataSource.denomination || ''}`,
    },
    {
      title: '领(发)券结束时间',
      value: dataSource.releaseTimeEnd ? formatTimeString(dataSource.releaseTimeEnd) : '',
    },
    {
      title: '内部状态',
      value: <Badge color="blue" text={dataSource.statusName} />,
    },
    {
      title: '发券数量',
      value: dataSource.quantity,
    },
  ]

  return <CustomizeColumn title="基本信息" {...rest} data={basicInfo} />
}

export default CouponBacisInfo
