/**
 * 微信小程序一键登录（手工维护，yapi 无对应导出）
 * 后端接口：POST /member/mobile/weixin-mini-app-login
 * DTO：MobileWeixinLoginReq { phoneCode, loginCode, inviterAccount? }
 */
// @ts-ignore
import request, { IApiRequest } from '../request'

export interface PostMemberMobileWeixinMiniAppLoginRequest {
  /** 微信 wx.getPhoneNumber 返回的加密 code */
  phoneCode: string
  /** 微信 wx.login 返回的 js code，用于换取 openid */
  loginCode: string
  /** 商城类型，1-企业商城 */
  shopType?: number
  /** 多主体指定用户 id（需要加密） */
  userId?: string | number
  /** 邀请人会员账号（分销） */
  inviterAccount?: string
}

export interface PostMemberMobileWeixinMiniAppLoginResponse {
  memberId: number
  memberRoleId: number
  userId: number
  accessToken: string
  refreshToken: string
  logo?: string
  name?: string
  phone?: string
  updatePwdIntervalDays?: number
  [key: string]: any
}

export const postMemberMobileWeixinMiniAppLogin = async (
  params?: PostMemberMobileWeixinMiniAppLoginRequest,
  config?: IApiRequest,
) => {
  return request<PostMemberMobileWeixinMiniAppLoginResponse>('/member/mobile/weixin-mini-app-login', {
    data: params,
    method: 'POST',
    ...config,
  })
}
