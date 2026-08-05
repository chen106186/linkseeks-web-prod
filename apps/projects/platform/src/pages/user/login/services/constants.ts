export enum LOGIN_CHECK_TYPE {
  /**
   * 密码登陆(不分端)
   */
  PASSWORD = 1,
  /**
   * pc-手机验证码登陆
   */
  PC_PHONE,
  /**
   * pc-邮箱验证码登陆
   */
  PC_EMAIL,
  /**
   * 移动端-手机验证码登陆
   */
  MOBILE_PHONE,
  /**
   * 移动端-邮箱验证码登陆
   */
  MOBILE_EMAIL,
  /**
   * 扫码登陆
   */
  SCANCODE,
}
