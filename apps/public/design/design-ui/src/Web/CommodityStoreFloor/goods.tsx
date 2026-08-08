import React, { useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'
import LocaleReceiver from '../../components/LocaleProvider/LocaleReceiver'
import { openLink } from '../../utils'
import { priceFormat } from '../../utils/numberFomat'
import { reloadDataSourceFn } from '../../utils/dataSource'
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
  /** 重新请求数据源 */
  reloadDataSource?: boolean
  reloadParam?: any
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
    showCount = 10,
    reloadDataSource = false,
    reloadParam,
    ...others
  } = props
  const [dataSource, setDataSource] = useState<CommodityItemType[]>([])

  useEffect(() => {
    if (!reloadDataSource) {
      setDataSource(goodsList || [])
    }
  }, [goodsList])

  useEffect(() => {
    const reload = () => {
      reloadDataSourceFn(reloadParam, dataSource).then((result) => {
        setDataSource(result)
      })
    }
    if (reloadDataSource) {
      reload()
    }
  }, [])

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

  return (
    <LocaleReceiver componentName="FloorLine">
      {(locale: FloorLineLocale) => (
        <section className={classString} {...others}>
          <div className={styles.goods_list}>
            {dataSource?.length > 0
              ? dataSource.map((item, index) => (
                  <div
                    key={`${item.commodityId}${index}`}
                    className={classNames(
                      styles.goods_list_item,
                      !linkdisable ? styles.link : '',
                    )}
                    onClick={() =>
                      openLink(
                        isStore
                          ? item.storeId
                            ? `/shop/${item.storeId}/${
                                item.groupPurchase ? 'group' : 'commodity'
                              }/detail/${item.commodityId}`
                            : `/${
                                item.groupPurchase ? 'group' : 'commodity'
                              }/detail/${item.commodityId}`
                          : `/${
                              item.groupPurchase ? 'group' : 'commodity'
                            }/detail/${item.commodityId}`,
                        linkdisable,
                        '_blank',
                      )
                    }
                  >
                    <div className={styles.goods_img}>
                      <img src={item.commodityPicUrl} />
                    </div>
                    <div className={styles.goods_name}>
                      <span className={styles.goods_name_text}>
                        {item.commodityName}
                      </span>
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
