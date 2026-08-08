import React from 'react'
import { View, Text, Image } from '@apps/mobile-ui'
import cx from 'classnames'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.module.scss'

export interface NotEvaluatedItemData {
  /**
   * 数据id
   */
  id: number
  /**
   * 商品图片
   */
  picture: string
  /**
   * 商品名称
   */
  name: string
  /**
   * 商品id
   */
  productId: number
  /**
   * 采购数量
   */
  purchaseCount: number
  /**
   * 单位
   */
  unit: string
  /**
   * 单价
   */
  price: number
  /**
   * 商品所在订单id
   */
  orderId: number
}

export interface NotEvaluatedItemProps {
  /**
   * 数据源
   */
  data: NotEvaluatedItemData
  /**
   * 自定义样式
   */
  className?: string
  /**
   * 写评论按钮点击事件
   */
  onEvaluate?: (orderProductId: number) => void
}

const NotEvaluatedItem: React.FC<NotEvaluatedItemProps> = (props: NotEvaluatedItemProps) => {
  const { data, className, onEvaluate } = props
  const intl = useIntl()
  const handleEvaluate = (id: number) => {
    // 写评价
    if (onEvaluate) {
      onEvaluate(id)
    }
  }

  return (
    <View className={cx(styles['notEvaluatedItem'], className)}>
      <View className={styles['notEvaluatedItem-evaluated-item-left']}>
        <View className={styles['notEvaluatedItem-evaluated-item-pic']}>
          <Image src={data.picture} className={styles['notEvaluatedItem-evaluated-item-pic-image']} />
        </View>
      </View>
      <View className={styles['notEvaluatedItem-evaluated-item-right']}>
        <Text className={styles['notEvaluatedItem-evaluated-item-name']}>{data.name}</Text>
        <View className={styles['notEvaluatedItem-evaluated-item-action']}>
          <View className={cx(styles['notEvaluatedItem-button'])} onClick={() => handleEvaluate(data.id)}>
            <Text
              className={cx(
                styles['notEvaluatedItem-button-text'],
                styles['notEvaluatedItem-button-primary-text'],
                styles['notEvaluatedItem-button-small-text'],
                styles['notEvaluatedItem-button-primary-text__plain'],
              )}
            >
              {intl.formatMessage({ id: 'evaluatingManage.xiepingjia', defaultMessage: '写评价' })}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}
export default NotEvaluatedItem
