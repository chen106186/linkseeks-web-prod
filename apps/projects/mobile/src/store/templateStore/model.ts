import {
  GetCommodityMobileStoreMobileMemberShopMainResponse,
  GetCommodityMobileMemberSelfMobileMemberSelfMainResponse,
  GetCommodityAdornManageFindByShopIdResponse,
} from '@apps/apis'

export type ShopInfoType = GetCommodityMobileStoreMobileMemberShopMainResponse | undefined

export interface BottomItemConfig {
  defaultIcon: string
  name: string
  selectIcon: string
  type: number
}

export interface TabBottomItemType {
  url: string
  lightPic: string
  pic: string
  name: string
  param?: any
}

export interface TemplateStoreModel {
  adornId: number | undefined
  mallId: number
  /** C端商城模板信息 */
  clientMallDesignConfig: GetCommodityAdornManageFindByShopIdResponse
  /** C端商城id */
  clientMallId: any
  /** 获取商城模板loading */
  getMallConfigLoading: boolean
  /** 获取店铺模板loading */
  getShopConfigLoading: boolean
  /** 自营商城模板信息 */
  selfInfo: GetCommodityMobileMemberSelfMobileMemberSelfMainResponse
  /** 自营商城模板装修数据 */
  selfMallDesignConfig: Record<string, any>
  /** B端商城模板信息 */
  mallInfo: GetCommodityAdornManageFindByShopIdResponse
  /** B端商城模板装修数据 */
  mallDesignConfig: Record<string, any>
  /** 店铺模板信息 */
  shopInfo: ShopInfoType
  /** 店铺模板板装修数据 */
  shopDesignConfig: GetCommodityMobileStoreMobileMemberShopMainResponse['adornContent']
  /** 商城首页底部导航数据 */
  selfBottomConfig: TabBottomItemType[] | undefined
  /** 店铺首页底部导航数据 */
  shopBottomConfig: TabBottomItemType[] | undefined
  /** 获取使用中的企业商城B端模板 */
  getMallDesignConfig: (shopId?: number) => Promise<any>
  /** 获取使用中的自营商城模板 */
  getSelfMallDesignConfig: (shopId: any, memberId: number) => Promise<any>
  /** 获取店铺装修 */
  getShopDesignConfig: (shopId: number, storeId: number) => Promise<any>
  /** 获取使用中的企业商城C端模板 */
  getClientMallDesignConfig: (shopId?: any) => Promise<any>
  /** 设置C端商城id */
  setClientMallId: (id: any) => void
  /** 更新获取商城loading状态 */
  updateConfigLoading: (state: boolean) => void
  /** 清空店铺模板信息 */
  resetShopDesignConfig: () => void
}
