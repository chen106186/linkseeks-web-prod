import {
  PostOrderCreatePaymentFindRequest,
  PostOrderCreatePaymentFindResponse,
  postOrderCreatePaymentFind,
} from '@apps/apis'
import { getWebIntl } from '@/utils/locales'
import { useState } from 'react'

const usePayway = () => {
  const [paymentError, setPaymentError] = useState<string>()
  const [payWayInfo, setPayWayInfo] = useState<PostOrderCreatePaymentFindResponse>()
  const translate = getWebIntl()

  const pointPayWay = {
    required: true,
    firstPayRate: 1,
    payTypes: [
      {
        fundMode: 1,
        payType: 10,
        payTypeName: translate('web.resource.mall.jifenzhifu'),
        payChannels: [
          {
            payChannel: 10,
            payChannelName: translate('web.resource.mall.jifenzhifu'),
          },
        ],
      },
    ],
    payNodes: [],
    hasContract: false,
    contractId: 0,
  }

  /**
   * 对支付方式进行排序
   * @param info 支付信息
   * @returns  支付信息
   */
  const sortPayWayInfo = (info: PostOrderCreatePaymentFindResponse) => {
    if (info && info?.payTypes && info?.payTypes.length > 0) {
      const newPayWayInfo: PostOrderCreatePaymentFindResponse = { ...info }
      const newPayTypes = info.payTypes.sort((a, b) => (b.payType === 6 || b.payType === 1 ? 1 : -1))
      newPayWayInfo.payTypes = newPayTypes
      return newPayWayInfo
    }
    return info
  }

  /**
   * 获取支付方式
   * @param memberId
   */
  const getPayWayListByMemberId = (params: PostOrderCreatePaymentFindRequest) => {
    postOrderCreatePaymentFind(params, { ctlType: 'none' }).then((res) => {
      if (res.code === 1000) {
        setPayWayInfo(sortPayWayInfo(res.data))
        setPaymentError(undefined)
      } else {
        setPaymentError(res.message)
      }
    })
  }

  return {
    pointPayWay,
    payWayInfo,
    paymentError,
    getPayWayListByMemberId,
  }
}

export default usePayway
