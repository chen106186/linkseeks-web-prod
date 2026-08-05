import React from 'react'
import cx from 'classnames'
import { View, Text } from '@apps/mobile-ui'
import { useIntl } from '@linkseeks/i18n'
import './index.scss'

interface PasswordVerifyProps {
  score: number
}

const PasswordVerify: React.FC<PasswordVerifyProps> = (props: PasswordVerifyProps) => {
  const { score } = props
  const intl = useIntl()
  return (
    <View className="passwordVerify">
      <View className={cx('passwordVerify-item', score < 1 && 'passwordVerify-item-1')}>
        <Text className={cx('passwordVerify-item-text', score < 1 && 'passwordVerify-item-textAct')}>
          {intl.formatMessage({ id: 'common.weak', defaultMessage: '弱' })}
        </Text>
      </View>
      <View className={cx('passwordVerify-item', score >= 1 && score <= 2 && 'passwordVerify-item-2')}>
        <Text className={cx('passwordVerify-item-text', score >= 1 && score <= 2 && 'passwordVerify-item-textAct')}>
          {intl.formatMessage({ id: 'common.medium', defaultMessage: '中' })}
        </Text>
      </View>
      <View className={cx('passwordVerify-item', score >= 3 && 'passwordVerify-item-3')}>
        <Text className={cx('passwordVerify-item-text', score >= 3 && 'passwordVerify-item-textAct')}>
          {intl.formatMessage({ id: 'common.strong', defaultMessage: '强' })}
        </Text>
      </View>
    </View>
  )
}

export default PasswordVerify
