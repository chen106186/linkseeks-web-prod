import React, { memo, useState } from 'react'
import { View, Input } from '@apps/mobile-ui'
import Popup from '@/components/Popup'
import { limitDecimals } from '@/utils'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.module.scss'

export type PropsType = {
  visible: boolean
  onClose: Function
  onConfirm: Function
}

const ChangeRatioPopup = ({ visible, onClose, onConfirm }: PropsType) => {
  const intl = useIntl()
  const [rate, setRate] = useState<string>('')

  const onChangeRate = (value) => {
    setRate(limitDecimals(value))
  }

  return (
    <Popup
      title={intl.formatMessage({ id: 'order.modifyPaymentProportion', defaultMessage: '修改支付比例' })}
      closeable
      visible={visible}
      onClose={() => onClose?.()}
      position="center"
      customClassName={styles['popup']}
    >
      <View className={styles['popup-body']}>
        <View className={styles['input-wrap']}>
          <Input
            type="digit"
            placeholder={`${intl.formatMessage({
              id: 'common:common.input.enter',
              defaultMessage: '请输入',
            })}${intl.formatMessage({ id: 'order.paymentProportion', defaultMessage: '支付比例' })}`}
            value={rate}
            onChange={onChangeRate}
          />
        </View>
        <View className={styles['btn-wrap']} onClick={() => onConfirm?.(rate)}>
          {intl.formatMessage({ id: 'common:common.handle.confirm', defaultMessage: '确定' })}
        </View>
      </View>
    </Popup>
  )
}

ChangeRatioPopup.defaultProps = {
  visible: false,
}

export default memo(ChangeRatioPopup)
