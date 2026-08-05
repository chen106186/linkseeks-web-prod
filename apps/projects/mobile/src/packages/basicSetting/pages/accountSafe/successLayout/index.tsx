import GlobalWrapper from '@/components/GlobalWrapper'
import React from 'react'
import { setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import { View, Text, Image } from '@apps/mobile-ui'
import { getOssUrlPath } from '@apps/constants'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
const success_icon = getOssUrlPath('/miniprogram/assets/images/state.png')
const SuccessLayout: React.FC<{}> = () => {
  const intl = useIntl()
  usePageInit()
  // setNavigationBarTitle({title: intl.formatMessage({id: 'realname.shimingrenzheng', defaultMessage: '实名认证'})})
  const handleSubmit = () => {
    Router.navigateBack({
      delta: 2,
    })
  }
  return (
    <View className={styles['successLayout']}>
      <View className={styles['successLayout-sucess']}>
        <Image className={styles['successLayout-image']} src={success_icon} />
        <Text className={styles['successLayout-successText']}>
          {intl.formatMessage({
            id: 'realname.renzhengchenggong',
            defaultMessage: '认证成功',
          })}
        </Text>
      </View>
      <View className={styles['successLayout-backBtn']} onClick={handleSubmit}>
        <Text className={styles['successLayout-backText']}>
          {intl.formatMessage({
            id: 'realname.fanhui',
            defaultMessage: '返回',
          })}
        </Text>
      </View>
    </View>
  )
}
export default GlobalWrapper(SuccessLayout)
