import { useEffect, useState } from 'react'
import {
  getProductCustomerPurchaseGetPurchaseCount,
  postProductCustomerPurchaseSaveOrUpdatePurchase,
  getProductCustomerPurchaseGetPurchaseList,
  postProductCustomerPurchaseDeletePurchase,
} from '@apps/apis'
import { message } from 'antd'
import { useIntl } from '@linkseeks/i18n'
/*
 * @Author: GHua
 * @Date: 2022-04-02 10:05:25
 * @LastEditTime: 2022-04-13 17:26:16
 * @LastEditors: Please set LastEditors
 * @Description:
 */
interface UsePurchaseOrderProps {
  orderId?: number
  /** 客户会员id */
  customerMemberId: number
  /** 客户会员角色id */
  customerMemberRoleId: number
  /** 客户会员等级 */
  customerMemberLevel: number
  /** 商城id */
  mallId: number
}

interface SaveOrUpdatePurchaseParam {
  skuId: number
  showMsg?: boolean
  purchaseId?: number
  count?: number
}

interface UsePurchaseOrderReturn {
  purchaseCount: number
  purchaseList: any[]
  saveOrUpdatePurchase: (param: SaveOrUpdatePurchaseParam) => Promise<boolean>
  getPurchaseList: () => void
  deletePurchase: (idList: number[]) => Promise<boolean>
  /** 更新加入购物车数量 */
  fetchPurchaseCount: () => Promise<void>
}

const usePurchaseOrder = (props: UsePurchaseOrderProps): UsePurchaseOrderReturn => {
  const { customerMemberId, customerMemberRoleId, mallId, orderId } = props
  const [purchaseCount, setPurchaseCount] = useState<number>(0)
  const [purchaseList, setPurchaseList] = useState<any[]>([])
  const intl = useIntl()
  const fetchPurchaseCount = async () => {
    if (customerMemberId && customerMemberRoleId) {
      const params: any = {
        customerMemberId,
        customerMemberRoleId,
      }

      if (orderId) {
        params.orderId = orderId
      }

      try {
        const res = await getProductCustomerPurchaseGetPurchaseCount(params, { headers: { shopId: String(mallId) } })
        if (res.code === 1000) {
          setPurchaseCount(res.data)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  useEffect(() => {
    fetchPurchaseCount()
  }, [])

  /**
   * 新增修改购物车
   */
  const saveOrUpdatePurchase = async ({
    skuId,
    showMsg = true,
    purchaseId,
    count = 1,
  }: SaveOrUpdatePurchaseParam): Promise<boolean> => {
    const param: any = {
      commoditySkuId: skuId,
      count,
      customerMemberId,
      customerMemberRoleId,
    }
    if (purchaseId) {
      param.id = purchaseId
    }

    if (orderId) {
      param.orderId = orderId
    }

    try {
      const res = await postProductCustomerPurchaseSaveOrUpdatePurchase(param, { headers: { shopId: String(mallId) } })
      if (res.code === 1000) {
        message.destroy()
        fetchPurchaseCount()
        if (showMsg) {
          message.success(intl.formatMessage({ id: 'commodityDetail.index.addedPurchase' }))
        }
        return true
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  }

  const getPurchaseList = async () => {
    const params: any = {
      customerMemberId,
      customerMemberRoleId,
    }

    if (orderId) {
      params.orderId = orderId
    }

    try {
      const res = await getProductCustomerPurchaseGetPurchaseList(params, { headers: { shopId: String(mallId) } })
      if (res.code === 1000) {
        setPurchaseList(res.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const deletePurchase = async (idList: number[]): Promise<boolean> => {
    const params = {
      idList,
    }

    try {
      const res = await postProductCustomerPurchaseDeletePurchase(params, { headers: { shopId: String(mallId) } })
      if (res.code === 1000) {
        getPurchaseList()
        return true
      }
      return false
    } catch (error) {
      console.log(error)
      return false
    }
  }

  return {
    purchaseCount,
    purchaseList,
    saveOrUpdatePurchase,
    getPurchaseList,
    deletePurchase,
    fetchPurchaseCount,
  }
}

export default usePurchaseOrder
