import { getWebIntl } from '@/utils/locales'
import React, { useMemo } from 'react'
import { accMul, priceFormat } from '@apps/utils'
import { OrderInfoType } from '../types'
import styles from './index.module.less'

interface IProps {
  visible: boolean
  allMoney: string
  logisticsFee: string
  promotion: string | number
  couponMoney: string
  orderInfo: OrderInfoType
  allHandMoney: string | number
  integralMoney: string
  meberAllDisCountAmount: number
  taxFee: {
    show: boolean
    fee: number
  }
}

const OrderMessage: React.FC<IProps> = (props) => {
  const {
    visible,
    allMoney,
    logisticsFee,
    promotion,
    couponMoney,
    integralMoney,
    orderInfo,
    allHandMoney,
    taxFee,
    meberAllDisCountAmount,
  } = props
  const translate = getWebIntl()

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

  return visible ? (
    <ul className={styles.order_detail_warp}>
      <li className={styles.order_detail_item}>
        <div>
          {translate('web.resource.mall.shangpinzonglei')}: {commodityTypeCount.coutType}
          {translate('web.common.zhong')}
        </div>
        <div>
          <span className={styles['shallow-tips']}>{translate('web.resource.mall.shangpinjinezongji')}:</span>
          {allMoney}
        </div>
      </li>
      <li className={styles.order_detail_item}>
        <div>
          {translate('web.resource.mall.shuliangzongji')}: {commodityTypeCount.coutNumber}
          {translate('web.common.jian')}
        </div>
        <div>
          <span className={styles['shallow-tips']}>{translate('web.resource.order.yunfei')}: </span>
          {logisticsFee}
        </div>
      </li>
      {taxFee.show && (
        <li className={styles.order_detail_item}>
          <div />
          <div>
            <span className={styles['shallow-tips']}>{translate('web.resource.mall.shuifei')}: </span>
            {priceFormat(taxFee.fee)}
          </div>
        </li>
      )}
      <li className={styles.order_detail_item}>
        <div />
        <div>
          <span className={styles['shallow-tips']}>-{translate('web.resource.mall.cuxiao')}: </span>
          {promotion}
        </div>
      </li>
      <li className={styles.order_detail_item}>
        <div />
        <div>
          <span className={styles['shallow-tips']}>-{translate('web.resource.mall.coupon')}:</span>
          {couponMoney}
        </div>
      </li>
      <li className={styles.order_detail_item}>
        <div />
        <div>
          <span className={styles['shallow-tips']}>-{translate('web.resource.mall.jifendikou')}:</span>
          {integralMoney}
        </div>
      </li>
      <li className={styles.order_detail_item}>
        <div />
        <div>
          <span className={styles['shallow-tips']}>-{translate('web.resource.mall.huiyuanzhekou')}:</span>
          {meberAllDisCountAmount}
        </div>
      </li>
      <li className={styles.order_detail_item}>
        <div />
        <div>
          <span>{translate('web.resource.mall.gongxuzhifu')}:</span>
          <b className={styles.settlement_box_item_price_total}>{allHandMoney}</b>
        </div>
      </li>
    </ul>
  ) : null
}

export default OrderMessage
