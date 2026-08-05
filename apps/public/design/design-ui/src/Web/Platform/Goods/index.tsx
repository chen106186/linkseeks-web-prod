/**
 * 商品推荐
 */
import React from 'react'
import cx from 'classnames'
import ImageBox from '@apps/components/src/web/ImageBox'
import styles from './index.less'
import LocaleReceiver from '../../../components/LocaleProvider/LocaleReceiver'
import { PlatformLocale } from '../../../locale/types/platform'

export interface GoodsItem {
  commodityName: string
  priceRange: string
  commodityPicUrl: string
  supplier: string
  shopId: number
  memberId: number
  memberRoleId: number
  goodsId: number
}

export interface GoodsConfigType {
  advertImg: string
  shopId: number | undefined
  firstId: number | undefined
  secondId: number | undefined
  thirdlyId: number | undefined
  name: string
  describe: string
  goodsIdList: number[]
  goodsList: GoodsItem[]
  visible: boolean
  fontColor: string
}

interface GoodsProps {
  className?: string
  dataInfo: GoodsConfigType
}

const Goods: React.FC<GoodsProps> = (props) => {
  const { className, dataInfo, ...others } = props

  const classNameString = cx(styles.commodity_category_list, className)

  const getMinPriceByRange = (range: string) => {
    if (range) {
      const minPrice = range.split('~')[0]
      return minPrice ? minPrice : 0
    }
    return 0
  }

  const renderComponent = (locale: PlatformLocale) => (
    <div className={classNameString} {...others}>
      <div className={styles.commodity_category_list_item}>
        <div className={styles.category_advert}>
          {dataInfo.advertImg && (
            <img
              className={styles.category_advert_img}
              src={dataInfo.advertImg}
            />
          )}
          <div
            className={styles.category_wrap}
            style={dataInfo.fontColor ? { color: dataInfo.fontColor } : {}}
          >
            <div className={styles.category_name}>{dataInfo.name}</div>
            <div className={styles.category_describe}>{dataInfo.describe}</div>
            <div className={styles.more_btn}>{locale['platform.more.btn']}</div>
          </div>
        </div>
        <div className={styles.commodity_list}>
          {dataInfo.goodsList &&
            dataInfo.goodsList.map((goodsItem) => (
              <div
                key={`commodity_list_item_${goodsItem.goodsId}`}
                className={styles.commodity_list_item}
              >
                <div
                  className={styles.commodity_main_pic}
                  title={`${dataInfo.name}_${dataInfo.describe}`}
                >
                  <ImageBox
                    width={96}
                    height={96}
                    src={goodsItem.commodityPicUrl}
                  />
                </div>
                <div className={styles.commodity_info}>
                  <div className={styles.commodity_name}>
                    {goodsItem.commodityName}
                  </div>
                  <div className={styles.commodity_price}>
                    ￥{getMinPriceByRange(goodsItem.priceRange)}
                  </div>
                  <div className={styles.commodity_store}>
                    {goodsItem.supplier}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )

  return (
    <LocaleReceiver componentName="Platform">{renderComponent}</LocaleReceiver>
  )
}

export default Goods
