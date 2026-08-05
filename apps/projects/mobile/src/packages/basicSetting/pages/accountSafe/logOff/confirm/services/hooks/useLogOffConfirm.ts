import { useState, useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { getMemberMobileSecurityCancellationSms, postMemberMobileSecurityCancellation } from '@apps/apis'
import usePhoneVerify from '@apps/services/verify/usePhoneVerify'
import { USER_INFO } from '@/constants/storage'
import { getAsyncStorage } from '@apps/mobile-services/utils/storage'
import { getCurrentInstance } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import { encryptedByAES } from '@linkseeks/crypto'

const RESET_TIME = 60

const useLogOffConfirm = () => {
  const intl = useIntl()
  const { params } = getCurrentInstance().preloadData || {}
  const { countdown, start, sendLoading, canSend } = usePhoneVerify({
    api: getMemberMobileSecurityCancellationSms,
    codeResetTime: RESET_TIME,
  })
  const [code, setCode] = useState<string>('')
  const [useInfo, setUseInfo] = useState<any>()
  const [data, setData] = useState<any>()

  const handleTextCode = (text: string) => {
    setCode(text)
  }

  const handlePre = () => {
    Router.navigateBack()
  }

  const handleConfirm = () => {
    postMemberMobileSecurityCancellation({
      smsCode: encryptedByAES(code),
      cancellationReason: decodeURIComponent(params?.reason),
    }).then((res) => {
      if (res.code === 1000) {
        Router.navigateTo('basicSetting/logOffSuccess')
      }
    })
  }

  const handleSend = () => {
    if (canSend) {
      start()
    }
  }

  useEffect(() => {
    getAsyncStorage(USER_INFO).then((res) => {
      setUseInfo(res)
    })
  }, [])

  useEffect(() => {
    if (useInfo) {
      setData([
        {
          label: intl.formatMessage({ id: 'user.logOff.confirm.label.1', defaultMessage: '当前注销账号' }),
          value: useInfo.account,
          type: 'text',
        },
        {
          label: intl.formatMessage({ id: 'user.logOff.confirm.label.2', defaultMessage: '会员名称' }),
          value: useInfo.userName,
          type: 'text',
        },
        {
          label: intl.formatMessage({ id: 'user.logOff.confirm.label.3', defaultMessage: '绑定手机号' }),
          value: useInfo.phone,
          type: 'text',
        },
        { label: intl.formatMessage({ id: 'user.logOff.confirm.label.4', defaultMessage: '验证码' }) },
      ])
    }
  }, [useInfo])

  return {
    code,
    useInfo,
    data,
    confirmDisable: !code || code.length < 6,
    countdown,
    canSend,
    handleSend,
    handleTextCode,
    handlePre,
    handleConfirm,
  }
}

export default useLogOffConfirm
