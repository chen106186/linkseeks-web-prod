export interface StoreItemType {
  id: number
  setFeieSn: string
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

export interface StoreShopItemType {
  id: number
  storeAdornId: number | null
  name: string
  property: number
  environment: number
  url: string
  createTime: number
}

export interface ShopAreaType {
  province?: string | undefined
  city?: string | undefined
  provinceCode?: string | undefined
  cityCode?: string | undefined
}
