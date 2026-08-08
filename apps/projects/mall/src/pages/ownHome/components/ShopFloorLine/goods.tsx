import React from 'react'
import classNames from 'classnames'
import { getWebIntl } from '@/utils/locales'
import { priceFormat } from '@apps/utils/src/format'
import styles from './index.module.less'

interface GoodsItemType {
  /**
   * 商品ID
   */
  goodsId: number
  /**
   * 商品名称
   */
  goodsName: string
  /**
   * 商品图片
   */
  goodsPicUrl: string
  /**
   * 商品价格
   */
  goodsPrice: string
}

interface GoodsProps {
  className?: string
  prefixCls?: string
  linkUrl?: string
  linkdisable?: boolean
  goodsList: GoodsItemType[]
  showSold?: boolean
}

const Goods: React.FC<React.PropsWithChildren<GoodsProps>> = (props) => {
  const { children, className, linkUrl, showSold = true, linkdisable, goodsList = [], ...others } = props
  const translate = getWebIntl()

  const classString = classNames(styles['lingxi-shop-floor-line-goods'], className)

  const renderPriceByType = (info: any) => {
    switch (info.priceType) {
      case 1:
        return (
          <div className={styles.goods_price}>
            <span>￥</span>
            <label>{priceFormat(info.goodsPrice)}</label>
            {showSold && (
              <div className={styles.count}>
                {translate('web.resource.mall.sold')} {info.sold || info.channelSold || 0}
              </div>
            )}
          </div>
        )
      case 2:
        return (
          <div className={styles.inquiry_price}>
            <label>{translate('web.resource.mall.zaixianxunjia')}</label>
          </div>
        )
      default:
        break
    }
  }

  return (
    <section className={classString} {...others}>
      <div className={styles.goods_list}>
        <div className={classNames(styles.goods_list_item, styles.empty)}></div>
        {goodsList &&
          goodsList.map((item, index) => (
            <a
              key={`${item.goodsId}${index}`}
              href={`${linkUrl}/${item.goodsId}`}
              target="_blank"
              className={classNames(styles.goods_list_item, !linkdisable ? styles.link : '')}
            >
              <div className={styles.goods_img}>
                <img src={item.goodsPicUrl} />
              </div>
              <div className={styles.goods_name}>{item.goodsName}</div>
              {renderPriceByType(item)}
            </a>
          ))}
      </div>
    </section>
  )
}

export default Goods
