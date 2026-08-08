/*
 * @Author: XieZhiXiong
 * @Date: 2021-08-18 16:43:01
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-09-30 14:52:14
 * @Description: 优惠券
 */
import React, { CSSProperties, useState } from 'react'
import cx from 'classnames'
import { View, Text, Image } from '@apps/mobile-ui'
import { dateFormat } from '@/utils/date'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { getOssUrlPath } from '@apps/constants'
import { useIntl } from '@linkseeks/i18n'
import ImageBox from '../ImageBox'
import Button from './components/Button'
import CouponList from './List'
import styles from './index.module.scss'

export type CouponDataType = {
  /**
   * 数据id
   */
  id: number
  /**
   * 所属类型1-平台2-商家
   */
  belongType: 1 | 2 | ({} & number)
  /**
   * 优惠券名称
   */
  name: string
  /**
   * 优惠券类型，如果所属类型为平台则有1-0元抵扣券2-平台通用优惠券,如果所属类型为商家则有1-0元抵扣券2-商家通用优惠券3-品类优惠券4-品牌优惠券5-商品优惠券
   */
  type: number
  /**
   * 优惠券类型名称
   */
  typeName: string
  /**
   * 面额
   */
  denomination: number
  /**
   * 使用条件
   */
  useConditionMoney: number
  /**
   * 有效类型名称
   */
  effectiveTypeName: string
  /**
   * 固定有效时间，券有效起始时间
   */
  effectiveTimeStart?: string | number
  /**
   * 固定有效时间，券有效结束时间
   */
  effectiveTimeEnd?: string | number
  /**
   * 至领取xx天失效
   */
  invalidDay?: number
  /**
   * 品牌id集合
   */
  brandIds?: number[]
  /**
   * 品类id集合
   */
  categoryIds?: number[]
  /**
   * skuId集合
   */
  skuIds?: number[]
  /**
   * 优惠券来源
   */
  from?: string
  /**
   * 优惠券状态
   * 0 未领取* 1 已领取* 2 已使用* 3 已过期
   */
  status?: 0 | 1 | 2 | 3 | (number & {})
  /**
   * 公司logo
   */
  logo?: string
  /**
   * 近期标签
   */
  willOver?: boolean
  newGet?: boolean
  validTimeStart?: string
  validTimeEnd?: string
  code?: string
  useConditionDesc?: string
  completeReceive?: number
}

export interface CouponProps {
  /**
   * 数据
   */
  data: CouponDataType
  /**
   * 大小，可选 default small middle，默认 default
   */
  size?: 'default' | 'small' | 'middle'
  /**
   * 自定义外部样式
   */
  customStyle?: CSSProperties
  /** 优惠券点击事件 */
  onClick?: (data: CouponDataType) => void
  /**
   * 使用方法
   */
  toUse?: Function
  /**
   * 自定义渲染右侧内容
   */
  customRenderRight?: (record: CouponDataType) => React.ReactNode
}

