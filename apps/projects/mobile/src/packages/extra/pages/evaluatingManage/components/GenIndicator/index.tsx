import React, { Fragment } from 'react'
import { View, ActivityIndicator, Text } from '@apps/mobile-ui'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.module.scss'

interface GenIndicatorProps {
  /**
   * 是否加载中
   */
  loading: boolean
  /**
   * 加载文本，默认 加载中...
   */
  text?: string
  /**
   * 是否没有更多
   */
  noMore?: boolean
  /**
   * 没有更多文本，默认 已经到底啦～
   */
  noMoreText?: string
}

const GenIndicator: React.FC<GenIndicatorProps> = (props: GenIndicatorProps) => {
  const { loading, noMore } = props
  const intl = useIntl()

  if (loading) {
    return (
      <View className={styles['GenIndicator-indicatorContainer']}>
        <ActivityIndicator className={styles['GenIndicator-indicator']} size={20} isOpened />
        <Text className={styles['GenIndicator-indicatorText']}>
          {intl.formatMessage({ id: 'evaluatingManage.zhengzaijiazai', defaultMessage: '正在加载~' })}
        </Text>
      </View>
    )
  }
  if (!loading && noMore) {
    return (
      <View className={styles['GenIndicator-indicatorContainer']}>
        <Text className={styles['GenIndicator-indicatorText']}>
          {intl.formatMessage({ id: 'evaluatingManage.meiyougengduola', defaultMessage: '没有更多啦~' })}
        </Text>
      </View>
    )
  }

  return null
}

GenIndicator.defaultProps = {
  noMore: false,
}

export default GenIndicator
