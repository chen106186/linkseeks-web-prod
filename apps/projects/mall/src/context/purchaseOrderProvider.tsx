import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import {
  GetProductShopPurchaseGetPurchaseListResponse,
  getProductShopPurchaseGetPurchaseList,
  postOrderCacheSet,
  postProductShopPurchaseDeletePurchase,
} from '@apps/apis'
import { MallInfoType, UserInfoType } from '@/types/global'

export interface PurchaseOrderState {
  purchaseList: GetProductShopPurchaseGetPurchaseListResponse
  purchaseCount: number
  purchaseLoading: boolean
  countModifyState: React.MutableRefObject<boolean>
  purchaseDelete: (ids: number[], mallId?: number) => Promise<boolean>
  updatePurchaseList: (mallId?: number) => void
  cacheOrderInfo: (key: string, value: any) => Promise<boolean>
}

export const PurchaseOrderContext = createContext<PurchaseOrderState | undefined>(undefined)

/** 获取购物车数据 */
export const useInitPurcaseOrder = (mallInfo: MallInfoType | undefined, userInfo: UserInfoType | undefined) => {
  const [purchaseLoading, setPurchaseLoading] = useState<boolean>(true)
  const [purchaseList, setPurchaseList] = useState<GetProductShopPurchaseGetPurchaseListResponse>([])
  const [purchaseCount, setPurchaseCount] = useState<number>(0)
  const countModifyState = useRef<boolean>(true)

  /** 获取购物车列表数据 */
  const getPurchaseList = (mallId: number): Promise<GetProductShopPurchaseGetPurchaseListResponse> => {
    return new Promise((resolve) => {
      setPurchaseLoading(true)
      getProductShopPurchaseGetPurchaseList(
        {},
        {
          headers: {
            shopId: mallId,
          },
        },
      )
        .then((res) => {
          if (res.code === 1000 && res.data && res.data.length > 0) {
            const sortList = res.data.sort((a) => (a.isMain ? -1 : 1))
            resolve(sortList)
          } else {
            resolve([])
          }
        })
        .catch(() => {
          resolve([])
        })
        .finally(() => {
          setPurchaseLoading(false)
        })
    })
  }

  const init = async (mallId?: number) => {
    if (mallId) {
      const list = await getPurchaseList(mallId)
      setPurchaseList(list)
      setPurchaseCount(list.length)
    }
  }

  useEffect(() => {
    if (userInfo && mallInfo && mallInfo.type === 1) {
      init(mallInfo.id)
    } else {
      setPurchaseLoading(false)
    }
  }, [userInfo])

  /**
   * 购物车删除
   * @param ids 购物车id数组
   */
  const purchaseDelete = (ids: number[], mallId?: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      postProductShopPurchaseDeletePurchase({ idList: ids })
        .then((res) => {
          if (res.code === 1000) {
            mallId && init(mallId)
            resolve(true)
          } else {
            reject()
          }
        })
        .catch(() => {
          reject()
        })
    })
  }

  const cacheOrderInfo = (key: string, value: any): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      postOrderCacheSet({ key, value: JSON.stringify(value) }, { ctlType: 'none' })
        .then((res) => {
          if (res.code === 1000) {
            resolve(true)
          } else {
            reject()
          }
        })
        .catch(() => {
          reject()
        })
    })
  }

  return {
    purchaseList,
    purchaseCount,
    purchaseLoading,
    countModifyState,
    purchaseDelete,
    updatePurchaseList: init,
    cacheOrderInfo,
  }
}

export const usePurchaseOrderContext = () => {
  const context = useContext(PurchaseOrderContext)
  if (!context) {
    throw new Error('usePurchaseOrderContext must be used within a PurchaseOrderProvider')
  }
  return context
}

export const PurchaseOrderProvider = ({
  children,
  value,
}: {
  children: React.ReactNode
  value: PurchaseOrderState
}) => {
  return <PurchaseOrderContext.Provider value={value}>{children}</PurchaseOrderContext.Provider>
}
