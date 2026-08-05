/*
 * @Author: XieZhiXiong
 * @Date: 2021-10-11 17:42:39
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-30 18:13:16
 * @Description: 商品列表项
 */
import React from 'react'
import { BaseEventOrig } from '@tarojs/components'
import { View, Text } from '@apps/mobile-ui'
import classNames from 'classnames'
import { useIntl } from '@linkseeks/i18n'
import { priceFormat, priceFormat1, numFormat } from '../../utils/numberFormat'
import HighLightText from '../HighLightText'
import ImageBox from '../ImageBox'
import Tags from './components/Tags'
import './index.scss'

export interface SupplierInfo {
  /**
   * 采购商id
   */
  id: number
  /**
   * 采购商角色id
   */
  roleId: number
  /**
   * 采购商名称
   */
  name: string
}

export interface ProductItem {
  /**
   * 商品id
   */
  id: number
  /**
   * 商品名称
   */
  name: string
  /**
   * 商品描述
   */
  describe: string
  /**
   * 商品图片
   */
  picture: string
  /**
   * 价格
   */
  price: number
  /**
   * 商品优惠价格
   */
  preferentialPrice?: number
  /**
   * 价格类型
   */
  priceType: number
  /**
   * 单位
   */
  unit?: string
  /**
   * 销量
   */
  salesVolume: number
  /**
   * 供应商信息
   */
  supplierInfo?: SupplierInfo
  /**
   * 店铺id
   */
  storeId: number
  /**
   * 活动标签
   */
  saleTags?: string[]
  /**
   * 活动类型列表
   */
  activityTypeList?: number[]

  stockCount: number
  minOrder: number
  max?: number
  min?: number
  /**
   * 是否团购
   */
  groupPurchase?: boolean
}

export interface ProductListItemProps {
  /**
   * 数据源
   */
  data: ProductItem
  /**
   * 点击商品列表
   */
  onClickItem?: (item: ProductItem) => void
  /**
   * 点击采购商触发
   */
  onClickSupplier?: (item: ProductItem) => void
  /**
   * 类型，可选 default | larger
   */
  type: 'default' | 'larger'
  /**
   * 自定义外部样式
   */
  customStyle?: string | React.CSSProperties
  /**
   * 自定义容器样式
   */
  customContainerStyle?: string | React.CSSProperties
  /**
   * 是否显示供应商信息，默认 false
   */
  showSupplierInfo?: boolean
}

