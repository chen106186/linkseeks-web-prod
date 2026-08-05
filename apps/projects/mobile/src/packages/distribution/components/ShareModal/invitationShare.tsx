import React from 'react'
import { View, Text, Image, Button } from '@tarojs/components'
import { useIntl } from '@linkseeks/i18n'
import Overlay from '@/components/Overlay'
import './index.scss'

const downloadIcon = 'https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com/mini-program/img-add/download-icon.png'
const wechatIcon = 'http://lingxi-mini.oss-cn-hangzhou.aliyuncs.com/Images/wechat.png'
interface Props {
  visible: boolean
  shareType?: number
  bgImgSrc: string
  codeImgSrc: string
  onClose: () => void
  onSaveImage: () => void
}

const JoinMallShare: React.FC<Props> = ({ visible, bgImgSrc, codeImgSrc, onClose, onSaveImage }) => {
  const intl = useIntl()

  return (
    <Overlay visible={visible} position="top" zIndex={99}>
      <View className="container">
        <View className="share-content">
          <Image src={bgImgSrc} className="share-content-bg-img" mode="widthFix" />
          <View className="share-content-qrcode-box">
            <Image src={codeImgSrc} className="qrcode-img" mode="widthFix" />
            <Text className="qrcode-text">
              {intl.formatMessage({ id: 'distribution.saomiaoerweimachakan', defaultMessage: '扫描二维码查看' })}
            </Text>
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
              <Button openType="share" className="share-modal-button">
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

export default JoinMallShare
