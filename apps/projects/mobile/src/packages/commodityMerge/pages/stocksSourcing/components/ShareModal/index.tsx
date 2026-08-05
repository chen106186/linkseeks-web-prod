import React from 'react'
import { Icons, View, Text, Image, CountDown } from '@apps/mobile-ui'
import { getOssUrlPath } from '@apps/constants'
import { Button } from '@tarojs/components'
import { useIntl } from '@linkseeks/i18n'
import Overlay from '@/components/Overlay'
// import useCountDown from 'src/hooks/useCountDown';
import styles from './index.module.scss'

interface Iprops {
  visible: boolean
  mode?: 'share' | 'shareSuccess'
  onClose?: () => void
  onShare: (key: 'wechat' | 'wechatMoment' | 'qq') => void
  /** 剩余人数 */
  leftNum: number
  /** 剩余时间 */
  endTime: number
  onContinueShare: () => void
}

const ShareModal: React.FC<Iprops> = (props: Iprops) => {
  const { visible, onClose, mode = 'share', onShare, leftNum, endTime, onContinueShare } = props
  const current = new Date().valueOf()
  const offset = Math.floor((endTime - current) / 1000)
  // const { time, formatedData } = useCountDown(+offset, 'HH:mm:ss');

  const intl = useIntl()

  const actions = [
    {
      title: intl.formatMessage({
        id: 'commodityMerge.stocksSourcing.components.shareModal.share.wechat',
        defaultMessage: '微信',
      }),
      img: getOssUrlPath('/Images/wechat.png'),
      key: 'wechat' as 'wechat',
    },
    // {
    //   title: 'QQ',
    //   img: getOssUrlPath("/Images/qq.png"),
    //   key: 'qq' as 'qq'
    // },
  ]

  const handleShare = (key: 'wechat' | 'wechatMoment' | 'qq') => {
    onShare?.(key)
  }

  const handleContinuesShare = () => {
    onContinueShare?.()
  }

  const renderShareSuccess = () => (
    <View className={styles['share-success']}>
      <View className={styles['share-success-title']}>
        <View className={styles['share-success-icon']}>
          <Icons name="CheckFill" size={16} color="#00a98f" />
        </View>
        <Text className={styles['share-success-text']}>
          {intl.formatMessage({
            id: 'commodityMerge.stocksSourcing.components.shareModal.share.success',
            defaultMessage: '分享成功',
          })}
        </Text>
      </View>
      <Text className={styles['share-success-tips']}>
        ——{' '}
        {intl.formatMessage({
          id: 'commodityMerge.stocksSourcing.components.shareModal.share.description',
          defaultMessage: '分享给更多好友吧',
        })}{' '}
        ——
      </Text>
      <View className={styles['continue-share']} onClick={handleContinuesShare}>
        <Text className={styles['continue-share-text']}>
          {intl.formatMessage({
            id: 'commodityMerge.stocksSourcing.components.shareModal.share.more',
            defaultMessage: '继续分享',
          })}
        </Text>
      </View>
    </View>
  )

  const renderShareContent = () => (
    <>
      <Text className={styles['share-modal-title']}>
        <Text className={styles['share-modal-title-special']}>
          {intl.formatMessage({ id: 'commodityMerge.stocksSourcing.components.shareModal.short', num: leftNum || 0 })}
        </Text>
        {intl.formatMessage({
          id: 'commodityMerge.stocksSourcing.components.shareModal.short.description',
          defaultMessage: '赶快邀请好友来拼单吧',
        })}
      </Text>
      <CountDown count={offset}>
        {(time, formatedData) => {
          return (
            <Text className={styles['share-modal-timeout']}>
              {intl.formatMessage({
                id: 'commodityMerge.stocksSourcing.components.shareModal.end',
                date: formatedData.formatTimeString,
              })}
            </Text>
          )
        }}
      </CountDown>

      <View className={styles['share-modal-actions']}>
        {actions.map((_item) => (
          <View onClick={() => handleShare(_item.key)} key={_item.key} className={styles['share-modal-actions-item']}>
            <Button openType="share" className={styles['share-modal-button']}>
              <Image src={_item.img} className={styles['share-modal-actions-item-image']} />
            </Button>
            <Text className={styles['share-modal-actions-item-text']}>{_item.title}</Text>
          </View>
        ))}
      </View>
    </>
  )

  const handleOnClose = () => {
    onClose?.()
  }

  return (
    <Overlay
      visible={visible}
      position="center"
      zIndex={99}
      // useModal
    >
      <View className={styles.container}>
        <View className={styles['share-modal']}>{mode === 'share' ? renderShareContent() : renderShareSuccess()}</View>
        <View className={styles['share-modal-footer']} onClick={handleOnClose}>
          <Icons name="Close" size={16} color="#fff" />
        </View>
      </View>
    </Overlay>
  )
}

export default ShareModal
