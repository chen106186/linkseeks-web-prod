import React, { useMemo } from 'react'
import classNames from 'classnames'
import LocaleReceiver from '../../components/LocaleProvider/LocaleReceiver'
import { getPrefixUrl, openLink } from '../../utils'
import { priceFormat } from '../../utils/numberFomat'
import { FloorLineLocale } from '../../locale/types/floorline'
import styles from './index.less'

export interface CommodityItemType {
  sort: number
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
  /**
   * 商品品类
   */
  commodityCategory?: string
  /** 价格类型 */
  priceType: number
  storeId: number
  memberId: number
  /**
   * 是否团购
   */
  groupPurchase?: boolean
}

interface GoodsProps {
  className?: string
  prefixCls?: string
  linkdisable?: boolean
  goodsList: CommodityItemType[]
  showSold?: boolean
  moneyText?: string
  isStore?: boolean
  /**
   * 显示的商品数量
   */
  showCount?: number
}

const Goods: React.FC<React.PropsWithChildren<GoodsProps>> = (props) => {
  const {
    children,
    className,
    showSold = true,
    linkdisable = true,
    moneyText,
    goodsList = [],
    isStore,
    showCount = 8,
    ...others
  } = props

  const emptyList = useMemo(() => {
    const list = []
    for (let i = 1; i <= showCount; i += 1) {
      list.push(i)
    }
    return list
  }, [showCount])

  const classString = classNames(
    styles['commodity-floor-line-goods'],
    className,
  )

  const renderPriceByType = (info: any, locale: FloorLineLocale) => {
    switch (info.priceType) {
      case 1:
        return (
          <div className={styles.goods_price}>
            <span>{moneyText || locale['symbol.money']}</span>
            <label>{priceFormat(info.commodityPrice)}</label>
            {showSold && (
              <div className={styles.count}>
                {locale['shop.floorline.sold']}
                {info.sold || 0}
              </div>
            )}
          </div>
        )
      case 2:
        return (
          <div className={classNames(styles.goods_price, styles.inquiry_price)}>
            <label>{locale['shop.inquiry.online']}</label>
          </div>
        )
      default:
        break
    }
  }

  const getCommodityDetailLink = (commodityInfo: CommodityItemType) => {
    if (isStore) {
      return commodityInfo.storeId
        ? `/shop/${commodityInfo.storeId}/${
            commodityInfo.groupPurchase ? 'group' : 'commodity'
          }/detail/${commodityInfo.commodityId}`
        : `/${commodityInfo.groupPurchase ? 'group' : 'commodity'}/detail/${
            commodityInfo.commodityId
          }`
    } else {
      return `${getPrefixUrl()}/${
        commodityInfo.groupPurchase ? 'group' : 'commodity'
      }/detail/${commodityInfo.commodityId}`
    }
  }

  return (
    <LocaleReceiver componentName="FloorLine">
      {(locale: FloorLineLocale) => (
        <section className={classString} {...others}>
          <div className={styles.goods_list}>
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
                        getCommodityDetailLink(item),
                        linkdisable,
                        '_blank',
                      )
                    }
                  >
                    <div className={styles.goods_img}>
                      <img src={item.commodityPicUrl} />
                    </div>
                    <div className={styles.goods_name}>
                      {item.commodityName}
                    </div>
                    {renderPriceByType(item, locale)}
                  </div>
                ))
              : linkdisable
              ? emptyList.map((item) => (
                  <div
                    className={styles.goods_list_null}
                    key={`goods_list_null_${item}`}
                  >
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
                ))
              : null}
          </div>
        </section>
      )}
    </LocaleReceiver>
  )
}

export default Goods
