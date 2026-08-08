import type { objParamsTyoe } from '@neysf/qiyu-web-sdk'
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
