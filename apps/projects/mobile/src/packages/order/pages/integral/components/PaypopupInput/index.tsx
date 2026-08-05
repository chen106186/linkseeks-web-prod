import Popup from '@/components/Popup';
import React from 'react';
import CodeInput from '@/components/CodeInput';
import { useIntl } from '@linkseeks/i18n';
import { View, Text } from '@apps/mobile-ui';
import styles from './index.module.scss';

interface Iprops {
  popupTitle: string,
  scoreValue: string,
  visible: boolean,
  onClose?: (() => void) | null,
  onCodeFinish?: ((value: string, reset: () => void) => void) | null
}

const PayPopupInput: React.FC<Iprops> = (props: Iprops) => {
  const { popupTitle, scoreValue, visible, onClose = null, onCodeFinish, ref } = props;
  const intl = useIntl()
  const handleClose = () => {
    onClose?.()
  }

  const handleFinish = (value: string, reset) => {
    onCodeFinish?.(value, reset)
  }

  return (
    <Popup closeOnClickOverlay={false} visible={visible} onClose={handleClose} >
      <View className={styles.container}>
        <View className={styles.popupTitle}>
          <Text>{popupTitle}</Text>
        </View>
        <View className={styles.content}>
          <View className={styles.header}>
            <Text className={styles.value}>{scoreValue}</Text>
            <Text className={styles.tips}>{intl.formatMessage({id: 'integral.order.passwordTips', defaultMessage: '请输入支付密码'})}</Text>
          </View>
          <CodeInput
            isEncrypt
            onFinish={handleFinish}
            heigthlightClassName={styles.heightlight}
            codeInputClassName={styles.boxItem}
          />
        </View>
      </View>
    </Popup>
  )
}

export default PayPopupInput
