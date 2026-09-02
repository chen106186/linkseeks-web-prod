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
    // 用户拒绝授权手机号 / errMsg 未包含 ok
    if (!e?.detail?.code) {
      const errMsg = e?.detail?.errMsg || ''
      console.error('getPhoneNumber 失败', errMsg, e)
      showToast({
        title:
          errMsg && !errMsg.includes('ok') && !errMsg.includes('deny')
            ? errMsg
            : translate('mobile.login.phone-auth-required') || '请先授权手机号',
        icon: 'none',
      })
      return
    }

    wx.login({
      success: (res) => {
        if (res.code) {
          console.log('wx.login code:', res.code)
          clickLogin({ phoneCode: e.detail.code, loginCode: res.code }).catch((err) => {
            console.error('一键登录失败', err)
            showToast({
              title: err?.message || translate('mobile.login.fail') || '登录失败，请重试',
              icon: 'none',
            })
          })
        } else {
          console.error('wx.login 失败', res.errMsg)
          showToast({
            title: res.errMsg || 'wx.login 失败',
            icon: 'none',
          })
        }
      },
      fail: (err) => {
        console.error('wx.login 调用异常', err)
        showToast({
          title: err?.errMsg || 'wx.login 调用失败',
          icon: 'none',
        })
      },
    })
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
