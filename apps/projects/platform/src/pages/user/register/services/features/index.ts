import type { ResponseDataInstance } from '@linkseeks/request'
import { message } from '@linkseeks/ui'
import {
  postMemberRegisterSms,
  postMemberRegister,
  getMemberCaptcha,
  postMemberRegisterPswSms,
  postMemberRegisterPswEmail,
  postMemberRegisterResetEmail,
  postMemberRegisterResetSms,
  postMemberRegisterEmailCheck,
} from '@apps/apis'
import type {
  PostMemberRegisterSmsResponse,
  PostMemberRegisterResponse,
  PostMemberRegisterSmsRequest,
} from '@apps/apis'
import { encryptedByAES } from '@linkseeks/crypto'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

/**
 * 用户注册
 */
export const userRegister = (params: any): Promise<ResponseDataInstance<PostMemberRegisterResponse>> => {
  return new Promise((resovle, reject) => {
    postMemberRegister(params)
      .then((res) => {
        resovle(res)
      })
      .catch(() => {
        reject()
      })
  })
}

/**
 * 发送注册验证码
 */
export const sendRegisterSms = (
  params: PostMemberRegisterSmsRequest,
): Promise<ResponseDataInstance<PostMemberRegisterSmsResponse>> => {
  return new Promise((resovle, reject) => {
    postMemberRegisterSms(params, { penetrateError: true })
      .then((res) => {
        resovle(res)
      })
      .catch(() => {
        reject()
      })
  })
}

/**
 * 找回密码发送注册验证码
 */
export const sendRegisterPwdSms = (
  params: Record<string, any>,
  type: 'phone' | 'email',
): Promise<ResponseDataInstance<PostMemberRegisterSmsResponse>> => {
  return new Promise((resovle, reject) => {
    switch (type) {
      case 'phone':
        postMemberRegisterPswSms(params as any, { penetrateError: true })
          .then((res) => {
            resovle(res)
          })
          .catch(() => {
            reject()
          })
        break
      case 'email':
        postMemberRegisterPswEmail(params as any, { penetrateError: true })
          .then((res) => {
            resovle(res)
          })
          .catch(() => {
            reject()
          })
        break
      default:
        reject()
        break
    }
  })
}

/**
 * 重置密码
 */
export const resetPwd = (type: 'phone' | 'email', params: any): Promise<ResponseDataInstance<any>> => {
  return new Promise((resolve, reject) => {
    if (type === 'phone') {
      postMemberRegisterResetSms(params)
        .then((res) => {
          resolve(res)
        })
        .catch(() => {
          reject()
        })
    } else {
      postMemberRegisterResetEmail(params)
        .then((res) => {
          resolve(res)
        })
        .catch(() => {
          reject()
        })
    }
  })
}

export const checkEmail = (email: string): void | Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const res = await postMemberRegisterEmailCheck({ email: encryptedByAES(email, false) }, { penetrateError: true })
    message.destroy()
    if (res.code !== 1000) {
      reject(new Error(res.message))
    } else {
      resolve(true)
    }
  })
}

/**
 * 获取滑块验证码
 */
export const getSliderCaptcha = getMemberCaptcha
