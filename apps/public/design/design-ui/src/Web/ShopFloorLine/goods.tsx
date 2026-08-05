import React from 'react'
import classNames from 'classnames'
import styles from './index.less'
import LocaleReceiver from '../../components/LocaleProvider/LocaleReceiver'
import { openLink } from '../../utils'
import { priceFormat } from '../../utils/numberFomat'
import { FloorLineLocale } from '../../locale/types/floorline'

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
}

interface GoodsProps {
  className?: string
  prefixCls?: string
  linkUrl?: string
  linkdisable?: boolean
  goodsList: GoodsItemType[]
  showSold?: boolean
  moneyText?: string
}

const Goods: React.FC<React.PropsWithChildren<GoodsProps>> = (props) => {
  const {
    children,
    className,
    linkUrl,
    showSold = true,
    linkdisable = true,
    moneyText,
    goodsList = [],
    ...others
  } = props

  const renderShowCase = (locale: FloorLineLocale) => {
    const classString = classNames(
      styles['lingxi-shop-floor-line-goods'],
      className,
    )

    const renderPriceByType = (info: any) => {
      switch (info.priceType) {
        case 1:
          return (
            <div className={styles.goods_price}>
              <span>{moneyText || locale['symbol.money']}</span>
              <label>{priceFormat(info.commodityPrice)}</label>
              {showSold && (
                <div className={styles.count}>
                  {locale['shop.floorline.sold']}
                  {info.sold || info.channelSold || 0}
                </div>
              )}
            </div>
          )
        case 2:
          return (
            <div className={styles.inquiry_price}>
              <label>{locale['shop.inquiry.online']}</label>
            </div>
          )
        default:
          break
      }
    }

    return (
      <section className={classString} {...others}>
        <div className={styles.goods_list}>
          <div
            className={classNames(styles.goods_list_item, styles.empty)}
          ></div>
          {goodsList?.length > 0
            ? goodsList.map((item, index) => (
                <div
                  key={`${item.commodityId}${index}`}
                  className={classNames(
                    styles.goods_list_item,
                    !linkdisable ? styles.link : '',
                  )}
                  onClick={() =>
                    openLink(
                      `${linkUrl}/${item.commodityId}`,
                      linkdisable,
                      '_blank',
                    )
                  }
                >
                  <div className={styles.goods_img}>
                    <img src={item.commodityPicUrl} />
                  </div>
                  <div className={styles.goods_name}>{item.commodityName}</div>
                  {renderPriceByType(item)}
                </div>
              ))
            : [1, 2, 3, 4].map((item) => (
                <div className={styles.goods_list_null}>
                  <div className={styles.goods_list_null_top}>
                    {locale['commodity']}
                  </div>
                  <div className={styles.goods_list_null_bar} />
                  <div className={styles.goods_list_null_bottom}>
                    <div
                      className={styles.goods_list_null_bottom_item}
                      style={{ background: '#FFF4F4' }}
                    />
                    <div className={styles.goods_list_null_bottom_item} />
                  </div>
                </div>
              ))}
        </div>
      </section>
    )
  }

  return (
    <LocaleReceiver componentName="FloorLine">{renderShowCase}</LocaleReceiver>
  )
}

export default Goods
