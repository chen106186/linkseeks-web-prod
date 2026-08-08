import {
  postMemberRegisterPswEmailCheck,
  postMemberRegisterPswSmsCheck,
  postMemberRegisterResetEmail,
  postMemberRegisterResetSms,
} from '@apps/apis'
import { encryptedByAES } from '@linkseeks/crypto'

export type DISPATCH_PWD_TYPE = 'phone' | 'email'

export class ResetPasswordClass {
  values: any
  type: DISPATCH_PWD_TYPE
  constructor(values: any, type: DISPATCH_PWD_TYPE) {
    this.values = values
    this.type = type
  }

  encryptedParams(v) {
    const values = { ...v }
    if (values.password) {
      values.password = encryptedByAES(values.password)
    }

    if (values.smsCode) {
      values.smsCode = encryptedByAES(values.smsCode)
    }

    if (values.phone) {
      values.phone = encryptedByAES(values.phone)
    }

    if (values.email) {
      values.email = encryptedByAES(values.email, false)
    }
    return values
  }

  /**
   * 验证校验
   */
  async dispatchCheck(values) {
    if (this.type === 'phone') {
      return this.dispatchSmsCheck(values)
    } else {
      return this.dispatchEmailCheck(values)
    }
  }

  async dispatchSmsCheck(values) {
    const { telCode, phone, smsCode } = values
    const result = await postMemberRegisterPswSmsCheck({ telCode, phone, smsCode }, { ctlType: 'none' })

    return result
  }

  async dispatchEmailCheck(values) {
    const { email, smsCode } = values
    const result = await postMemberRegisterPswEmailCheck({ email, smsCode }, { ctlType: 'none' })

    return result
  }

  /**
   * 提交重置
   */
  async submitResetPwd(values, type: DISPATCH_PWD_TYPE) {
    if (type === 'phone') {
      return await postMemberRegisterResetSms(values, { ctlType: 'none' })
    } else {
      return await postMemberRegisterResetEmail(values, { ctlType: 'none' })
    }
  }
}
