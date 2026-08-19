import request from '../request'

interface BatchRefundRequest {
  rechargeId: number[]
  remark?: string
}

interface RechargeMemberSummary {
  memberId?: number
  memberName?: string
  amountCount: number
  repayAmountCount: number
  balanceCount: number
}

export const postPayEAccountAllInPayProxyRechargeBatchRefund = async (params?: BatchRefundRequest, config?: any) =>
  request<boolean>('/pay/eAccount/allInPay/proxy/recharge/batch/refund', {
    data: params,
    method: 'POST',
    ctlType: 'message',
    ...config,
  })

export const getPayEAccountAllInPayProxyRechargeCountMemberGet = async (config?: any) =>
  request<RechargeMemberSummary>('/pay/eAccount/allInPay/proxy/recharge/count/member/get', {
    method: 'GET',
    ctlType: 'none',
    ...config,
  })

export const getPayEAccountAllInPayProxyRechargeMemberPage = async (params?: Record<string, any>, config?: any) =>
  request('/pay/eAccount/allInPay/proxy/recharge/member/page', {
    params,
    method: 'GET',
    ctlType: 'none',
    ...config,
  })
