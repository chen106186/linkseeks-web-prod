/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-02 10:11:15
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-02 10:46:34
 * @Description: 商品详情描述组件
 */
import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { View, Text } from '@apps/mobile-ui'
import { RichText, Video } from '@tarojs/components'
import ImageBox from '@/components/ImageBox'
import { useMobileIntl } from '@apps/locales'
import './index.scss'
import { ProductInfo } from '../../hooks/useGetProductDetail'
import { ProductSkuType } from '../SkuPopup/utils'

type ImageListItemType = {
  link: string
  linkType: number
  url: string
  /**
   * 图片类型:1-商品描述图片;2-厂商资质图片;3-商品检测报告图片
   */
  imageType: number
}

interface RemarkItemType {
  id: number
  type: 1 | 2 | 3
  content: string
  url: string
  linkType: number
  link: string
  updateTime: number
}

interface ProductDescriptionsProps {
  /**
   * 自定义外部样式
   */
  wrapStyle?: React.CSSProperties
  commodityRemarkList?: RemarkItemType[]
  productInfo: ProductInfo | null
  currentSku: ProductSkuType
}

const ProductDescriptions: React.FC<ProductDescriptionsProps> = (props: ProductDescriptionsProps) => {
  const { wrapStyle, commodityRemarkList, productInfo, currentSku } = props
  console.log(currentSku, 'currentSku')
  const intl = useIntl()
  const translate = useMobileIntl()

  const processRichText = (content: string) =>
    content.replace(/<img/gi, '<img style="max-width:100%;height:auto;display:block"')

  return (
    <View className="product-descriptions" style={wrapStyle}>
      {/* 商品详情 */}
      <View className="product-descriptions-titleWrap">
        <View className="product-descriptions-title-line" />
        <Text className="product-descriptions-title">
          {intl.formatMessage({ id: 'commodityMerge.components.descriptions', defaultMessage: '商品详情' })}
        </Text>
        <View className="product-descriptions-title-line" />
      </View>
      {commodityRemarkList &&
        commodityRemarkList.map((item) => {
          if (item.type === 1) {
            return <RichText className="product-descriptions-richtext" nodes={processRichText(item.content)} />
          }
          if (item.type === 2) {
            return (
              <View className="product-descriptions-imgs" key={item.id}>
                <View className="product-descriptions-imgs-item">
                  <ImageBox
                    className="product-descriptions-imgs-item-box"
                    source={item.url!}
                    resizeMode="widthFix"
                    borderRadius={0}
                  />
                </View>
              </View>
            )
          }
          if (item.type === 3) {
            return (
              <View className="product-descriptions-video" key={item.id}>
                <View className="product-descriptions-video-item">
                  <Video src={item.url!} objectFit="contain" onError={(err) => console.log('onError', err)} />
                </View>
              </View>
            )
          }
        })}

      <View className="product-descriptions-titleWrap">
        <View className="product-descriptions-title-line" />
        <Text className="product-descriptions-title">{translate('mobile.common.guigecanshu')}</Text>
        <View className="product-descriptions-title-line" />
      </View>
      <View className="product-descriptions-line-wrap">
        <View className="product-descriptions-line">
          <View className="product-descriptions-line-label">{translate('mobile.common.shangpinpinlei')}</View>
          <View className="product-descriptions-line-breif">
            <Text>{productInfo?.customerCategoryName}</Text>
          </View>
        </View>
        <View className="product-descriptions-line">
          <View className="product-descriptions-line-label">{translate('mobile.common.shangpinpinpai')}</View>
          <View className="product-descriptions-line-breif">
            <Text>{productInfo?.brandName}</Text>
          </View>
        </View>
        <View className="product-descriptions-line">
          <View className="product-descriptions-line-label">{translate('mobile.common.guigebianma')}</View>
          <View className="product-descriptions-line-breif">
            <Text>{currentSku?.code}</Text>
          </View>
        </View>
        {
          // 类目属性
          productInfo?.commodityAttributeList &&
            productInfo?.commodityAttributeList.length > 0 &&
            productInfo?.commodityAttributeList.map((item) => (
              <View className="product-descriptions-line" key={item.id}>
                <View className="product-descriptions-line-label">{item.customerAttribute?.name}</View>
                <View className="product-descriptions-line-breif">
                  {item.customerAttributeValueList &&
                    item.customerAttributeValueList.length > 0 &&
                    item.customerAttributeValueList.map((attrItem, attrIndex) => (
                      <Text key={`introduction_list_item_item_${attrItem.id}`}>
                        {attrItem.value}
                        {attrIndex !== item.customerAttributeValueList.length - 1 ? '、' : ''}
                      </Text>
                    ))}
                </View>
              </View>
            ))
        }
        {
          // 规格属性
          currentSku?.commoditySkuAttributeList &&
            currentSku?.commoditySkuAttributeList.length > 0 &&
            currentSku.commoditySkuAttributeList.map((item) => (
              <View className="product-descriptions-line" key={item.id}>
                <View className="product-descriptions-line-label">{item.customerAttribute?.name}</View>
                <View className="product-descriptions-line-breif">
                  <Text>{item.customerAttributeValue?.value}</Text>
                </View>
              </View>
            ))
        }
        {productInfo?.packing && (
          <View className="product-descriptions-line">
            <View className="product-descriptions-line-label">{translate('mobile.common.baozhuangqingdan')}</View>
            <View className="product-descriptions-line-breif">
              <Text>{productInfo?.packing}</Text>
            </View>
          </View>
        )}
        {productInfo?.afterService && (
          <View className="product-descriptions-line">
            <View className="product-descriptions-line-label">{translate('mobile.common.shouhoufuwu')}</View>
            <View className="product-descriptions-line-breif">
              <Text>{productInfo?.afterService}</Text>
            </View>
          </View>
        )}
      </View>
      <View style={{ height: '117px' }} />
    </View>
  )
}

export default ProductDescriptions
