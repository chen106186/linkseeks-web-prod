import GlobalWrapper from '@/components/GlobalWrapper'
import React from 'react'
import cx from 'classnames'
import { pxTransform, useDidShow, setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import { View, Text, Icons, ScrollView, Modal, Image, Button } from '@apps/mobile-ui'
import { useIntl } from '@linkseeks/i18n'
import { useSafeArea } from '@apps/mobile-services'
import { getOssUrlPath } from '@apps/constants'
import useLogOffFail from './services/hooks/useLogOffFail'
import styles from './index.module.scss'
const Icon = getOssUrlPath('/miniprogram/assets/images/warning.svg')
const LogOffFail: React.FC = () => {
  const intl = useIntl()
  const { safeBottomHeight } = useSafeArea()
  const { data, onFail } = useLogOffFail()
  const _renderItem = (item, index) => {
    return (
      <View className={styles['renderItem']}>
        <View className={styles['renderItem-title']}>{item.title}</View>
        <View className={styles['renderItem-text']}>{item.describe}</View>
      </View>
    )
  }
  return (
    <View className={styles['page']}>
      <View className={styles['head']}>
        <Image src={Icon} className={styles['head-logo']} />
        <View className={styles['head-title']}>
          {intl.formatMessage({
            id: 'user.logOff.fail.title',
            defaultMessage: '系统监测到您的账号不满足以下注销条件',
          })}
        </View>
        <View className={styles['head-title']}>
          {intl.formatMessage({
            id: 'user.logOff.fail.tips',
            defaultMessage: '请完成以下条件后注销',
          })}
        </View>
      </View>
      <ScrollView
        className={styles['page-scrollView']}
        data={data}
        renderItem={({ item, index }) => _renderItem(item, index)}
      />
      <View
        className={styles['page-bottom']}
        style={{
          paddingBottom: pxTransform(safeBottomHeight + 8),
        }}
      >
        <Button onClick={onFail} type="primary">
          {intl.formatMessage({
            id: 'user.logOff.fail.next',
            defaultMessage: '确定',
          })}
        </Button>
      </View>
    </View>
  )
}
export default GlobalWrapper(LogOffFail)
