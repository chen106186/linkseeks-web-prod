import { requestPayment } from '@apps/mobile-services/utils/taro'

type WechatParamsType = {
  appid?: string
  noncestr: string
  partnerid: string
  timestamp: string
  prepayid: string
  sign: string
}

function useWechatPay() {
  const wxPay = async (params: WechatParamsType, callBack: Function) => {
    const { partnerid, prepayid, sign, timestamp, noncestr } = params

    console.log({
      timeStamp: timestamp,
      nonceStr: noncestr,
      package: `prepay_id=${prepayid}`,
      signType: 'MD5',
      paySign: sign,
    })
    requestPayment({
      // partnerId: partnerid,
      timeStamp: timestamp,
      nonceStr: noncestr,
      package: `prepay_id=${prepayid}`,
      signType: 'MD5',
      paySign: sign,
      success: function (res) {
        console.log(res, 'res')
        callBack(res)
      },
      fail: function (err) {
        console.log('🚀 ~ file: useWechatPay.ts ~ line 27 ~ wxPay ~ err', err)
      },
    })
  }

  return { wxPay }
}

export default useWechatPay