const Coupon = (props: CouponProps) => {
  const { data, size, customStyle, toUse = () => {}, customRenderRight, onClick = null } = props

  const intl = useIntl()
  const [showIllustrate, setShowIllustrate] = useState(false)

  const handleClick = () => {
    toUse?.(data)
    onClick?.(data)
  }

  const formatTime = (time: string | number | undefined, fmt: string = 'YYYY-MM-DD HH:mm'): string => {
    if (typeof time === 'string') {
      return time
    }
    if (typeof time === 'number') {
      return dateFormat(new Date(time), fmt)
    }
    return ''
  }

  const renderRightContent = () => {
    if (customRenderRight) {
      return customRenderRight(data)
    }
    switch (data.status) {
      case 0:
        return (
          <Button type="danger" size="small" onPress={handleClick}>
            {intl.formatMessage({ id: 'coupons.receive.right.now', defaultMessage: '立即领取' })}
          </Button>
        )
      case 1:
        return (
          <Button type="danger" size="small" onPress={handleClick}>
            {intl.formatMessage({ id: 'coupons.use.right.now', defaultMessage: '立即使用' })}
          </Button>
        )
      case 2:
        return (
          <Button size="small" onPress={handleClick}>
            {intl.formatMessage({ id: 'coupons.use.right.now1', defaultMessage: '已使用' })}
          </Button>
        )
      case 3:
        return (
          <Button size="small" onPress={handleClick}>
            {intl.formatMessage({ id: 'coupons.use.right.now2', defaultMessage: '已过期' })}
          </Button>
        )
      default:
        return <></>
    }
  }

  if (size === 'small') {
    return (
      <View className={cx(styles['coupon'], styles['coupon-small'])} style={customStyle}>
        <View className={cx(styles['coupon-left-item'], styles['coupon-small-left'])}>
          <View className={cx(styles['coupon-face-wrap'], styles['coupon-small-face-wrap'])}>
            <Text className={cx(styles['coupon-yuan'], styles['coupon-small-yuan'])}>
              {intl.formatMessage({ id: 'currency' })}
            </Text>
            <Text className={cx(styles['coupon-denomination'], styles['coupon-small-denomination'])}>
              {data.denomination}
            </Text>
          </View>
          <Text className={cx(styles['coupon-use-condition-money'], styles['coupon-small-use-condition-money'])}>
            {intl.formatMessage({
              id: 'coupons.use.reduction',
              defaultMessage: '满{{money}}立减',
              money: data.useConditionMoney,
            })}
          </Text>
          <View className={cx(styles['coupon-tag'], styles['coupon-small-tag'])}>
            <Text className={cx(styles['coupon-tag-text'], styles['coupon-small-tag-text'])}>
              {data.belongType === 1
                ? intl.formatMessage({ id: 'coupons.belongType_1', defaultMessage: '平台通用' })
                : intl.formatMessage({ id: 'coupons.belongType_2', defaultMessage: '商家优惠券' })}
            </Text>
          </View>
        </View>
        <View className={styles['coupon-small-line-wrap']}>
          <View className={styles['coupon-small-line']} />
        </View>
        <View className={cx(styles['coupon-right'], styles['coupon-small-right'])}>
          {(customRenderRight && customRenderRight(data)) || (
            <>
              {data.status === 0 ? (
                <View className={styles['coupon-small-action']} onClick={handleClick}>
                  <Text className={styles['coupon-small-action-text']}>
                    {intl.formatMessage({ id: 'coupons.receive.right.now', defaultMessage: '立即领取' })}
                  </Text>
                </View>
              ) : null}
              {data.status === 1 ? (
                <View className={styles['coupon-small-action']} onClick={handleClick}>
                  <Text className={styles['coupon-small-action-text']}>
                    {intl.formatMessage({ id: 'coupons.use.right.now', defaultMessage: '立即使用' })}
                  </Text>
                </View>
              ) : null}
            </>
          )}
        </View>
      </View>
    )
  }

  if (size === 'middle') {
    return (
      <View className={cx(styles['coupon'], styles['coupon-middle-item'])} style={customStyle}>
        <View className={cx(styles['coupon-left-item'], styles['coupon-middle-left'])}>
          <View className={styles['coupon-middle-logo-wrap']}>
            <ImageBox source={data.logo!} width="100%" height="100%" className={styles['coupon-middle-logo']} />
          </View>
        </View>
        <View className={styles['coupon-center']}>
          <Text className={cx(styles['coupon-name'], styles['coupon-middle-name'])}>{data.name}</Text>
          <Text className={styles['coupon-use-condition-money']}>
            {intl.formatMessage({
              id: 'coupons.use.can',
              defaultMessage: '满{{money}}可用',
              money: data.useConditionMoney,
            })}
            {` | `}
            {data.invalidDay
              ? intl.formatMessage({
                  id: 'coupons.invalidDay',
                  defaultMessage: '至领取{{day}}天后失效',
                  day: data.invalidDay,
                })
              : intl.formatMessage({
                  id: 'coupons.effectiveTimeEnd',
                  defaultMessage: '有效期至{{date}}',
                  date: formatTime(data.effectiveTimeEnd),
                })}
          </Text>
          <View className={cx(styles['coupon-face-wrap'], styles['coupon-middle-face-wrap'])}>
            <Text className={cx(styles['coupon-yuan'], styles['coupon-middle-yuan'])}>
              {intl.formatMessage({ id: 'currency' })}
            </Text>
            <Text className={cx(styles['coupon-denomination'], styles['coupon-middle-denomination'])}>
              {data.denomination}
            </Text>
          </View>
        </View>
        <View className={cx(styles['coupon-right'], styles['coupon-middle-right'])}>
          {data.status === 0 ? (
            <Button type="danger" size="small" round onPress={handleClick}>
              {intl.formatMessage({ id: 'coupons.receive', defaultMessage: '领取' })}
            </Button>
          ) : null}
          {data.status === 1 ? (
            <Button type="danger" size="small" plain round onPress={handleClick}>
              {intl.formatMessage({ id: 'coupons.use', defaultMessage: '使用' })}
            </Button>
          ) : null}
        </View>
      </View>
    )
  }
  console.log(data)
  return (
    <View className={styles.coupon_view} style={customStyle}>
      {data.completeReceive !== 2 ? (
        <View className={styles['coupon-get']}>
          <Text className={styles['coupon-get-text']}>
            {intl.formatMessage({ id: 'activity.coupon.hasGet', defaultMessage: '已领取' })}
          </Text>
        </View>
      ) : null}
      <View className={styles['coupon']}>
        <View className={styles['coupon-left-item']}>
          <View className={styles['coupon-faceWrap']}>
            <Text className={styles['coupon-yuan']}>{intl.formatMessage({ id: 'currency' })}</Text>
            <Text className={styles['coupon-denomination']}>{data.denomination}</Text>
          </View>
          <Text className={styles['coupon-use-condition-money']}>
            {intl.formatMessage({
              id: 'coupons.use.reduction',
              defaultMessage: '满{{money}}立减',
              money: data.useConditionMoney,
            })}
          </Text>
        </View>
        <View className={styles['coupon-center']}>
          <View className={styles['coupon-tag']}>
            <Text className={styles['coupon-tag-text']}>
              {data.belongType === 1
                ? intl.formatMessage({ id: 'coupons.belongType_1', defaultMessage: '平台通用' })
                : intl.formatMessage({ id: 'coupons.belongType_2', defaultMessage: '商家优惠券' })}
            </Text>
          </View>
          <Text className={styles['coupon-name']}>{data.name}</Text>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text className={styles['coupon-expiration']}>
              {data.invalidDay
                ? intl.formatMessage({
                    id: 'coupons.invalidDay',
                    defaultMessage: '至领取{{day}}天后失效',
                    day: data.invalidDay,
                  })
                : intl.formatMessage({
                    id: 'coupons.effectiveTimeEnd',
                    defaultMessage: '有效期至{{date}}',
                    date: formatTime(data.effectiveTimeEnd),
                  })}
            </Text>
            {/*
              <Image 
                style={{ 
                  width: pxTransform(12), 
                  height: pxTransform(12), 
                  marginLeft: pxTransform(4)  
                }} 
                src={showIllustrate 
                  ? `${getOssUrlPath('/Images/upIcon.svg')}` 
                  : `${getOssUrlPath('/Images/downIcon.svg')}`} 
                onClick={() => setShowIllustrate(!showIllustrate)} /> 
            */}
          </View>
        </View>
        <View className={styles['coupon-right']}>{renderRightContent()}</View>
        {data.willOver && (
          <View className={styles['coupon-right-lable']}>
            <Text className={styles['coupon-right-lable-text']}>
              {intl.formatMessage({ id: 'coupons.will.expire', defaultMessage: '将到期' })}
            </Text>
          </View>
        )}
        {data.newGet && (
          <View className={styles['coupon-right-lable']}>
            <Text className={styles['coupon-right-lable-text']}>
              {intl.formatMessage({ id: 'coupons.new.receive', defaultMessage: '新获得' })}
            </Text>
          </View>
        )}
      </View>
      {showIllustrate && (
        <View className={styles.illustrate}>
          <View className={styles.illustrate_text}>
            {intl.formatMessage({ id: 'coupons.youxiaoqixian', defaultMessage: '有效期限：' })}
            {`${formatTime(data.validTimeStart)}-${formatTime(data.validTimeEnd)}`}
          </View>
          <View className={styles.illustrate_text}>
            {intl.formatMessage({ id: 'coupons.youhuijuanma', defaultMessage: '优惠券码：' })}
            {data.code}
          </View>
          <View className={styles.illustrate_text}>
            {intl.formatMessage({ id: 'coupons.shiyongshuoming', defaultMessage: '使用说明：' })}
            {data.useConditionDesc}
          </View>
        </View>
      )}
    </View>
  )
}

Coupon.List = CouponList

export default Coupon
