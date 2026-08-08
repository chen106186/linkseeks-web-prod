import { useSafeArea } from '@apps/mobile-services'
import { useIntl } from '@linkseeks/i18n'
import { numFormat } from '@/utils/numberFormat'
import cx from 'classnames'
import { Button } from '@tarojs/components'
import { View, Text } from '@apps/mobile-ui'
import React from 'react'
import styles from './index.module.scss'

interface Iprops {
  onSubmit?: (() => void) | null
  /** 积分 */
  score: number
  disabled: boolean
}

const SubmitBtn: React.FC<Iprops> = (props: Iprops) => {
  const { onSubmit = null, score, disabled } = props
  const { safeBottomHeight } = useSafeArea()
  const intl = useIntl()
  const handleSubmit = () => {
    onSubmit?.()
  }

  return (
    <View
      className={styles.submitBtn}
      style={safeBottomHeight ? { paddingBottom: `${safeBottomHeight}PX` } : {}}
      onClick={handleSubmit}
    >
      <View className={styles.scrollInfo}>
        <Text>{intl.formatMessage({ id: 'integral.order.total', defaultMessage: '合计积分' })}</Text>
        <Text className={styles.score}>{numFormat(score)}</Text>
        <Text className={styles.scoreName}>
          {intl.formatMessage({ id: 'integral.jifen1', defaultMessage: '积分' })}
        </Text>
      </View>
      <Button disabled={disabled} className={cx(styles.btn, disabled && styles.btn_disabled)}>
        {intl.formatMessage({ id: 'integral.order.submit', defaultMessage: '提交订单' })}
      </Button>
    </View>
  )
}

export default SubmitBtn
