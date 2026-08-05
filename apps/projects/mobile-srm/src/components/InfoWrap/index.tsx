import React, { ReactNode, CSSProperties } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { View, Icons, Toast } from '@apps/mobile-ui'
import { pxTransform, setClipboardData } from '@apps/mobile-services/utils/taro'
import styles from './index.module.scss'

export type InfoCardType = {
  title?: ReactNode
  subtitle?: string | ReactNode
  customStyle?: CSSProperties
  subType?: 'copy' | 'click'
  last?: boolean
  onSunTitleCallBack?: Function
}

const InfoWrap = ({ title, subtitle, customStyle, subType, last, onSunTitleCallBack }: InfoCardType) => {
  const intl = useIntl()
  const onSunTitleClick = () => {
    switch (subType) {
      case 'copy':
        if (typeof subtitle === 'string') {
          setClipboardData({
            data: subtitle,
            success: () =>
              Toast.show({
                title: intl.formatMessage({ id: 'common.copy.success', defaultMessage: '内容复制成功' }),
                icon: 'none',
              }),
          })
        }
        break
      case 'click':
        onSunTitleCallBack?.()
        break
    }
  }

  return (
    <View className={styles['info-wrap']} style={{ marginBottom: last ? 0 : pxTransform(16), ...customStyle }}>
      <View className={styles['title']}>{title}</View>
      <View className={styles['subtitle']} onClick={onSunTitleClick}>
        <View>{subtitle}</View>
        {typeof subtitle === 'string' && subType === 'copy' && (
          <Icons name="Copy" size={12} color="#91959B" customStyle={{ marginLeft: pxTransform(4) }} />
        )}
        {subType === 'click' && (
          <Icons name="ChevronRight" size={12} color="#91959B" customStyle={{ marginLeft: pxTransform(4) }} />
        )}
      </View>
    </View>
  )
}

InfoWrap.defaultProps = {}

export default InfoWrap
