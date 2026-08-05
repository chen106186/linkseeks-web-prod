import React from 'react'
import { View, Text, Image } from '@apps/mobile-ui'
import Tags from './components/Tags'
import Label, { Iprops as LabelProps } from '@/components/Label'
import { PRICE_TYPE_ENUM } from '@/constants/const/product'
import useProductDetailJump from '@/hooks/useProductDetailJump'
import { useIntl } from '@linkseeks/i18n'
import Router from '@/utils/router'
import './columnCommodity.scss'
import Price from './price'

/**
 * 竖放时的商品样式， 参考满量/满额促销
 * https://codesign.qq.com/workspace/prototype/XJMwy0b2Vy0O6LB/VbAE95Wd7WZPlze/inspect
 */

// type LabelProps = React.ComponentProps<typeof Label>
interface Iprops {
  /** 商品名 */
  productName: string
  /** 商品图片 */
  productImg: string
  /** 原价 */
  originalPrice?: number
  /** 折扣价 */
  discount: number
  /** 商品id */
  productId: number
  tags?: LabelProps[] | string[]
  tagList?: string[]
  activityTypeList?: number[]
  customItemClassName?: string
  /** 自定义 */
  renderFooter?: React.ReactNode
  /** 售出数 */
  sale?: number | string
  /** 价格类型 */
  priceType?: number
  stockCount: number
  minOrder: number
  sellingPoint?: any
  min?: number
  max?: number
  /** 是否团购 */
  groupPurchase?: boolean
}

interface IlistProps {
  dataSource: Iprops[]
  /**
   * 点击商品列表
   */
  onClickItem?: (item: Iprops) => void
}

const ColumnCommodity: React.FC<IlistProps> & { Item: typeof CommodityItem } = (props: IlistProps) => {
  const { dataSource, onClickItem } = props
  const { jmpProductDetail, jmpProductDetailGroup } = useProductDetailJump()

  const handleClickItem = (item: Iprops) => {
    if (onClickItem) {
      onClickItem(item)
    } else {
      if (item.groupPurchase) {
        jmpProductDetailGroup({ commodityId: item.productId })
      } else if (item.activityTypeList?.includes(17)) {
        Router.navigateTo('communityGroupBuy/list', { goodsId: item.productId })
      } else {
        jmpProductDetail(item.priceType || PRICE_TYPE_ENUM.SPOT, { commodityId: item.productId })
      }
    }
  }

  return (
    <View className="columnList">
      {dataSource.map((_item) => {
        return (
          <View className="commodityItem" key={_item.productId} onClick={() => handleClickItem(_item)}>
            <CommodityItem {..._item} />
          </View>
        )
      })}
    </View>
  )
}

const CommodityItem: React.FC<Iprops> = (props: Iprops) => {
  const {
    productImg,
    productId,
    productName,
    tags = [],
    tagList,
    discount,
    originalPrice,
    priceType,
    customItemClassName,
    sale,
    renderFooter,
    minOrder,
    stockCount,
    sellingPoint = [],
    min,
    max,
  } = props
  const intl = useIntl()

  return (
    <View className={`commodity ${customItemClassName}`} id={`commodityItem${productId}`}>
      <View className="commodityImage">
        <Image src={productImg} />
      </View>

      {minOrder === 0 || stockCount === 0 ? <View className="mask-box">补货中</View> : <></>}
      <View className="commodityInfo">
        <View className="commodityName">{productName}</View>
        <View className="commodityTags">
          {tags.map((_item, _index) => {
            const _props = typeof _item === 'string' ? { name: _item } : _item
            return (
              <View className="tagItem" key={_index}>
                <Label {..._props} />
              </View>
            )
          })}
        </View>
        {tagList && <Tags dataSource={tagList} customClassName="productList-item-tabs" returnNum={3} />}
      </View>
      <View className="commodityFooter">
        {(typeof originalPrice !== 'undefined' || typeof discount !== 'undefined') && (
          // <Price originalPrice={originalPrice} discount={discount} priceType={priceType} saleTags={sellingPoint}  />
          <Price
            originalPrice={originalPrice}
            discount={discount}
            priceType={priceType}
            saleTags={sellingPoint}
            max={max}
            min={min}
          />
        )}
        {sale !== undefined ? (
          <Text className="sale">
            {intl.formatMessage({ id: 'columnCommodity_item_sale' })}
            <Text className="saleNumber">{sale}</Text>
            {intl.formatMessage({ id: 'columnCommodity_item_sale_unit' })}
          </Text>
        ) : null}
        {renderFooter}
      </View>
    </View>
  )
}

ColumnCommodity.Item = CommodityItem

export default ColumnCommodity
