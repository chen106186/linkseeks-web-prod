import Manifest from '@/constants/manifest'

/**
 * 默认分享封面 - 通用类型
 */
const DEFAULT_SHARE_COVER = 'https://lingxi-mini.oss-cn-hangzhou.aliyuncs.com/irregular/share-cover.png'
/**
 * 默认分享后用户点击返回小程序的地址 - 通用类型
 */
const DEFAULT_SHARE_PATH = '/pages/splashView/index'

/**
 * 分享给好友
 * @param shareAppMessageObject
 * @param title 标题
 * @param path 分享后用户点击返回小程序的地址
 * @param image 封面地址 传字符串 '' 为截图当前页面, 'default' 为 使用默认配置
 * @returns
 * - (res) => shareAppMessage(res, null, null, '') title & path 不变，不使用默认图片, 小程序机制自动截图
 * - (res) => shareAppMessage(res, '自定义TITLE', null, '')
 * - (res) => shareAppMessage(res, null, '自定义PATH', '')
 * - (res) => shareAppMessage(res, '自定义TITLE', '自定义PATH', 'default') 自定义 title & path, image 使用默认配置
 * - ...
 */
export const shareAppMessage = (
  shareAppMessageObject: any,
  title?: string | null | undefined,
  path?: string | null | undefined,
  image?: string,
) => {
  return {
    title: title ?? Manifest.APP_NAME,
    path: path ?? DEFAULT_SHARE_PATH,
    imageUrl: image === 'default' ? DEFAULT_SHARE_COVER : image ?? DEFAULT_SHARE_COVER,
  }
}
/**
 * 分享到朋友圈
 * @param title 标题
 * @param path 分享后用户点击返回小程序的地址
 * @param image 封面地址 - 传字符串 '' 为截图当前页面, 'default' 为 使用默认配置
 * @returns
 * - shareTimeline(null, null, '') title & path 不变，不使用默认图片, 小程序机制自动截图
 * - shareTimeline('自定义TITLE', null, '')
 * - shareTimeline(null, '自定义PATH', '')
 * - shareTimeline('自定义TITLE', '自定义PATH', 'default') 自定义 title & path, image 使用默认配置
 * - ...
 */
export const shareTimeline = (title?: string | null | undefined, path?: string | null | undefined, image?: string) => {
  return {
    title: title ?? Manifest.APP_NAME,
    path: path ?? DEFAULT_SHARE_PATH,
    imageUrl: image === 'default' ? DEFAULT_SHARE_COVER : image ?? DEFAULT_SHARE_COVER,
  }
}
