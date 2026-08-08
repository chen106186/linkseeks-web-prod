export interface SearchHistoryItemType {
  name: string,
  time: number
}

export enum SearchHistoryKey {
  'own' = 'ownSearchHistory',
  'shop' = 'shopSearchHistory',
  'channel' = 'channelSearchHistory',
  'mall' = 'mallSearchHistory'
}

// eslint-disable-next-line no-shadow
export enum FILTER_CONFIG_TYPE {
  /** 品类筛选 */
  category = "category",
  /** 品牌筛选 */
  brand = "brand",
  /** 地区筛选 */
  address = "address",
  /** 价格筛选 */
  price = "price",
  /** 商品类型 */
  priceType = "priceType"
}

// eslint-disable-next-line no-shadow
export enum FILTER_TYPE {
  /**
   * 品类
   */
  category = "category",
  /**
   * 会员品类
   */
  customerCategory = "customerCategory",
  /**
   * 发货地
   */
  address = "address",
  province = "province",
  city = "city",
  shopArea = "shopArea",
  /**
   * 品牌
   */
  brand = "brand",
  /**
   * 最低价
   */
  minPrice = "minPrice",
  /**
   * 最高价
   */
  maxPrice = "maxPrice",
  /**
   * 商品类型
   */
  commodityType = "commodityType",
  /**
   * 销量
   */
  sort = "sold",
  /**
   * 销量从高到低
   */
  soldSort = 'soldSort',
  /**
   * 信用排序
   */
  creditSort = 'creditSort',
  /**
   * 价格排序
   */
  priceSort = 'priceSort',
  /**
   * 价格从高到低
   */
  priceSortHighToLow = 'priceSortHighToLow',
  /**
  * 价格从低到高
  */
  priceSortLowToHigh = 'priceSortLowToHigh',
  /**
   * 店铺信用排序从高到低
   */
  shopCreditSort = 'shopCreditSort',
  /**
   * 店铺信用排序从高到低
   */
  shopCreditSortHighToLow = 'shopCreditSortHighToLow',
  /**
   * 店铺信用排序从低到高
   */
  shopCreditSortLowToHigh = 'shopCreditSortLowToHigh',
}

export interface FilterItemType {
  type: FILTER_TYPE,
  key: string | number,
  title: string,
}

export interface FilterParamType {
  [key: string]: any
}

export interface SearchStoreModel {
  /** 搜索关键词 */
  searchKeyword: string,
  /** 搜索历史记录 */
  searchHistory: SearchHistoryItemType[],
  channelSearchHistory: SearchHistoryItemType[],
  /** 搜索参数 */
  filterParams: FilterParamType,
  prevFilterParams: FilterParamType | undefined,
  filterList: FilterItemType[],
  filterUpdate: boolean,
  filterParamUpdate: boolean,
  filterConfig: FILTER_CONFIG_TYPE[],
  // 临时选择的筛选参数
  tempFilterList: FilterItemType[],
  /** 搜索列表类型，默认commodity(商品) */
  listType: string,
  /** 修改关键词并添加搜索记录 */
  changeSearchKeyword: (keyword: string, type?: string, save?: boolean) => void,
  /** 获取storage中保存的搜索历史记录 */
  initSearchHistoryByStorage: Function,
  /** 删除搜索历史记录 */
  clearSearchHistory: Function,
  onFilter: Function,
  onFilterParamChange: Function,
  updateFilterConfig: Function,
  onTempFilter: Function,
  updateTempFilter: Function,
  updateFilter: Function,
  uploadListType: Function,
  updatePrevFilterParams: Function,
  updateFilterParams: Function,
}
