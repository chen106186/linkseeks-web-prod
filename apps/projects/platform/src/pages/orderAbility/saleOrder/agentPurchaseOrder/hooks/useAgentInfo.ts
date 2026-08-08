import { useEffect, useReducer, useState } from 'react'
import { message } from 'antd'
import { AgentPurchaseOrderInfoType } from '../types'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { getCommodityWebShopWebAll } from '@apps/apis'
import { getOrderVendorDetail, GetOrderVendorDetailResponse } from '@apps/apis'
import { postProductCustomerPurchaseSavePurchaseBatch } from '@apps/apis'
import { getMemberAbilityLevelPlatformGet } from '@apps/apis'
import { authService } from '@apps/services'
import useMemberShop from '@/hooks/useMemberShop'
/*
 * @Author: GHua
 * @Date: 2022-03-30 17:27:01
 * @LastEditTime: 2022-04-12 16:27:17
 * @LastEditors: GHua
 * @Description:
 */

interface OrderParam {
  orderId: number
  buyerMemberId: number
  buyerMemberName: string
  buyerRoleId: number
  shopId: number
}

interface UseAgentInfoRes {
  agentPurchaseOrderInfo: AgentPurchaseOrderInfoType
  dispatch: React.Dispatch<any>
  dispatchByOrder: (orderInfo: OrderParam) => Promise<boolean>
  fetchStoreId: () => Promise<number | undefined>
}

export const AGENT_ORDER_KEY = 'LINKSEEK_AGENT_ORDER'

interface UseAgentInfoProps {
  /** 是否校验选择的商城信息存在 */
  check?: boolean
}

interface StateType {
  agentOrderInfo: AgentPurchaseOrderInfoType | undefined
}

const useAgentInfo = (props?: UseAgentInfoProps): UseAgentInfoRes => {
  const { check = false } = props || {}
  const { getMemberShopInfo } = useMemberShop()
  const intl = useIntl()

  const getInitState = () => {
    const sessionInfo = sessionStorage.getItem(AGENT_ORDER_KEY)
    return sessionInfo ? JSON.parse(sessionInfo) : undefined
  }

  const initialState: StateType = {
    agentOrderInfo: getInitState(),
  }

  const agentOrderReducer = (
    state: StateType,
    action: { type: string; payload: AgentPurchaseOrderInfoType | undefined },
  ) => {
    switch (action.type) {
      case 'update':
        sessionStorage.setItem(AGENT_ORDER_KEY, JSON.stringify(action.payload))
        return {
          ...state,
          agentOrderInfo: action.payload,
        }
      default:
        throw new Error()
    }
  }

  const [state, dispatch] = useReducer<
    (state: StateType, action: { type: string; payload: AgentPurchaseOrderInfoType }) => StateType
  >(agentOrderReducer, initialState)
  const userInfo = authService.getAuth()

  /**
   * 获取当前登录用户的店铺Id
   */
  const fetchStoreId = async (): Promise<number | undefined> => {
    const data = await getMemberShopInfo()
    if (data) {
      return data.id
    }
    return undefined
  }

  useEffect(() => {
    if (!state.agentOrderInfo) {
      if (check) {
        history.redirect('/orderAbility/saleOrder/agentPurchaseOrder')
      }
    }
  }, [])

  const fetchShopWebAllByShopId = async (shopId: number) => {
    const params = {
      environment: 1,
      isMemberType: true,
      memberId: userInfo.memberId,
      roleId: userInfo.memberRoleId,
    }

    const res = await getCommodityWebShopWebAll(params)
    if (res.code === 1000 && res.data && res.data.length > 0) {
      message.destroy()
      const filterItem = res.data.filter((item) => item.id === shopId)[0]
      return filterItem
    }
    return undefined
  }

  const formatParam = (orderDetail: GetOrderVendorDetailResponse, memberId: number, roleId: number) => {
    const purchaseBatchList = []
    if (orderDetail.product.products && orderDetail.product.products.length > 0) {
      orderDetail.product.products.forEach((item) => {
        purchaseBatchList.push({
          commoditySkuId: item.skuId,
          count: item.quantity,
          orderId: orderDetail.orderId,
          customerMemberId: memberId,
          customerMemberRoleId: roleId,
        })
      })
    }
    return purchaseBatchList
  }

  const getMemberLevel = async (memberId: string, roleId: string): Promise<number> => {
    const params = {
      memberId,
      roleId,
    }
    const res = await getMemberAbilityLevelPlatformGet(params)
    message.destroy()
    if (res.code === 1000 && res.data) {
      return res.data.level
    }
    return 1
  }

  const dispatchByOrder = async (orderInfo: OrderParam) => {
    const res = await getOrderVendorDetail({ orderId: String(orderInfo.orderId) })
    if (res.code === 1000) {
      const shopInfo = await fetchShopWebAllByShopId(orderInfo.shopId)
      if (shopInfo) {
        // 不过企业商城，且不是自营则获取店铺id
        let storeId: number | undefined = undefined
        if (shopInfo.type === 1 && !shopInfo.isSelf) {
          storeId = await fetchStoreId()
          if (!storeId) {
            message.error(intl.formatMessage({ id: 'shop.template.create.tip' }))
            return
          }
        }

        const batchParams = formatParam(res.data, orderInfo.buyerMemberId, orderInfo.buyerRoleId)
        const batchRes = await postProductCustomerPurchaseSavePurchaseBatch(
          {
            purchaseBatchList: batchParams,
          },
          { headers: { shopId: String(orderInfo.shopId) } },
        )
        message.destroy()
        const memberLevel = await getMemberLevel(String(orderInfo.buyerMemberId), String(orderInfo.buyerRoleId))

        if (batchRes.code === 1000) {
          dispatch({
            type: 'update',
            payload: {
              shopId: shopInfo?.id,
              shopName: shopInfo.name,
              type: shopInfo.type,
              isChannel: shopInfo.type === 3 || shopInfo.type === 4,
              environment: shopInfo.environment,
              property: shopInfo.property,
              isSelf: shopInfo.isSelf,
              isMemberOperate: shopInfo.isMemberOperate,
              logoUrl: shopInfo.logoUrl,
              memberId: orderInfo.buyerMemberId,
              memberName: orderInfo.buyerMemberName,
              roleId: orderInfo.buyerRoleId,
              orderId: orderInfo.orderId,
              memberLevel,
              storeId,
            },
          })

          history.push(`/orderAbility/saleOrder/agentPurchaseOrder/purchaseOrder?orderId=${orderInfo.orderId}`)
          return true
        }
      } else {
        message.error(intl.formatMessage({ id: 'agentOrder.mall.isNotExist', defaultMessage: '商城不存在' }))
      }
    }
    return false
  }

  return {
    agentPurchaseOrderInfo: state.agentOrderInfo,
    dispatch,
    dispatchByOrder,
    fetchStoreId,
  }
}

export default useAgentInfo
