import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useState } from 'react'
import { getCurrentInstance, showLoading, hideLoading, setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import { dateFormat } from '@/utils/date'
import { useIntl } from '@linkseeks/i18n'
import { View, Text, ScrollView, Toast } from '@apps/mobile-ui'
import { getSupportMobileMessageGet } from '@apps/apis'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
type InfoType = {
  title: string
  sendTime: number | null
  content: string
}
const MsgDetail: React.FC = () => {
  const params = getCurrentInstance()?.router?.params || {}
  const { id } = params
  const intl = useIntl()
  const [info, setInfo] = useState<InfoType>({
    title: '',
    content: '',
    sendTime: null,
  })
  usePageInit()
  useEffect(() => {
    async function fetchDetail() {
      showLoading()
      const { data, code, message } = await getSupportMobileMessageGet({
        id: `${id || ''}`,
      })
      hideLoading()
      if (code !== 1000) {
        Toast.show({
          title: intl.formatMessage({
            id: `${code}`,
            defaultMessage: message,
          }),
          icon: 'none',
        })
        return
      }
      setInfo(data)
    }
    fetchDetail()
    // setNavigationBarTitle({ title: intl.formatMessage({id: 'mine.xiaoxixiangqing',  defaultMessage: '消息详情' }) })
  }, [])
  return (
    <View className={styles['page']}>
      <ScrollView className={styles['scroll-view']}>
        <View className={styles['msg-header']}>
          <View className={styles['border-left']}>
            <Text className={styles['msg-title']}>{info.title}</Text>
          </View>
          <Text className={styles['date']}>{(info.sendTime && dateFormat(new Date(info.sendTime))) || ''}</Text>
        </View>

        <View className={styles['content']}>
          <Text className={styles['message-text']}>{info.content}</Text>
        </View>
      </ScrollView>
    </View>
  )
}
export default GlobalWrapper(MsgDetail)
