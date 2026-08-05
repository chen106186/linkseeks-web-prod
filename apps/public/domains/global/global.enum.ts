export enum TERMINAL_ENUMS {
  /**
   * pc端的应用
   * 例如能力中心，平台后台，paas平台，pc商城，IM
   */
  PC = 1,

  /**
   * 移动WEB端
   * 例如H5商城
   */
  H5,

  /**
   * 微信小程序
   */
  WX_MINI,

  /**
   * 安卓APP
   */
  ANDROID_APP,

  /**
   * IOS APP
   */
  IOS_APP,
}

/**
 * 业务类型的平台来源
 */
export enum BUSINESS_SOURCE_ENUMS {
  /**
   * 能力中心
   */
  PLATFORM_CENTER = '1',

  /**
   * 平台后台
   */
  ADMIN = '99',

  /**
   * APP
   */
  APP = '2',
}
