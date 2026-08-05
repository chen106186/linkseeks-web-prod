import GlobalWrapper from '@/components/GlobalWrapper'
import React from 'react'
import cx from 'classnames'
import { pxTransform, useDidShow, setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import { View, Text, Icons, ScrollView, Modal, Image, Button } from '@apps/mobile-ui'
import { getOssUrlPath } from '@apps/constants'
import { useIntl } from '@linkseeks/i18n'
import useLogOffSuccess from './services/hooks/useLogOffSuccess'
import styles from './index.module.scss'
const Icon = getOssUrlPath('/miniprogram/assets/images/Checked.svg')
const LogOffSuccess: React.FC = () => {
  const intl = useIntl()
  const { onSuccess } = useLogOffSuccess()
  return (
    <View className={styles['page']}>
      <View className={styles['head']}>
        <Image src={Icon} className={styles['head-logo']} />
        <View className={styles['head-title']}>
          {intl.formatMessage({
            id: 'user.tijiaochenggong',
            defaultMessage: '提交成功',
          })}
        </View>
        <View className={styles['head-text']}>
          {intl.formatMessage({
            id: 'user.logOff.success.title',
            defaultMessage: '当前账号将在运营管理员审核通过后',
          })}
        </View>
        <View className={styles['head-text']}>
          {intl.formatMessage({
            id: 'user.logOff.success.tips',
            defaultMessage: '自动完成账号注销',
          })}
        </View>
      </View>
      <View className={styles['page-bottom']}>
        <Button
          type="primary"
          onClick={() => {
            onSuccess()
          }}
        >
          {intl.formatMessage({
            id: 'user.logOff.success.goHome',
            defaultMessage: '进入首页',
          })}
        </Button>
      </View>
    </View>
  )
}
export default GlobalWrapper(LogOffSuccess)
