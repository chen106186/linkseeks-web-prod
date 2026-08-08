import {
  PostMemberRegisterSmsRequest,
  PostMemberRegisterSmsResponse,
  getMemberCaptcha,
  postMemberRegisterSms,
  postMemberManageSecurityPhoneSms,
  postMemberManageSecurityEmailSms,
  postMemberManageSecurityForgetPswUpdate,
  postMemberManageSecurityForgetPswManagerUpdate,
} from '@apps/apis'
import { message } from '@linkseeks/ui'
import { encryptedByAES } from '@linkseeks/crypto'
import { ResponseDataInstance } from '@linkseeks/request'
import { Dispatch, SetStateAction } from 'react'

/**
 * 发送注册验证码
 */
export const sendRegisterSms = (
  params: PostMemberRegisterSmsRequest,
): Promise<ResponseDataInstance<PostMemberRegisterSmsResponse>> => {
  return new Promise((resovle, reject) => {
    postMemberRegisterSms(params)
      .then((res) => {
        resovle(res)
      })
      .catch(() => {
        reject()
      })
  })
}

/**
 * 忘记密码-发送验证码
 */
export const sendForgetSms = (type: 'phone' | 'email', params: any): Promise<ResponseDataInstance<any>> => {
  return new Promise((resovle, reject) => {
    const SMS_API = {
      phone: postMemberManageSecurityPhoneSms,
      email: postMemberManageSecurityEmailSms,
    }
    SMS_API[type](params)
      .then((res) => {
        resovle(res)
      })
      .catch(() => {
        reject()
      })
  })
}

export const submitForgetForm = (
  values: Record<string, any>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  isManage: boolean,
): Promise<ResponseDataInstance<any>> => {
  return new Promise((resovle, reject) => {
    let submitApi: any = postMemberManageSecurityForgetPswUpdate
    if (isManage) {
      submitApi = postMemberManageSecurityForgetPswManagerUpdate
    }
    const phone = values.phone ? encryptedByAES(values.phone) : ''
    const email = values.email ? encryptedByAES(values.email, false) : ''
    const phoneSmsCode = isManage
      ? encryptedByAES(values.smsCode)
      : values.phoneSmsCode
      ? encryptedByAES(values.phoneSmsCode)
      : ''
    const emailSmsCode = isManage
      ? encryptedByAES(values.smsCode)
      : values.emailSmsCode
      ? encryptedByAES(values.emailSmsCode)
      : ''

    const params = {
      phone,
      email,
      phoneSmsCode,
      emailSmsCode,
      newPassword: encryptedByAES(values.newPassword, false),
    }

    setLoading(true)
    submitApi(params, { penetrateError: true })
      .then((res) => {
        message.destroy()
        setLoading(false)
        resovle(res)
      })
      .catch(() => {
        setLoading(false)
        reject()
      })
  })
}

/**
 * 获取滑块验证码
 */
export const getSliderCaptcha = getMemberCaptcha
