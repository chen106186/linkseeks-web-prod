import { getCommodityWebStoreWebStoreList } from '@apps/apis'

interface MemberShopItemType {
  id: number
  /**
   * 地市
   */
  areaList: {
    /**
     * 省
     */
    province?: string
    /**
     * 市
     */
    city?: string
    /**
     * 省编码
     */
    provinceCode?: string
    /**
     * 市编码
     */
    cityCode?: string
  }[]
  /**
   * 店铺名称
   */
  name: string
  /**
   * 公司LOGO
   */
  logo: string
  /**
   * 状态：0-冻结 1-正常（冗余）
   */
  status: number
}

interface UseMemberShopReturn {
  getMemberShopInfo: () => Promise<MemberShopItemType | undefined>
}

/** 获取会员店铺信息 */
const useMemberShop = (): UseMemberShopReturn => {
  /**
   * 获取会员店铺信息
   * 临时方案：取店铺列表
   */
  const getMemberShopInfo = (): Promise<MemberShopItemType | undefined> => {
    return new Promise((resolve) => {
      getCommodityWebStoreWebStoreList()
        .then((res) => {
          if (res.code === 1000 && res.data && res.data.length > 0) {
            resolve(res.data[0])
          } else {
            resolve(undefined)
          }
        })
        .finally(() => {
          resolve(undefined)
        })
    })
  }

  return {
    getMemberShopInfo,
  }
}

export default useMemberShop
