/*
 * @Author: XieZhiXiong
 * @Date: 2021-08-30 14:48:10
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-06 15:00:43
 * @Description: 售后列表展示柜台
 */
import React, { CSSProperties } from 'react'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Text } from '@apps/mobile-ui'
import { themeLayout } from '@/constants/theme'
import { useIntl } from '@linkseeks/i18n'
import ImageBox from '@/components/ImageBox'
import Descriptions from '@/components/Descriptions'
import AsProductsList, { AsProductsListProps } from '../../../afterTodo/components/AsProductsList'
import styles from './index.module.scss'

export type VenderType = {
  /**
   * 供应商id
   */
  id: number
  /**
   * 供应商名称
   */
  name: string
  /**
   * 供应商logo
   */
  logo: string
}

export interface CounterProps {
  /**
   * 展示数据
   */
  data: {
    /**
     * 供应商信息
     */
    vender: VenderType
    /**
     * 状态名称
     */
    statusName: string
    /**
     * 售后商品
     */
    products: AsProductsListProps['dataSource']
    /**
     * 申请数量
     */
    quantity?: number
    /**
     * 金额
     */
    amount?: number
  }
  /**
   * 自定义渲染 foot左侧
   */
  customRenderFootLeft?: React.ReactNode
  /**
   * 自定义渲染 foot右侧
   */
  customRenderFootRight?: React.ReactNode
  /**
   * 自定义外部样式
   */
  customStyle?: CSSProperties
  /**
   * 点击事件触发
   */
  onPress?: () => void
  /**
   * 售后类型 1 退货 2 换货 3 维修
   */
  afterType: 1 | 2 | 3
  /**
   * 订单类型
   */
  orderType?: number
}

const AsCounter: React.FC<CounterProps> = (props: CounterProps) => {
  const { data, customRenderFootLeft, customRenderFootRight, customStyle, onPress, afterType, orderType } = props

  const intl = useIntl()

  // 标题map
  const TITLE_MAP: { [key: number]: string } = {
    1: intl.formatMessage({ id: 'afterRecords.components.asCounter.refund', defaultMessage: '退款' }),
    2: intl.formatMessage({ id: 'afterRecords.components.asCounter.exchange', defaultMessage: '换货' }),
    3: '',
  }

  const handlePress = () => {
    if (onPress) {
      onPress()
    }
  }

  return (
    <View className={styles['as-counter']} style={customStyle} onClick={handlePress}>
      <View className={styles['as-counter-head']}>
        <View className={styles['as-counter-head-left']}>
          <View className={styles['as-counter-logo']}>
            <ImageBox width="100%" height="100%" source={data.vender.logo} className={styles['as-counter-logo-img']} />
          </View>
          <View className={styles['as-counter-name-wrap']}>
            <Text className={styles['as-counter-name']}>{data.vender.name}</Text>
            <Text className={styles['as-counter-arrow']}>&gt;</Text>
          </View>
        </View>
        <View className={styles['as-counter-head-extra']}>
          <Text className={styles['as-counter-status']}>{data.statusName}</Text>
        </View>
      </View>
      <View className={styles['as-counter-body']}>
        <AsProductsList dataSource={data.products} size="large" orderType={orderType!} />
        <View
          className={styles['as-counter-desc']}
          style={{
            marginTop: afterType !== 3 ? pxTransform(20) : pxTransform(themeLayout['margin-xxs']),
          }}
        >
          <View className={styles['as-counter-desc-left']}>
            <Descriptions.Item
              label={intl.formatMessage({
                id: 'afterRecords.components.asCounter.quantity',
                defaultMessage: '申请数量',
              })}
              customStyle={{
                marginBottom: pxTransform(0),
              }}
              customLabelStyle={{
                color: '#909399',
              }}
              customContentStyle={{
                color: '#909399',
              }}
              customContentWrapStyle={{
                flex: 0,
              }}
            >
              {data.quantity}
            </Descriptions.Item>
          </View>
          {afterType === 1 ? (
            <View className={styles['as-counter-desc-right']}>
              <Descriptions.Item
                label={intl.formatMessage({
                  id: 'afterRecords.components.asCounter.amount',
                  afterType: TITLE_MAP[afterType],
                })}
                customStyle={{
                  marginBottom: pxTransform(0),
                }}
                customContentWrapStyle={{
                  flex: 0,
                }}
              >
                <Text className={styles['as-counter-amount']}>
                  {`${intl.formatMessage({ id: 'currency', defaultMessage: '￥' })}${data.amount}`}
                </Text>
              </Descriptions.Item>
            </View>
          ) : null}
        </View>
      </View>
      {customRenderFootLeft || customRenderFootRight ? (
        <View className={styles['as-counter-foot']}>
          <View className={styles['as-counter-foot-left']}>{customRenderFootLeft}</View>
          <View className={styles['as-counter-foot-right']}>{customRenderFootRight}</View>
        </View>
      ) : null}
    </View>
  )
}

export default AsCounter
