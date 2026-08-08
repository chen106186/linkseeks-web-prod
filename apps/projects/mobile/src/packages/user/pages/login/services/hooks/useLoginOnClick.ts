import { useState } from 'react'
import { showToast } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import { encryptedByAES } from '@linkseeks/crypto'
import useLoginForm from './useLoginForm'
import useLogin from './useLogin'
import { useMobileIntl } from '@apps/locales'

type MobileParamsType = {
  account: string
  password: string
  shopType: string
}

const oneClickLogin = (agree) => {
  const translate = useMobileIntl()
  const { clickLogin } = useLogin()
  /* 请求登录 */
  const oneClickLogin = async (e) => {
    if (e.detail.code) {
      wx.login({
        success: (res) => {
          if (res.code) {
            // debugger
            console.log('res.code', res.code)
            clickLogin({ phoneCode: e.detail.code, loginCode: res.code })
          } else {
            console.log('登录失败', res.errMsg)
          }
        },
      })
    }
    // if (!loginFlag) {
    // setLoginFlag(true)
    // if (!agree) {
    //   showToast({
    //     title: translate('mobile.resource.user.qingyueduxieyi'),
    //     icon: 'none',
    //   })
    //   // setLoginFlag(false)
    //   return
    // }
    // debugger
    // onLogin({ ...form, password: encryptedByAES(form.password) }, 'account').finally(() => {
    //   setLoginFlag(false)
    // })
    // }
  }
  const tips = () => {
    showToast({
      title: translate('mobile.resource.user.qingyueduxieyi'),
      icon: 'none',
    })
  }
  return {
    oneClickLogin,
    tips,
  }
}

export default oneClickLogin
