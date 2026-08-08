import {
  getAftersalesRepairGoodsPageByConsumer,
  getAftersalesRepairGoodsPageByPlatform,
  getAftersalesRepairGoodsPageBySupplier,
  getAftersalesReplaceGoodsPageByConsumer,
  getAftersalesReplaceGoodsPageByPlatform,
  getAftersalesReplaceGoodsPageBySupplier,
  getAftersalesReturnGoodsPageByConsumer,
  getAftersalesReturnGoodsPageByPlatform,
  getAftersalesReturnGoodsPageBySupplier,
  getOrderBuyerPage,
  getOrderPlatformManagePage,
  getOrderVendorPage,
  postProductCommodityCommonGetCommodityList,
} from '@apps/apis'
import { useMemo } from 'react'
import { useRole } from '../useRole'

export const useApi = (afterType) => {
  const { isAdmin, isConsumer, isSupplier, memberId: selfMemberId } = useRole()
  const orderApi = useMemo(() => {
    if (isAdmin) {
      return getOrderPlatformManagePage
    }

    if (isConsumer) {
      return getOrderBuyerPage
    }

    if (isSupplier) {
      return getOrderVendorPage
    }
  }, [isAdmin, isConsumer, isSupplier])

  const commodityApi = useMemo(() => {
    if (isAdmin) {
      return postProductCommodityCommonGetCommodityList
    }
    if (isConsumer) {
      return postProductCommodityCommonGetCommodityList
    }

    if (isSupplier) {
      return postProductCommodityCommonGetCommodityList
    }
  }, [isAdmin, isConsumer, isSupplier])
  const afterApi = useMemo(() => {
    const afterIndex = afterType[0]
    if (isAdmin) {
      // 如果会话方为平台客服：数据从平台后台--售后管理中各申请单的详情数据
      const api = {
        1: getAftersalesReplaceGoodsPageByPlatform,
        2: getAftersalesReturnGoodsPageByPlatform,
        3: getAftersalesRepairGoodsPageByPlatform,
      }
      return api[afterIndex]
    }
    if (isConsumer) {
      // 服务消费者
      const api = {
        1: getAftersalesReplaceGoodsPageByConsumer,
        2: getAftersalesReturnGoodsPageByConsumer,
        3: getAftersalesReplaceGoodsPageByConsumer,
      }
      return api[afterIndex]
    } else if (isSupplier) {
      const api = {
        1: getAftersalesReplaceGoodsPageBySupplier,
        2: getAftersalesReturnGoodsPageBySupplier,
        3: getAftersalesRepairGoodsPageBySupplier,
      }
      return api[afterIndex]
    }
  }, [afterType, isConsumer, isSupplier, isAdmin])

  return {
    orderApi,
    commodityApi,
    afterApi,
  }
}
