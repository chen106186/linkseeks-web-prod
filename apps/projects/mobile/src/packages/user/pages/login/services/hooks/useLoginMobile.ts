import { useState } from 'react'
import { showToast } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import { encryptedByAES } from '@linkseeks/crypto'
import { postMemberMobileLoginSendSms } from '@apps/apis'
import useLoginForm from './useLoginForm'
import useLogin from './useLogin'
import { useLoginValidate } from './useLoginValidate'
type MobileParamsType = {
  phone: string
  smsCode: string
  telCode: string
  shopType: string
}

const useLoginMobile = (props) => {
  const intl = useIntl()
  const { telCode, Confirm } = props

  const [btnContent, setBtnContent] = useState(
    intl.formatMessage({ id: 'user.huoquyanzhengma', defaultMessage: '获取验证码' }),
  ) // f发送验证码文字
  const [btnDisabled, setBtnDisabled] = useState(false) // 禁止点击发送验证
  const { form, setKey } = useLoginForm<MobileParamsType>({
    phone: '',
    smsCode: '',
    telCode: '',
    shopType: '',
  })

  const { onLogin } = useLogin()

  /* 倒计时 */
  let time = 60
  const handleCountdown = () => {
    if (time > 0 && time <= 60) {
      time -= 1
      setBtnContent(time < 10 ? `0${time}s` : `${time}s`)
      setBtnDisabled(true)
      setTimeout(() => {
        handleCountdown()
      }, 1000)
    } else {
      time = 60
      setBtnDisabled(false)
      setBtnContent(intl.formatMessage({ id: 'user.huoquyanzhengma', defaultMessage: '获取验证码' }))
    }
  }
  // 获取国家代码和手机号码位数
  const getCode = () => {
    const phone = form.phone
    if (!btnDisabled) {
      if (!phone) {
        showToast({
          title: intl.formatMessage({ id: 'user.qingshurushoujihaoma', defaultMessage: '请输入手机号码' }),
          icon: 'none',
        })
      } else {
        const param: any = {
          telCode,
          phone: encryptedByAES(phone),
        }

        postMemberMobileLoginSendSms(param).then((res: any) => {
          if (res.code === 1000) {
            handleCountdown()
            showToast({
              title: intl.formatMessage({ id: 'user.fasongchenggong', defaultMessage: '发送成功' }),
              icon: 'none',
            })
          } else {
            showToast({
              title: intl.formatMessage({ id: `${res.code}`, defaultMessage: res.message }),
              icon: 'none',
            })
          }
        })
      }
    }
  }
  /* 点击手机号码显示弹出 */
  const onCode = () => {
    Confirm(true)
  }
  const login = async () => {
    const param: any = { ...form }
    if (!param.phone || !param.smsCode) {
      showToast({
        title: !param.phone
          ? intl.formatMessage({ id: 'user.qingshurushoujihaoma', defaultMessage: '请输入手机号码' })
          : intl.formatMessage({ id: 'user.qingshuruyanzhengma', defaultMessage: '请输入验证码' }),
        icon: 'none',
      })
      return
    }
    onLogin({ ...param, telCode }, 'mobile')
  }
  return {
    form,
    btnContent,
    btnDisabled,
    setKey,
    getCode,
    onCode,
    login,
  }
}

export default useLoginMobile
