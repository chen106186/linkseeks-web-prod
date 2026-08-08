import React, { useEffect, useState, useMemo, useRef, useLayoutEffect, CSSProperties } from 'react'
import { View, Text } from '@apps/mobile-ui'
import { useRouter, pxTransform } from '@apps/mobile-services/utils/taro'
import Popup from '@/components/Popup'
import CodeInput from '@/components/CodeInput'
import Loading from '@/components/Loading'
import { useIntl, getIntl } from '@linkseeks/i18n'
import styles from './index.module.scss'

interface Iprops {
  visible: boolean
  onCancel?: null | (() => void)
  /**
   * 总价格
   */
  total?: number | string
  onCodeFinish: null | ((values: string, resetCode?: () => void) => void)
  loading: boolean
  isError?: boolean
  /**
   * 弹框标题
   */
  title?: string
  /**
   * 货币， RMB -> ￥， 美元 -> $
   */
  currency?: string
}

const loadingStyle: CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  backgroundColor: '#000',
  width: pxTransform(100),
  height: pxTransform(100),
  marginLeft: pxTransform(-50),
  marginTop: pxTransform(-50),
  opacity: 0.8,
  zIndex: 101,
}

const PayInputPopup: React.FC<Iprops> = (props: Iprops) => {
  const intl = useIntl()

  const {
    visible,
    onCancel,
    total,
    onCodeFinish,
    loading,
    isError,
    title,
    currency = intl.formatMessage({ id: 'currency' }),
  } = props

  const handleClose = () => {
    onCancel?.()
  }

  const handleFinish = (value: string, resetCode?: () => void) => {
    if (onCodeFinish) {
      onCodeFinish(value, resetCode)
    }
  }

  const disabled = useMemo(() => loading, [loading])
  return (
    <>
      <Popup visible={visible} onClose={handleClose}>
        <View className={styles['payInputPopup']}>
          <View className={styles['popupHeader']}>
            <Text className={styles['popupHeaderTitle']}>{title}</Text>
          </View>
          <View className={styles['content']}>
            <Text className={styles['money']}>{`${currency} ${total}`}</Text>
            <Text className={styles['tips']}>
              {intl.formatMessage({ id: 'payOrder_components_payInputPopup_tips' })}
            </Text>
            {visible && (
              <View className={styles['inputContainer']}>
                <CodeInput
                  autoFocus
                  isEncrypt
                  disabled={disabled}
                  maxLength={6}
                  onFinish={handleFinish}
                  adjustPosition
                />
              </View>
            )}
            {(isError && (
              <Text className={styles['errorText']}>
                {intl.formatMessage({ id: 'payOrder_components_payInputPopup_errorText' })}
              </Text>
            )) ||
              null}
          </View>
        </View>
      </Popup>
      <Loading customStyle={loadingStyle} loading={loading} vertical size={40} textSize={14} />
    </>
  )
}

PayInputPopup.defaultProps = {
  onCancel: null,
  total: 0,
  isError: false,
  title: getIntl().formatMessage({ id: 'payOrder_components_payInputPopup_title' }),
  currency: getIntl().formatMessage({ id: 'currency' }),
}

export default PayInputPopup
