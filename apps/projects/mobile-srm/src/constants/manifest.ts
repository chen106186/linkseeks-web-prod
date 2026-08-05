import { getEnv } from '@apps/mobile-services/utils/taro'

export default (() => {
  const APP_SETTING_CONFIG: { [key in TaroGeneral.ENV_TYPE]?: any } = {
    WEAPP: {
      APP_NAME: '瓴犀SRM小程序',
      SLOGEN: 'SLOGEN',
      BACK_GATEWAY: process.env.BACK_GATEWAY,
    },
    WEB: {
      APP_NAME: '瓴犀SRM小程序',
      SLOGEN: 'SLOGEN',
      BACK_GATEWAY: '/api',
    },
  }

  return APP_SETTING_CONFIG[getEnv()]
})()
