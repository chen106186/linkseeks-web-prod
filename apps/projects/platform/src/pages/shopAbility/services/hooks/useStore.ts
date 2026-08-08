import { useEffect, useState, useRef } from 'react'
import {
  getCommodityWebStoreWebStoreDetail,
  getCommodityShopShopStoreList,
  postCommodityAdornManageSave,
  postCommodityWebStoreWebUpdateStatus,
} from '@apps/apis'
import type { GetCommodityWebStoreWebStoreDetailResponse } from '@apps/apis'
import { message } from '@linkseeks/ui'
import { StoreShopItemType } from '../types'

interface UseStoreReturn {
  storeDetail: GetCommodityWebStoreWebStoreDetailResponse | undefined
  getStoreDetail: (storeId: number) => Promise<GetCommodityWebStoreWebStoreDetailResponse>
  getStoreShopList: (storeId: string) => Promise<StoreShopItemType[]>
  createShopAdorn: (shopId: number, storeId: number) => Promise<number | undefined>
  changeStoreState: (id: number, status: number) => void
}

interface UseStoreProps {
  /** 店铺id */
  id?: number
  refreshFn?: () => void
}

const useStore = (props?: UseStoreProps): UseStoreReturn => {
  const [storeDetail, setStoreDetail] = useState<GetCommodityWebStoreWebStoreDetailResponse>()
  const switchState = useRef<boolean>(true)

  /**
   * 获取店铺所在的商城数据
   */
  const getStoreShopList = (storeId: string): Promise<StoreShopItemType[]> => {
    return new Promise((resolve) => {
      getCommodityShopShopStoreList({ storeId })
        .then((res) => {
          if (res.code === 1000 && res.data) {
            resolve(res.data as StoreShopItemType[])
          } else {
            resolve([])
          }
        })
        .catch(() => {
          resolve([])
        })
    })
  }

  const getStoreDetail = (storeId: number): Promise<GetCommodityWebStoreWebStoreDetailResponse> => {
    return new Promise((resolve, reject) => {
      const param = {
        id: `${storeId}`,
      }
      getCommodityWebStoreWebStoreDetail(param)
        .then((res) => {
          if (res.code === 1000 && res.data) {
            if (props?.id) {
              setStoreDetail(res.data)
            }
            resolve(res.data)
          } else {
            reject()
          }
        })
        .catch(() => {
          reject()
        })
    })
  }

  useEffect(() => {
    if (props?.id) {
      getStoreDetail(props?.id)
    }
  }, [])

  /**
   * 生成店铺装修id
   */
  const createShopAdorn = async (shopId: number, storeId: number): Promise<number | undefined> => {
    const res = await postCommodityAdornManageSave({
      shopId,
      storeId,
    })
    message.destroy()
    if (res.code === 1000 && res.data) {
      return res.data
    }
    return undefined
  }

  /** 更新店铺状态 */
  const changeStoreState = (id: number, status: number) => {
    if (!switchState.current) {
      return
    }
    switchState.current = false
    postCommodityWebStoreWebUpdateStatus(
      {
        id,
        status,
      },
      {
        penetrateError: true,
      },
    )
      .then((res) => {
        if (res.code === 1000) {
          props?.refreshFn?.()
        } else {
          message.destroy()
          message.error(res.message)
        }
      })
      .finally(() => {
        switchState.current = true
      })
  }

  return {
    storeDetail,
    getStoreDetail,
    getStoreShopList,
    createShopAdorn,
    changeStoreState,
  }
}

export default useStore
