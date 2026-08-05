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
import './index.scss'

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
}

const ProductDescriptions: React.FC<ProductDescriptionsProps> = (props: ProductDescriptionsProps) => {
  const { wrapStyle, commodityRemarkList } = props

  const intl = useIntl()

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
      <View style={{ height: '117px' }} />
    </View>
  )
}

export default ProductDescriptions
