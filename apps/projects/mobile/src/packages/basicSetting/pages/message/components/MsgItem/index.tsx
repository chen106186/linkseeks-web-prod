import React from 'react'
import { showLoading, hideLoading } from '@apps/mobile-services/utils/taro'
import { View, Text, Image, Toast } from '@apps/mobile-ui'
import { dateFormat } from '@/utils/date'
import { useIntl } from '@linkseeks/i18n'
import Router from '@/utils/router'
import { postSupportMobileMessageRead } from '@apps/apis'
import { small } from '../../common/images'
import styles from './index.module.scss'

interface Iprops {
  type: number
  title: string
  content: string
  sendTime: number
  isRead: boolean
  id: number
  onRead: (id: number) => void
}

const MsgItem = (props: Iprops) => {
  const { type, title, content, sendTime, isRead, id, onRead } = props
  const time = dateFormat(new Date(sendTime))
  const intl = useIntl()
  const handleJump = async () => {
    // /report/mobile/message/member/read
    showLoading()
    const { code, message } = await postSupportMobileMessageRead({ id })
    hideLoading()

    if (code !== 1000) {
      Toast.show({ title: intl.formatMessage({ id: `${code}`, defaultMessage: message }), icon: 'none' })
      return
    }
    onRead(id)
    Router.navigateTo('basicSetting/msgDetail', {
      id,
    })
  }

  return (
    <View className={styles['section']}>
      <View onClick={handleJump}>
        <View className={styles['header']}>
          <View className={styles['icon']}>
            <Image src={small[type]} className={styles['image']} />
            {(!isRead && <View className={styles['no-read']} />) || null}
          </View>
          <Text className={styles['title']}>{title}</Text>
          <Text className={styles['date']}>{time}</Text>
        </View>
        <Text className={styles['body']}>{content}</Text>
      </View>
    </View>
  )
}

export default React.memo(MsgItem)
