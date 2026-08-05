/**
 * 商品推荐
 */
import React from 'react'
import { LinkTo } from '@/utils'
import { getWebIntl } from '@/utils/locales'
import { SelectAreaItemType } from '@/types/global'
import { useGlobalConext } from '@/context/globalProvider'
import ImageBox from '@apps/components/src/web/ImageBox'
import styles from './index.module.less'

interface GoodsItemType {
  commodityId: number
  commodityName: string
  categoryName: string
  brandName: string
  commodityPicUrl: string
  priceRange: string
  supplier: string
  memberId: number
  memberRoleId: number
  priceType: number
  shopId: number
}

interface ContentItemType {
  advertImg: string
  describe: string
  firstId: string | undefined
  goodsIdList: number[]
  goodsList?: GoodsItemType[]
  name: string
  secondId: string | undefined
  shopId: number | undefined
  thirdId: string | undefined
  visible: boolean
  fontColor: string
}

interface CommodityListProps {
  content: ContentItemType[]
  templateId: number | undefined
  anchor: string
  currentCity: SelectAreaItemType | undefined
}

const CommodityList: React.FC<CommodityListProps> = (props) => {
  const { content, anchor } = props
  const { mallUrl } = useGlobalConext()
  const translate = getWebIntl()

  const getMinPriceByRange = (range: string) => {
    if (range) {
      const minPrice = range.split('~')[0]
      return minPrice ? minPrice : 0
    }
    return 0
  }

  const handleLinkCommodityList = (info: ContentItemType) => {
    let categoryId = ''
    if (info.firstId) {
      categoryId = `c${info.firstId}`
      if (info.secondId) {
        categoryId = `${categoryId}_c${info.secondId}`
        if (info.thirdId) {
          categoryId = `${categoryId}_c${info.thirdId}`
        }
      }
    }
    LinkTo(`${mallUrl?.defaultEnterpriseUrl}/commodity/${categoryId}`)
  }

  const showPriceByType = (GoodsInfo: GoodsItemType) => {
    switch (GoodsInfo.priceType) {
      case 1:
        return `￥${getMinPriceByRange(GoodsInfo.priceRange)}`
      case 2:
        return (
          <div className={styles.inquiry_price}>
            <label>{translate('web.resource.mall.zaixianxunjia')}</label>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className={styles.commodity_category_list} id={anchor}>
      {content &&
        content.map((item, index) =>
          item.visible ? (
            <div
              className={styles.commodity_category_list_item}
              key={`commodity_category_list_item_${item.name}_${index}`}
            >
              <div className={styles.category_advert}>
                <img className={styles.category_advert_img} src={item.advertImg} alt={item.name} />
                <div className={styles.category_wrap} style={item.fontColor ? { color: item.fontColor } : {}}>
                  <div className={styles.category_name}>{item.name}</div>
                  <div className={styles.category_describe}>{item.describe}</div>
                  <div className={styles.more_btn} onClick={() => handleLinkCommodityList(item)}>
                    {translate('web.common.more')}
                  </div>
                </div>
              </div>
              <div className={styles.commodity_list}>
                {item.goodsList &&
                  item.goodsList.map((goodsItem, goodsIndex: number) => (
                    <a
                      href={`${mallUrl?.defaultEnterpriseUrl}/shop/${goodsItem.shopId}/commodity/detail/${goodsItem.commodityId}`}
                      target="_blank"
                      className={styles.commodity_list_item}
                      key={`item.commodityId_${goodsItem.commodityId}_${goodsIndex}`}
                    >
                      <div className={styles.commodity_main_pic}>
                        <ImageBox width={96} height={96} src={goodsItem.commodityPicUrl} />
                      </div>
                      <div className={styles.commodity_info}>
                        <div className={styles.commodity_name}>{goodsItem.commodityName}</div>
                        <div className={styles.commodity_price}>{showPriceByType(goodsItem)}</div>
                        <div className={styles.commodity_store}>{goodsItem.supplier}</div>
                      </div>
                    </a>
                  ))}
              </div>
            </div>
          ) : null,
        )}
    </div>
  )
}

export default CommodityList
