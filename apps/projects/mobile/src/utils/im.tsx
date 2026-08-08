import { USER_INFO } from '@/constants/storage'
import { getAsyncStorage } from '@apps/mobile-services/utils/storage'
import type { objParamsTyoe } from '@neysf/qiyu-web-sdk'
import Router from './router'
import { showToast } from '@apps/mobile-services/utils/taro'
/**
 * 初始化 七鱼客服
 * @param appkey 企业 appkey
 * @param config 配置参数
 * @returns 七鱼sdk初始化成功后的回调函数
 */
export const initYSF = async (appkey: string, config: objParamsTyoe = {}): Promise<any> => {
  if (!appkey) throw new Error('企业 appkey必填')
  try {
    // 导入网易七鱼SDK模块
    const { default: YSF } = await import('@neysf/qiyu-web-sdk')
    const ysfConfig = await YSF.init(appkey, config)
    return ysfConfig
  } catch (error) {
    console.error('Failed to load qiyu-web-sdk:', error)
    return () => {}
  }
}

/**
 * 校验是否能往IM客服那边跳转
 * 有token，并且token合法才能跳
 */
export const validateIMRouter = async (type: 'list' | 'room' = 'list') => {
  const res = await getAsyncStorage(USER_INFO)

  if (res && res.accessToken) {
    // 校验token是否合法
    Router.navigateTo(type === 'list' ? 'im/chatList' : 'im/chatRoom')
  } else {
    showToast({
      title: '当前未登录或登录已过期',
    })
  }
}
