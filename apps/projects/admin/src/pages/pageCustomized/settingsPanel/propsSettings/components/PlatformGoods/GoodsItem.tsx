import React from 'react'
import styles from './index.less'

interface GoodsItemPropsType {
  dataInfo: any
}

const GoodsItem: React.FC<GoodsItemPropsType> = (props) => {
  const { dataInfo = {} } = props

  const getMinPriceByRange = (range: string) => {
    if (range) {
      const minPrice = range.split('~')[0]
      return minPrice ? minPrice : 0
    }
    return 0
  }

  return (
    <div className={styles.goods_item}>
      <div className={styles.goods_item_imgbox}>
        <img src={dataInfo.commodityPicUrl} />
      </div>
      <div className={styles.goods_item_info}>
        <div className={styles.goods_item_info_name}>{dataInfo.commodityName}</div>
        <div className={styles.goods_item_info_price}>
          <i>￥</i>
          <span>{getMinPriceByRange(dataInfo.priceRange)}</span>
        </div>
        <div className={styles.goods_item_info_brief}>
          <span>品类：</span>
          <span>{dataInfo.categoryName}</span>
        </div>
        <div className={styles.goods_item_info_brief}>
          <span>品牌：</span>
          <span>{dataInfo.brandName}</span>
        </div>
      </div>
    </div>
  )
}

export default GoodsItem
