import React from 'react'
import { Icons, View, Text, Image } from '@apps/mobile-ui'
import { Button } from '@tarojs/components'
import { useIntl } from '@linkseeks/i18n'
import Overlay from '@/components/Overlay'

import './index.scss'

const shareBgImg = 'https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com/mini-program/img-add/share-bg.png'
const downloadIcon = 'https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com/mini-program/img-add/download-icon.png'

interface Iprops {
  visible: boolean
  mode?: 'share' | 'shareSuccess' | 'invitation'
  imgSrc?: string
  onClose?: () => void
  onShare: (key: 'wechat' | 'wechatMoment' | 'qq') => void
}

const ShareModal: React.FC<Iprops> = (props: Iprops) => {
  const { visible, onClose, mode = 'share', onShare, imgSrc = '' } = props
  const intl = useIntl()
  const actions = [
    {
      title: intl.formatMessage({
        id: 'distribution.components.shareModa.share.baocuntupian',
        defaultMessage: '保存图片',
      }),
      // img: "http://lingxi-mini.oss-cn-hangzhou.aliyuncs.com/Images/qq.png",
      img: `${downloadIcon}`,
      key: 'baocuntupian' as 'bctp',
    },
    {
      title: intl.formatMessage({
        id: 'commodityMerge.stocksSourcing.components.shareModal.share.wechat',
        defaultMessage: '微信',
      }),
      img: 'http://lingxi-mini.oss-cn-hangzhou.aliyuncs.com/Images/wechat.png',
      key: 'wechat' as 'wechat',
    },
  ]

  const handleShare = (key: 'wechat' | 'wechatMoment' | 'qq' | 'bctp') => {
    if (key === 'bctp') {
      return
    }

    onShare?.(key)
  }
  const handleOnClose = () => {
    onClose?.()
  }

  return (
    <Overlay visible={visible} position="top" zIndex={99}>
      <View className="container">
        {mode === 'share' && (
          <View className="share-content">
            <Image src={shareBgImg} className="share-content-bg-img" />
            <View className="share-content-info">
              <Image src={shareBgImg} className="share-content-info-img"></Image>
              <View className="share-content-info-name">
                海南妃子笑荔枝5斤新鲜水果当季现摘爆甜桂花荔枝香老树大果整箱
              </View>
              <View className="share-content-info-footer">
                <View>
                  <View className="share-content-info-footer-price">
                    <Text className="share-content-info-footer-price-symbol">¥</Text>
                    <Text className="share-content-info-footer-price-money">289</Text>
                    <Text>.28</Text>
                    <Text className="share-content-info-footer-price-unit">/件</Text>
                  </View>
                  <View className="share-content-info-footer-tags">
                    <Text className="share-content-info-footer-tags-item">8折</Text>
                    <Text className="share-content-info-footer-tags-item">直降</Text>
                    <Text className="share-content-info-footer-tags-item">返现</Text>
                  </View>
                </View>
                <View className="share-content-info-footer-qrcode">
                  <Image src={shareBgImg} className="share-content-info-footer-qrcode-img"></Image>
                  <View>扫描二维码查看</View>
                </View>
              </View>
            </View>
          </View>
        )}
        {mode === 'invitation' && (
          <View className="share-content">
            <Image src={imgSrc} className="share-content-bg-img"></Image>
          </View>
        )}

        <View className="footer">
          <View className="footer-title">分享至</View>
          <View className="footer-actions">
            {actions.map((_item) => (
              <View onClick={() => handleShare(_item.key)} key={_item.key} className="share-modal-actions-item">
                {_item.key === 'bctp' ? (
                  <Image src={_item.img} className="share-modal-actions-item-image" />
                ) : (
                  <Button openType="share" className="share-modal-button">
                    <Image src={_item.img} className="share-modal-actions-item-image" />
                  </Button>
                )}
                <Text className="share-modal-actions-item-text">{_item.title}</Text>
              </View>
            ))}
          </View>
          <View className="cancel-box">
            <View
              className="cancel-box-btn"
              onClick={() => {
                handleOnClose()
              }}
            >
              取消
            </View>
          </View>
        </View>
      </View>
    </Overlay>
  )
}

export default ShareModal
