import { getEnv } from '@apps/mobile-services/utils/taro'

export default (() => {
  const APP_SETTING_CONFIG: { [key in TaroGeneral.ENV_TYPE]?: any } = {
    WEAPP: {
      APP_NAME: '云链认养鲜',
      SLOGEN: 'SLOGEN',
      BACK_GATEWAY: process.env.BACK_GATEWAY,
      CLKLOG_API: 'http://10.0.1.212/receiver/api/gp?project=pc&token=5388ed7459ba4c4cad0c8693fb85630a',
    },
    WEB: {
      APP_NAME: '云链认养鲜',
      SLOGEN: 'SLOGEN',
      BACK_GATEWAY: '/api',
      CLKLOG_API: 'http://10.0.1.212/receiver/api/gp?project=h5&token=5388ed7459ba4c4cad0c8693fb85630a',
    },
  }

  return APP_SETTING_CONFIG[getEnv()]
})()
