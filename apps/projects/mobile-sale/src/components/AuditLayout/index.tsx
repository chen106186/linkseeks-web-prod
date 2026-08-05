import React, { useEffect } from 'react'
import { View, Text, Toast, TextArea } from '@apps/mobile-ui'
import { setNavigationBarTitle, showToast } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import FullScreenLoading from '@/components/Loading/fullscreenLoading'
import { useSafeArea } from '@apps/mobile-services'
import Router from '@/utils/router'
import { limitByte } from '@/utils'
import './index.scss'

export enum STATE_TYPE {
  /** 不通过 */
  NOT_PASS,
  /** 通过 */
  PASS,
}

interface AuditLayoutProps {
  /** 标题 */
  title?: string
  /** 接口 */
  PostFn: () => Promise<unknown>
  /** id */
  id: number
  /** 审核状态 */
  STATE: STATE_TYPE.NOT_PASS | STATE_TYPE.PASS
  /** 刷新 */
  refresh?: () => void
}

const AuditLayout: React.FC<AuditLayoutProps> = (props: any) => {
  const intl = useIntl()
  const { id, PostFn, STATE, title, refresh } = props
  const { safeBottomHeight } = useSafeArea()
  const [cause, setCause] = React.useState<string>(STATE === STATE_TYPE.PASS ? '同意' : '')

  useEffect(() => {
    if (title) {
      setNavigationBarTitle({ title })
    } else {
      setNavigationBarTitle({ title: '确认审核不通过' })
    }
  }, [title])

  const handleTextInputChange = (text: string) => {
    setCause(text)
  }

  /** 审核提交 */
  const handleSubmit = () => {
    const param = {
      id,
      state: STATE,
      cause,
    }

    const message = limitByte(cause, { maxByte: 120 })
    if (message) {
      showToast({ title: message, icon: 'none' })
      return
    }

    if (!cause) {
      Toast.show({ title: '请输入原因', icon: 'none' })
      return
    }
    FullScreenLoading.show()
    PostFn(param).then((res) => {
      if (res.code !== 1000) {
        FullScreenLoading.hide()
        Toast.show({ title: intl.formatMessage({ id: `${res.code}`, defaultMessage: res.message }) })
        return
      }
      Router.navigateBack({
        delta: 2,
        success: () => {
          refresh()
        },
      })
      FullScreenLoading.hide()
    })
  }

  return (
    <View className="auditLayout" style={safeBottomHeight ? { paddingBottom: `${safeBottomHeight}PX` } : {}}>
      <FullScreenLoading />
      <View className="auditLayout-inputBox">
        <TextArea
          maxLength={60}
          count={false}
          height="100%"
          placeholder={intl.formatMessage({ id: 'inquiry.dianjishuruyuanyin', defaultMessage: '点击输入原因' })}
          value={cause}
          onChange={handleTextInputChange}
        />
      </View>
      <View className="auditLayout-btnBox">
        <View className="auditLayout-touchableOpacity" onClick={() => handleSubmit()}>
          <View className="auditLayout-primaryBtn">
            <Text className="auditLayout-primaryText">
              {intl.formatMessage({ id: 'inquiry.queren', defaultMessage: '确认' })}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}
export default AuditLayout
