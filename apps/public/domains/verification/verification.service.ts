import {
  getMemberCaptcha,
  postMemberRegisterSms,
  postMemberRegisterPswSms,
  postMemberRegisterPswEmail,
} from '@apps/apis'
import { crypto } from '@linkseeks/crypto'
import { CAPTCHA_IMAGE_HEIGHT, CAPTCHA_IMAGE_WIDTH, CAPTCHA_SLIDE_SIZE } from './verification.constants'

/**
 * 验证相关
 */
export class VerificationService {
  /**
   * 获取滑块弹窗中的图片
   */
  async getCaptchaImage() {
    const params = {
      width: CAPTCHA_IMAGE_WIDTH.toString(),
      height: CAPTCHA_IMAGE_HEIGHT.toString(),
      size: CAPTCHA_SLIDE_SIZE.toString(),
    }
    const result = await getMemberCaptcha(params)

    const { backImage, imgId, width, height } = result.data
    return {
      img: `data:image/jpeg;base64,${backImage}`,
      imgId: imgId,
      x: Number(crypto.aes.decrypt(width)),
      y: Number(height),
    }
  }

  /**
   * 通过手机号发送验证码
   */
  async getVerificationCodeByPhone(query, mode = 'register') {
    const { countryCode, width, imgId, phone } = query

    let data = {
      countryCode,
      width,
      imgId,
      phone,
    }

    switch (mode) {
      case 'register': {
        const { code } = await postMemberRegisterSms(data)
        return code === 1000
      }

      case 'psd': {
        const { code } = await postMemberRegisterPswSms(data)
        return code === 1000
      }
    }
  }

  /**
   * 通过邮箱发送验证码
   */
  async getVerificationCodeByEmail(query) {
    const { email } = query

    const { code } = await postMemberRegisterPswEmail({ email })

    return code === 1000
  }
}

export default new VerificationService()
