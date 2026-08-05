import React from 'react'
import { View, Text, Image } from '@apps/mobile-ui'
import { Button } from '@tarojs/components'
import { useIntl } from '@linkseeks/i18n'
import Overlay from '@/components/Overlay'
import './index.scss'
import { formattedPricePart } from '@/packages/distribution/utils/formatter'
const downloadIcon = 'https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com/mini-program/img-add/download-icon.png'
const wechatIcon = 'http://lingxi-mini.oss-cn-hangzhou.aliyuncs.com/Images/wechat.png'
interface Iprops {
  visible: boolean
  imgSrc: string
  codeImgSrc: string
  onClose: () => void
  onSaveImage: () => void
  product: {
    name: string
    mainPic: string
    price: number
    unitName?: string
    tags?: string[]
  }
}

const ShareModal: React.FC<Iprops> = (props: Iprops) => {
  const { visible, imgSrc, codeImgSrc, onClose, onSaveImage, product } = props
  const intl = useIntl()
  // const actions = [
  //   {
  //     title: intl.formatMessage({
  //       id: 'distribution.components.shareModa.share.baocuntupian',
  //       defaultMessage: '保存图片',
  //     }),
  //     // img: "http://lingxi-mini.oss-cn-hangzhou.aliyuncs.com/Images/qq.png",
  //     img: `${downloadIcon}`,
  //     key: 'baocuntupian' as 'bctp',
  //   },
  //   {
  //     title: intl.formatMessage({
  //       id: 'commodityMerge.stocksSourcing.components.shareModal.share.wechat',
  //       defaultMessage: '微信',
  //     }),
  //     img: '',
  //     key: 'wechat' as 'wechat',
  //   },
  // ]
  const tags = product?.tags ?? []

  return (
    <Overlay visible={visible} position="top" zIndex={99}>
      <View className="container">
        <View className="share-content-shop">
          <Image src={imgSrc} className="share-content-shop-bg-img" />
          <View className="share-content-shop-info">
            <Image src={product?.mainPic} className="share-content-shop-info-img"></Image>
            <View className="share-content-shop-info-name">{product?.name}</View>
            <View className="share-content-shop-info-footer">
              <View>
                <View className="share-content-shop-info-footer-price">
                  <Text className="share-content-shop-info-footer-price-symbol">
                    {intl.formatMessage({ id: 'currency', defaultMessage: '￥' })}
                  </Text>
                  <Text className="share-content-shop-info-footer-price-money">
                    {formattedPricePart(product?.price, 1)}
                  </Text>
                  <Text>.{formattedPricePart(product?.price, 2)}</Text>
                  <Text className="share-content-shop-info-footer-price-unit">/{product?.unitName}</Text>
                </View>
                {tags?.length > 0 && (
                  <View className="share-content-shop-info-footer-tags">
                    {tags.slice(0, 5).map((tag, index) => (
                      <Text key={index} className="share-content-shop-info-footer-tags-item">
                        {tag}
                      </Text>
                    ))}
                    {tags.length > 5 && <Text className="share-content-shop-info-footer-tags-text">...</Text>}
                  </View>
                )}
              </View>
              <View className="share-content-shop-info-footer-qrcode">
                <Image src={codeImgSrc} className="share-content-shop-info-footer-qrcode-img"></Image>
                <View>
                  {intl.formatMessage({ id: 'distribution.saomiaoerweimachakan', defaultMessage: '扫描二维码查看' })}
                </View>
              </View>
            </View>
          </View>
        </View>

        <View className="footer">
          <View className="footer-title">
            {intl.formatMessage({ id: 'distribution.fenxiangzhi', defaultMessage: '分享至' })}
          </View>
          <View className="footer-actions">
            {/* 保存图片按钮（不使用 Button，防止冒泡） */}
            <View
              className="share-modal-actions-item"
              onClick={(e) => {
                e.stopPropagation()
                onSaveImage()
              }}
            >
              <Image src={downloadIcon} className="share-modal-actions-item-image" />
              <Text className="share-modal-actions-item-text">
                {intl.formatMessage({
                  id: 'distribution.components.shareModa.share.baocuntupian',
                  defaultMessage: '保存图片',
                })}
              </Text>
            </View>

            {/* 微信分享按钮（必须使用 Button 才能支持分享） */}
            <View className="share-modal-actions-item">
              <Button openType="share" data-share-type="poster" className="share-modal-button">
                <Image src={wechatIcon} className="share-modal-actions-item-image" />
              </Button>
              <Text className="share-modal-actions-item-text">
                {intl.formatMessage({
                  id: 'commodityMerge.stocksSourcing.components.shareModal.share.wechat',
                  defaultMessage: '微信',
                })}
              </Text>
            </View>
          </View>

          <View className="cancel-box">
            <View className="cancel-box-btn" onClick={onClose}>
              {intl.formatMessage({ id: 'distribution.quxiao', defaultMessage: '取消' })}
            </View>
          </View>
        </View>
      </View>
    </Overlay>
  )
}

export default ShareModal
