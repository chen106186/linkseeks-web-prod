import React, { useEffect } from 'react'
import { View, Text, Toast, TextArea } from '@apps/mobile-ui'
import { setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import FullScreenLoading from '@/components/Loading/fullscreenLoading'
import { useSafeArea } from '@apps/mobile-services'
import Router from '@/utils/router'
import styles from './index.module.scss'

interface AuditLayoutProps {
  /** 标题 */
  title?: string
  /** 接口 */
  PostFn: () => Promise<unknown>
  /** id */
  id: number
  /** 刷新 */
  refresh?: () => void
}

const AuditLayout: React.FC<AuditLayoutProps> = (props: any) => {
  const { id, PostFn, refresh, title } = props
  const { safeBottomHeight } = useSafeArea()
  const [cause, setCause] = React.useState<string>('')
  const intl = useIntl()
  useEffect(() => {
    if (title) {
      setNavigationBarTitle({ title })
    } else {
      setNavigationBarTitle({
        title: intl.formatMessage({ id: 'inquiry.shenhebutongguoyuanyin', defaultMessage: '审核不通过原因' }),
      })
    }
  }, [title])

  const handleTextInputChange = (text: string) => {
    setCause(text)
  }

  /** 审核提交 */
  const handleSubmit = () => {
    const param = {
      id,
      state: 0,
      cause,
    }

    if (!cause) {
      Toast.show({
        title: intl.formatMessage({ id: 'inquiry.qingshuruyuanyin', defaultMessage: '请输入原因' }),
        icon: 'none',
      })
      return
    }
    FullScreenLoading.show()
    PostFn(param).then((res) => {
      if (res.code !== 1000) {
        FullScreenLoading.hide()
        Toast.show({ title: intl.formatMessage({ id: `${res.code}`, defaultMessage: res.message }) })
        return
      }
      refresh()
      Router.navigateBack({
        delta: 2,
      })
      FullScreenLoading.hide()
    })
  }

  return (
    <View className={styles['auditLayout']} style={safeBottomHeight ? { paddingBottom: `${safeBottomHeight}PX` } : {}}>
      <FullScreenLoading />
      <View className={styles['auditLayout-inputBox']}>
        <TextArea
          maxLength={60}
          count={false}
          height="100%"
          placeholder={intl.formatMessage({ id: 'inquiry.dianjishuruyuanyin', defaultMessage: '点击输入原因' })}
          value={cause}
          onChange={handleTextInputChange}
        />
      </View>
      <View className={styles['auditLayout-btnBox']}>
        <View className={styles['auditLayout-touchableOpacity']} onClick={() => handleSubmit()}>
          <View className={styles['auditLayout-primaryBtn']}>
            <Text className={styles['auditLayout-primaryText']}>
              {intl.formatMessage({ id: 'inquiry.queren', defaultMessage: '确认' })}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}
export default AuditLayout
