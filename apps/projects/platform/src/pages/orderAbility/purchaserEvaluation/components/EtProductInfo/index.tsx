/**
 * @Description 评价商品信息
 */
import React from 'react'
import { getIntl } from '@linkseeks/i18n'
import { checkIsPointsOrder } from '@/constants/order'
import styles from './index.less'

const intl = getIntl()

export type EtProductInfoType = {
  /**
   * 订单商品记录id
   */
  orderProductId?: number
  /**
   * 商品图片
   */
  pic: string
  /**
   * 价格
   */
  price: number
  /**
   * 商品id
   */
  productId?: number
  /**
   * 商品名称
   */
  productName: string
  /**
   * 购买数量
   */
  purchaseCount: number
  /**
   * 总计
   */
  totalPrice: number
  /**
   * 单位
   */
  unit: string
  spec: string
}

interface EtProductInfoProps {
  /**
   * 值
   */
  value: EtProductInfoType
  /**
   * 订单类型
   */
  orderType: number
}

const EtProductInfo = (props: EtProductInfoProps) => {
  const { value, orderType } = props

  return (
    <div className={styles['et-product']}>
      <div className={styles['et-product-left']}>
        <img src={value.pic || ''} />
      </div>
      <div className={styles['et-product-right']}>
        <div className={styles['et-product-title']}>
          {value.productName}
          {value.spec ? `/${value.spec}` : ''}
        </div>
        <div className={styles['et-product-price']}>
          <span className={styles['et-product-money']}>
            {`${!checkIsPointsOrder(orderType) ? intl.formatMessage({ id: 'common.money' }) : ''} ${value.totalPrice} ${
              checkIsPointsOrder(orderType) ? intl.formatMessage({ id: 'common.currency.points' }) : ''
            }`}
          </span>
          <span className={styles['et-product-desc']}>
            {`${!checkIsPointsOrder(orderType) ? intl.formatMessage({ id: 'common.money' }) : ''} ${value.price}${
              checkIsPointsOrder(orderType) ? intl.formatMessage({ id: 'common.currency.points' }) : ''
            }/${value.unit || ''}，`}
            {intl.formatMessage({ id: 'common.text.common' })} {value.purchaseCount || ''}
            {value.unit || ''}
          </span>
        </div>
      </div>
    </div>
  )
}

EtProductInfo.isFieldComponent = true

export default EtProductInfo
