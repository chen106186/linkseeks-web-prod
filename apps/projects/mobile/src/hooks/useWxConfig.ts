import { isWeChat } from '@/utils'
import { OFFICIAL_ACCOUNT_APPID, OFFICIAL_ACCOUNT_SECRET, IS_WEB } from '@/constants'
import { getPayWeChatMobileGetSignature } from '@apps/apis'

/**
 * 微信 js-sdk 签名
 * @returns
 */
function useWxConfig() {
  const wxConfig = async (callBack?: Function) => {
    if (IS_WEB) {
      // H5 区分两种情况：微信环境和非微信环境
      if (isWeChat()) {
        // 判断是否为H5微信环境
        /**
         * appId 和 appSecret 作为敏感信息为非必传
         * 项目真实的 appId 和 appSecret 后端会自己去获取
         * 当你想调试微信测试号的时候
         * 可以使用这两个参数传入微信测试号的 appId 和 appSecret来进行调试
         */
        const params: any = {
          appId: OFFICIAL_ACCOUNT_APPID,
          // appSecret: OFFICIAL_ACCOUNT_SECRET,
          url: window.location.href.split('#')[0],
        }
        getPayWeChatMobileGetSignature(params).then(({ code, data }) => {
          if (code === 1000) {
            wx.config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: data.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
              timestamp: data.timestamp, // 必填，生成签名的时间戳
              nonceStr: data.nonceStr, // 必填，生成签名的随机串
              signature: data.signature, // 必填，签名，见附录1
              jsApiList: [
                'onMenuShareQQ',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'updateAppMessageShareData',
                'updateTimelineShareData',
                'chooseWXPay',
                'hideMenuItems',
                'scanQRCode',
              ], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
              openTagList: ['wx-open-launch-weapp'],
            })
          }
        })
      }
    }
  }

  return { wxConfig }
}

export default useWxConfig
