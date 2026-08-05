import React, { useMemo } from 'react'
import { accMul } from '../../utils'
import { useIntl } from '@linkseeks/i18n'
import { useWebIntl } from '@apps/locales'
import { priceFormat } from '../../utils/numFormat'
import { OrderInfoType } from '../types'
import styles from './index.less'

interface IProps {
  visible: boolean
  allMoney: string
  logisticsFee: string
  promotion: string | number
  couponMoney: string
  orderInfo: OrderInfoType
  allHandMoney: string | number
  integralMoney: string
  taxFee: {
    show: boolean
    fee: number
  }
}

const OrderMessage: React.FC<IProps> = (props) => {
  const { visible, allMoney, logisticsFee, promotion, couponMoney, integralMoney, orderInfo, allHandMoney, taxFee } =
    props
  const intl = useIntl()
  const translate = useWebIntl()

  /**
   * 获取商品种类数量
   */
  const commodityTypeCount = useMemo(() => {
    let coutType = 0
    let coutNumber = 0
    if (orderInfo) {
      orderInfo.orderList.forEach((item: any) => {
        coutType += item.orderList.length
        item.orderList.forEach((second: any) => {
          coutNumber += Number(second.count)
        })
      })
    }
    return {
      coutType,
      coutNumber,
    }
  }, [orderInfo])

  const _showPayNode = useMemo(() => {
    if (orderInfo && orderInfo.requiredPay && orderInfo.payNodes && orderInfo.payNodes.length > 0) {
      const payCount = orderInfo.payNodes.length
      const payTip = orderInfo.payNodes
        .map((nodeItem) => {
          return `${nodeItem.payNode}${accMul(nodeItem.payRate, 100)}%`
        })
        .join('、')

      const result = intl.formatMessage({
        id: 'order.payNodeTip.text',
        defaultMessage: '订单金额分{{count}}次支付',
        count: payCount,
      })
      return `${result}，${payTip}`
    }
    return null
  }, [orderInfo])

  return visible ? (
    <ul className={styles.order_detail_warp}>
      <li className={styles.order_detail_item}>
        <div>
          {intl.formatMessage({ id: 'order.orderMessage.commodityType', defaultMessage: '商品种类' })}:{' '}
          {commodityTypeCount.coutType}
          {intl.formatMessage({ id: 'order.orderMessage.kind', defaultMessage: '种' })}
        </div>
        <div>
          <span className={styles['shallow-tips']}>
            {intl.formatMessage({ id: 'order.orderMessage.allMoney', defaultMessage: '商品金额总计' })}:
          </span>
          {allMoney}
        </div>
      </li>
      <li className={styles.order_detail_item}>
        <div>
          {intl.formatMessage({ id: 'order.orderMessage.count', defaultMessage: '数量总计' })}:{' '}
          {commodityTypeCount.coutNumber}
          {translate('web.common.jian')}
        </div>
        <div>
          <span className={styles['shallow-tips']}>{intl.formatMessage({ id: 'order.index.freight' })}: </span>
          {logisticsFee}
        </div>
      </li>
      {taxFee.show && (
        <li className={styles.order_detail_item}>
          <div></div>
          <div>
            <span className={styles['shallow-tips']}>
              {intl.formatMessage({ id: 'commodityDetail.taxfee', defaultMessage: '税费' })}:{' '}
            </span>
            {priceFormat(taxFee.fee)}
          </div>
        </li>
      )}
      <li className={styles.order_detail_item}>
        <div></div>
        <div>
          <span className={styles['shallow-tips']}>{intl.formatMessage({ id: 'commodityDetail.promotion' })}: </span>
          {promotion}
        </div>
      </li>
      <li className={styles.order_detail_item}>
        <div></div>
        <div>
          <span className={styles['shallow-tips']}>{intl.formatMessage({ id: 'mall.text.coupon' })}:</span>
          {couponMoney}
        </div>
      </li>
      <li className={styles.order_detail_item}>
        <div></div>
        <div>
          <span className={styles['shallow-tips']}>
            {intl.formatMessage({ id: 'mall.text.jifendikou', defaultMessage: '积分抵扣:' })}
          </span>
          {integralMoney}
        </div>
      </li>
      <li className={styles.order_detail_item}>
        <div className={styles['shallow-tips']}>{_showPayNode}</div>
        <div>
          <span>{intl.formatMessage({ id: 'order.index.TotalPayment' })}:</span>
          <b className={styles.settlement_box_item_price_total}>{allHandMoney}</b>
        </div>
      </li>
    </ul>
  ) : null
}

export default OrderMessage