const ProductListItem: React.FC<ProductListItemProps> = (props: ProductListItemProps) => {
  const { data, onClickItem, onClickSupplier, type, customStyle, customContainerStyle, showSupplierInfo } = props
  const isLarger = type === 'larger'
  const intl = useIntl()
  console.log(data, 'data')
  const handleClickItem = (item: ProductItem) => {
    if (onClickItem) {
      onClickItem(item)
    }
  }
  const handleClickSupplier = (item: ProductItem, e: BaseEventOrig<any>) => {
    e.stopPropagation()
    if (onClickSupplier) {
      onClickSupplier(item)
    }
  }

  const renderPriceByType = (item: ProductItem) => {
    console.log(item, 'item')
    const isFullMoneyReduce =
      Array.isArray(item.saleTags) && item.saleTags.some((tag) => typeof tag === 'string' && tag.includes('满额减'))

    switch (item.priceType || 1) {
      case 1:
        let minPrice = item.min

        // 满额减：列表页不直接展示减后的活动价，保持和详情页一致用原价区间

        if (!isFullMoneyReduce && item.price && item.price < item.max) {
          minPrice = item.price
        }

        if (item.activityTypeList && Array.isArray(item.activityTypeList) && item.activityTypeList.includes(7)) {
          minPrice = item.min
        }

        console.log(minPrice, 'minPrice')

        const minPriceFormatted = priceFormat1(minPrice)

        const [minInteger, minDecimal] = minPriceFormatted.split('.')

        console.log(minPriceFormatted, 'minPriceFormatted')
        console.log(minPriceFormatted, 'minDecimal')

        const maxPriceFormatted = priceFormat1(item.max)

        const [maxInteger, maxDecimal] = maxPriceFormatted.split('.')
        return (
          <View className="productList-item-extra-left">
            <Text className="productList-item-price">
              {/* {`${intl.formatMessage({ id: 'currency' })}${
                // 多件促销时展示原价；满额减时也不直接展示活动价，保持和 PC 详情/列表一致
                item.activityTypeList && Array.isArray(item.activityTypeList) && item.activityTypeList.includes(7)
                  ? priceFormat(item.price)
                  : isFullMoneyReduce
                  ? priceFormat(item.price)
                  : priceFormat(item.preferentialPrice || item.price)
              }`} */}
              {`${intl.formatMessage({ id: 'currency' })}${minInteger}.${(minDecimal || '00').substring(0, 2)}`}
            </Text>
            <Text className="productList-item-unit">{`/${item.unit}`}</Text>
          </View>
        )
      case 2:
        return (
          <View className="productList-item-extra-left">
            <View className="productList-item-price__ask">
              {intl.formatMessage({ id: 'integral.zaixianxunjia', defaultMessage: '在线询价' })}
            </View>
          </View>
        )
      case 3:
        return (
          <View className="productList-item-extra-left">
            {/* <Text className="productList-item-point">
              {`${item.price} ${intl.formatMessage({ id: 'integral.jifen1', defaultMessage: '积分' })}`}
            </Text> */}
            <Text>{numFormat(data.min)}</Text>
            {data.min !== data.max && (
              <>
                <i>-</i>
                <Text>{numFormat(data.max)}</Text>
              </>
            )}
          </View>
        )
      default:
        return null
    }
  }

  return (
    <View
      className={classNames('productList-item', {
        'productList-item__larger': isLarger,
      })}
      style={`${customStyle}`}
      key={data.id}
    >
      <View
        className={classNames('productList-item-container', {
          'productList-item-container__larger': isLarger,
        })}
        style={`${customContainerStyle}`}
        onClick={() => handleClickItem(data)}
      >
        {/* <View style="font-size:24rpx;color:#ffffff;border-radius:4rpx;background:#f81638;position:absolute;left:0;top:0;padding: 10rpx;z-index: 99;">团购商品</View> */}
        <View
          className={classNames('productList-item-left', {
            'productList-item-left__larger': isLarger,
          })}
        >
          <ImageBox
            source={data.picture}
            width="100%"
            height="100%"
            className="productList-item-picture"
            borderRadius={!isLarger ? 4 : 0}
          />

          {data.minOrder === 0 || data.stockCount === 0 ? <View className="mask-box">补货中</View> : <></>}
        </View>
        <View
          className={classNames('productList-item-right', {
            'productList-item-right__larger': isLarger,
          })}
        >
          <View className="productList-item-right-head">
            <HighLightText value={data.name} customClassName="productList-item-name" />
            {data.priceType !== 3 && (
              <View
                className={classNames('productList-item-describe', {
                  'productList-item-describe__larger': isLarger,
                })}
              >
                {data.describe}
              </View>
            )}
          </View>
          <View className="productList-item-right-foot">
            <View
              className={classNames('productList-item-extra', {
                'productList-item-extra__larger': isLarger,
                'productList-item-point-wrap': data.priceType === 3,
              })}
            >
              {renderPriceByType(data)}
              <View
                className={classNames('productList-item-extra-right', {
                  'productList-item-extra-right-point': data.priceType === 3,
                })}
              >
                <Text className="productList-item-sales">
                  {`${data.salesVolume}${
                    data.priceType === 3
                      ? intl.formatMessage({ id: 'integral.yiduihuan', defaultMessage: '已兑换' })
                      : intl.formatMessage({ id: 'integral.chengjiao', defaultMessage: '成交' })
                  }`}
                </Text>
              </View>
            </View>
            {/* 标签 */}
            {data.saleTags && <Tags dataSource={data.saleTags} customClassName="productList-item-tabs" returnNum={3} />}
            {data.supplierInfo && showSupplierInfo && (
              <>
                <View
                  className={classNames('productList-item-supplier', {
                    'productList-item-supplier__larger': isLarger,
                  })}
                  onClick={(e) => handleClickSupplier(data, e)}
                >
                  <Text className="productList-item-supplier-name">{data.supplierInfo.name}</Text>
                  <View className="productList-item-supplier-arrow">&gt;</View>
                </View>
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  )
}

ProductListItem.defaultProps = {
  onClickItem: undefined,
  onClickSupplier: undefined,
  showSupplierInfo: false,
}

export default ProductListItem
