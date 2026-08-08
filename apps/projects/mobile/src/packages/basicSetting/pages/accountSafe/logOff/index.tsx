import GlobalWrapper from '@/components/GlobalWrapper'
import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { View, Text, ScrollView, Image, Button } from '@apps/mobile-ui'
import { pxTransform, useDidShow } from '@apps/mobile-services/utils/taro'
import { removeAsyncStorage } from '@apps/mobile-services/utils/storage'
import { IS_WEB } from '@/constants'
import { LOGOFF_DATA } from '@/constants/storage'
import { useSafeArea } from '@apps/mobile-services'
import { getOssUrlPath } from '@apps/constants'
import useLogOff from './services/hooks/useLogOff'
import useLogOffNotice from './services/hooks/useLogOffNotice'
import Progress from './components/progress'
import styles from './index.module.scss'
const CheckedIcon = getOssUrlPath('/miniprogram/assets/images/Checked-@2x.png')
const DefaultIcon = getOssUrlPath('/miniprogram/assets/images/Default@2x.png')
const LogOff: React.FC = () => {
  const intl = useIntl()
  const { safeBottomHeight } = useSafeArea()
  const { data, isRead, jumpToWebView, toggleReadStatus, handleNext } = useLogOff()
  const { columnTypeList } = useLogOffNotice()
  useDidShow(() => {
    removeAsyncStorage(LOGOFF_DATA)
  })
  return (
    <View className={styles['page']}>
      <Progress total={3} step={1} />
      <View
        style={{
          paddingLeft: pxTransform(8),
          paddingRight: pxTransform(8),
        }}
      >
        <View className={styles['page-title']}>
          {intl.formatMessage({
            id: 'user.logOff.index.title',
            defaultMessage: '申请注销账号',
          })}
        </View>
        <View className={styles['page-tips']}>
          {intl.formatMessage({
            id: 'user.logOff.index.tips',
            defaultMessage:
              '很遗憾无法继续为您提供服务，感谢您一路陪伴支持。注销账户前，需要对以下信息进行验证，以确保您的账户安全：',
          })}
        </View>
      </View>
      <ScrollView
        className={styles['page-scrollView']}
        data={data}
        style={{
          overflow: !IS_WEB ? 'hidden' : '',
        }}
        renderItem={({ item, index }) => (
          <View key={index} className={styles['page-scrollView-item']}>
            {item}
          </View>
        )}
      />
      <View className={styles['sign']}>
        <Image src={isRead ? CheckedIcon : DefaultIcon} onClick={() => toggleReadStatus()} />
        <View className={styles['sign-flex']}>
          <Text className={styles['sign-text']}>
            {intl.formatMessage({
              id: 'user.logOff.index.select',
              defaultMessage: '阅读并同意',
            })}
          </Text>
          {columnTypeList.map((items: any) => (
            <Text key={items.id} className={styles['sign-right']} onClick={() => jumpToWebView(items)}>
              《{items.title}》{' '}
            </Text>
          ))}
        </View>
      </View>
      <View
        className={styles['page-bottom']}
        style={{
          paddingBottom: pxTransform(safeBottomHeight + 8),
        }}
      >
        <Button type="primary" onClick={handleNext}>
          {intl.formatMessage({
            id: 'user.logOff.index.next',
            defaultMessage: '下一步',
          })}
        </Button>
      </View>
    </View>
  )
}
export default GlobalWrapper(LogOff)
