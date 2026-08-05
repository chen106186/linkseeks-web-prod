import React from 'react';
import { useIntl } from '@linkseeks/i18n';
import { View, Text } from '@apps/mobile-ui';
import styles from './index.module.scss'

interface Iprops {
  money: number | string,
  onTimeOut?: null | (() => void),
  hasCountDown?: boolean,
  tips?: string,
  // expireTime: number | null,
}

const PayCount: React.FC<Iprops> = (props: Iprops) => {
  const intl = useIntl()

  const { money, onTimeOut, hasCountDown, tips } = props;

  return (
    <View className={styles['payCount']}>
      <View className={styles['timeContainer']}>
        {
          hasCountDown && (
            <>
              <Text className={styles['time']}>{intl.formatMessage({id: 'payOrder_components_payCount_time'})}</Text>
            </>
          )
        }
      </View>
      <Text className={styles['money']}>{intl.formatMessage({id: 'currency'})}{money}</Text>
    </View>
  )
}

PayCount.defaultProps = {
  onTimeOut: null,
  hasCountDown: true,
  tips: "",
}

export default PayCount;
