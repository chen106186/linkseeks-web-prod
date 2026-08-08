
export interface CommodityItemType {
  /** 商品id */
  id: number,
  /** 商品名称 */
  name: string,
  /** 商品价格 */
  price: number,
  /** 商品价格类型 */
  priceType: number,
  /** 商品图片 */
  mainPic: string,
  storeId: number,
  memberId: number,
}

export interface BrowserHistoryStoreType {
  commodityListHistory: CommodityItemType[],
  updateCommodityBrowerHistory: Function,
}
