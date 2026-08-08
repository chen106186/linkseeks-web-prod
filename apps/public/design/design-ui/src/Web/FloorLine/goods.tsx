import React from 'react'
import classNames from 'classnames'
import styles from './index.less'
import emptyImg from './images/floor_goods.svg'
import { priceFormat } from '../../utils/numberFomat'
import { openLink } from '../../utils'

interface GoodsItemType {
  /**
   * 商品ID
   */
  commodityId: number
  /**
   * 商品名称
   */
  commodityName: string
  /**
   * 商品图片
   */
  commodityPicUrl: string
  /**
   * 商品价格
   */
  commodityPrice: string
  shopId: number
  memberId: number
  memberRoleId: number
  /**
   * 价格类型
   */
  priceType: number
  /**
   * 现金价格类型 1：现金；2：积分；3：现金+积分
   */
  cashPriceType: number
  /**
   * 最小副价格
   */
  minSidePrice: number
}

interface GoodsProps {
  className?: string
  prefixCls?: string
  linkdisable?: boolean
  goodsList: GoodsItemType[]
  linkUrl?: string
  inquiryText?: string
  moneyText?: string
}

const Goods: React.FC<GoodsProps> = (props) => {
  const {
    className,
    linkdisable = true,
    goodsList,
    linkUrl,
    inquiryText = '',
    moneyText = '￥',
    ...others
  } = props
  const classString = classNames(styles['lingxi-floor-line-goods'], className)

  const renderPriceByType = (info: GoodsItemType) => {
    switch (info.priceType) {
      case 1:
        switch (info?.cashPriceType) {
          case 1:
            return (
              <div className={styles.goods_price}>
                <span>{moneyText}</span>
                {priceFormat(info.commodityPrice)}
              </div>
            )
          case 2:
            return (
              <div className={classNames(styles.goods_price, styles.integral)}>
                {info.minSidePrice}积分
              </div>
            )
          case 3:
            return (
              <div className={classNames(styles.goods_price, styles.integral)}>
                <label>{info.minSidePrice}积分+</label>
                <span>{moneyText}</span>
                {priceFormat(info.commodityPrice)}
              </div>
            )
          default:
            return (
              <div className={styles.goods_price}>
                <span>{moneyText}</span>
                {priceFormat(info.commodityPrice)}
              </div>
            )
        }
      case 2:
        return (
          <div className={styles.inquiry_price}>
            <label>{inquiryText}</label>
          </div>
        )
      default:
        break
    }
  }

  return (
    <section className={classString} {...others}>
      <div className={styles.goods_list}>
        {goodsList && goodsList.length > 0 ? (
          goodsList.map((item) => (
            <div key={item.commodityId} className={styles.goods_list_item}>
              <span
                onClick={() =>
                  openLink(
                    `${linkUrl}/${item.memberId}_${item.memberRoleId}/commodity/detail/${item.commodityId}`,
                    linkdisable,
                  )
                }
                className={!linkdisable ? styles.link : ''}
              >
                <div className={styles.goods_img}>
                  <img src={item.commodityPicUrl} alt={item.commodityName} />
                </div>
                <div className={styles.goods_name} title={item.commodityName}>
                  {item.commodityName}
                </div>
                {renderPriceByType(item)}
              </span>
            </div>
          ))
        ) : (
          <img src={emptyImg} />
        )}
      </div>
    </section>
  )
}

export default Goods
