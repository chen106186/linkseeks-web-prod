import { useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import Router from '@/utils/router'
import { showToast, preload } from '@apps/mobile-services/utils/taro'

const useLogOffReason = () => {
  const intl = useIntl()
  const [reason, setReason] = useState<string>('')

  const handleTextInputChange = (text: string) => {
    setReason(text)
  }

  const handlePre = () => {
    Router.navigateBack()
  }

  const handleNext = () => {
    if (!reason) {
      return showToast({
        title: intl.formatMessage({ id: 'user.logOff.reason.next.tips', defaultMessage: '请输入您注销账号的原因' }),
      })
    }
    preload('params', { reason })
    Router.navigateTo('basicSetting/logOffConfirm')
  }

  return {
    reason,
    handleTextInputChange,
    handlePre,
    handleNext,
  }
}

export default useLogOffReason
