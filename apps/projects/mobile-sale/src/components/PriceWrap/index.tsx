import React, { ReactNode } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { View, Text } from '@apps/mobile-ui'
import styles from './index.module.scss'

export type PriceWrapType = {
  symbol?: string
  money: string | number
  unit?: string
  addonBefore?: ReactNode
  addonAfter?: ReactNode
}

const PriceWrap = (props: PriceWrapType) => {
  const intl = useIntl()
  const {
    symbol = intl.formatMessage({ id: 'common.currency', defaultMessage: '¥' }),
    money,
    unit,
    addonBefore,
    addonAfter,
  } = props
  return (
    <View className={styles['price-wrap']}>
      {addonBefore}
      <Text className={styles['symbol']}>{symbol}</Text>
      <Text className={styles['money-main']}>{String(money).split('.')[0]}</Text>
      {String(money).split('.')[1] && <Text className={styles['money-secondary']}>.{String(money).split('.')[1]}</Text>}
      {unit && <Text className={styles['unit']}>/{unit}</Text>}
      {addonAfter}
    </View>
  )
}

PriceWrap.defaultProps = {}

export default PriceWrap
