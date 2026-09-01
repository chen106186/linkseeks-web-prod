import { requestPayment } from '@apps/mobile-services/utils/taro'

type WechatParamsType = {
  appid?: string
  noncestr: string
  partnerid: string
  timestamp: string
  prepayid: string
  sign: string
  signType?: 'MD5' | 'RSA' | 'HMAC-SHA256'
}

function useWechatPay() {
  const wxPay = async (params: WechatParamsType, callBack: Function) => {
    const { prepayid, sign, timestamp, noncestr, signType } = params

    // 根据签名长度自动判定：V3 RSA 签名 Base64 约 344 字符；V2 MD5 是 32 位 hex
    const finalSignType = signType || (sign && sign.length > 64 ? 'RSA' : 'MD5')

    const payParams = {
      timeStamp: timestamp,
      nonceStr: noncestr,
      package: `prepay_id=${prepayid}`,
      signType: finalSignType,
      paySign: sign,
    }
    console.log('========== requestPayment params ==========', JSON.stringify(payParams))

    requestPayment({
      ...payParams,
      success: function (res) {
        console.log('========== requestPayment SUCCESS ==========', res)
        callBack(res)
      },
      fail: function (err) {
        console.error('========== requestPayment FAIL ==========')
        console.error('errMsg =', err?.errMsg)
        console.error('errCode =', err?.errCode)
        console.error('raw =', JSON.stringify(err))
      },
    })
  }

  return { wxPay }
}

export default useWechatPay
