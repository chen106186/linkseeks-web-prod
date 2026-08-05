/*
 * @Author: ghua
 * @Date: 2021-02-02 18:53:23
 * @LastEditTime: 2021-02-25 15:57:12
 * @LastEditors: Please set LastEditors
 * @Description: 模板相关store
 * @FilePath: /lingxi-mobile-app/src/store/templateStore/index.ts
 */
import { action, makeObservable, observable, runInAction } from 'mobx'
import { getCommodityAdornManageFindByShopId, getCommodityMobileStoreMobileMemberShopMain } from '@apps/apis'
import { RootStoreModel } from '../rootStore/model'
import { ShopInfoType, TemplateStoreModel, TabBottomItemType } from './model'
// import { GlobalConfig } from "../../constants/global";
import { getSelfRouteByType, getClientRouteByType, getEnterpriseRouteByType, getStoreRouteByType } from './utils'
import Store from '../index'

const GlobalConfig: any = {}

export default class TemplateStore implements TemplateStoreModel {
  private rootStore: RootStoreModel

  mallDesignConfig: any = undefined

  selfMallDesignConfig: any = undefined

  selfInfo: any = undefined

  mallInfo: any = undefined

  clientMallDesignConfig: any = undefined

  clientMallId: any = undefined

  adornId: number | undefined = undefined

  mallId: number = GlobalConfig?.appMallInfo?.id

  getMallConfigLoading = false

  selfBottomConfig: TabBottomItemType[] | undefined = undefined

  shopBottomConfig: TabBottomItemType[] | undefined = undefined

  testInfo: any = {}

  getShopConfigLoading = false
  channelInfo: any
  shopInfo: ShopInfoType
  shopDesignConfig: any

  constructor(rootStore: RootStoreModel) {
    makeObservable(this, {
      mallId: observable,
      clientMallId: observable,
      mallDesignConfig: observable,
      selfMallDesignConfig: observable,
      clientMallDesignConfig: observable,
      getMallConfigLoading: observable,
      getShopConfigLoading: observable,
      selfInfo: observable,
      shopInfo: observable,
      mallInfo: observable,
      selfBottomConfig: observable,
      shopBottomConfig: observable,
      getMallDesignConfig: action.bound,
      getClientMallDesignConfig: action.bound,
      getSelfMallDesignConfig: action.bound,
      setClientMallId: action.bound,
      updateConfigLoading: action.bound,
      resetShopDesignConfig: action.bound,
      getShopDesignConfig: action.bound,
    })
    this.rootStore = rootStore
  }

  updateConfigLoading(state: boolean) {
    this.getMallConfigLoading = state
  }

  getShopDesignConfig(shopId: number, storeId: number) {
    return new Promise((resolve) => {
      const param: any = {
        shopId,
        storeId,
      }
      if (this.getShopConfigLoading) {
        return
      }
      this.getShopConfigLoading = true
      getCommodityMobileStoreMobileMemberShopMain(param)
        .then((res) => {
          runInAction(() => {
            this.getShopConfigLoading = false
            if (res.code === 1000 && res.data) {
              this.shopInfo = res.data
              this.shopDesignConfig = res.data.adornContent || undefined
              const bottoms =
                res.data?.adornContent?.['BottomNavigation']?.children?.map((item: any) => item.props) || []
              if (bottoms && bottoms.length > 0) {
                const newList = bottoms.map((item) => {
                  return {
                    url: getStoreRouteByType(item.type),
                    lightPic: item.selectIcon,
                    pic: item.defaultIcon,
                    name: item.name,
                  }
                })
                this.shopBottomConfig = newList
              } else {
                this.shopBottomConfig = undefined
              }
              resolve(res.data?.adornContent || null)
            } else {
              this.shopInfo = undefined
              this.shopDesignConfig = undefined
              this.shopBottomConfig = undefined
              resolve(null)
            }
          })
        })
        .catch(() => {
          this.shopInfo = undefined
          this.shopDesignConfig = undefined
          this.shopBottomConfig = undefined
          resolve(null)
        })
    })
  }

  /**
   * 获取使用中的APP企业商城B端模板
   */
  getMallDesignConfig(shopId: any) {
    return new Promise((resolve) => {
      const param: any = {
        shopId: shopId || Store.userStore.shopAndSite?.id,
      }
      if (this.getMallConfigLoading) {
        return
      }
      this.getMallConfigLoading = true
      getCommodityAdornManageFindByShopId(param)
        .then((res) => {
          runInAction(() => {
            this.getMallConfigLoading = false
            if (res.code === 1000) {
              this.mallInfo = res.data
              this.mallDesignConfig = res.data?.adornContent || undefined
              const bottoms =
                res.data?.adornContent?.['BottomNavigation']?.children?.map((item: any) => item.props) || []
              if (bottoms && bottoms.length > 0) {
                const newList = bottoms.map((item) => {
                  return {
                    url: getEnterpriseRouteByType(item.type),
                    lightPic: item.selectIcon,
                    pic: item.defaultIcon,
                    name: item.name,
                    type: item.type,
                  }
                })
                this.selfBottomConfig = newList
              } else {
                this.selfBottomConfig = undefined
              }
              resolve(res.data?.adornContent)
            } else {
              this.mallInfo = undefined
              this.mallDesignConfig = undefined
              this.selfBottomConfig = undefined
              resolve(null)
            }
          })
        })
        .catch(() => {
          this.mallInfo = undefined
          this.mallDesignConfig = undefined
          this.selfBottomConfig = []
          resolve(null)
        })
    })
  }

  /**
   * 获取自营商城装修
   * @param shopId
   * @param memberId
   * @returns
   */
  getSelfMallDesignConfig(shopId: any, memberId: number) {
    return new Promise((resolve) => {
      const param: any = {
        shopId,
      }
      if (this.getMallConfigLoading) {
        return
      }
      this.getMallConfigLoading = true
      getCommodityAdornManageFindByShopId(param)
        .then((res) => {
          runInAction(() => {
            this.getMallConfigLoading = false
            if (res.code === 1000) {
              this.selfMallDesignConfig = res.data?.adornContent || null
              this.adornId = res.data?.id
              const bottoms =
                res.data?.adornContent?.['BottomNavigation']?.children?.map((item: any) => item.props) || []
              if (bottoms && bottoms.length > 0) {
                const newList = bottoms.map((item) => {
                  return {
                    url: getSelfRouteByType(item.type),
                    lightPic: item.selectIcon,
                    pic: item.defaultIcon,
                    name: item.name,
                    type: item.type,
                  }
                })
                this.selfBottomConfig = newList
              } else {
                this.selfBottomConfig = undefined
              }
              resolve(res.data?.adornContent || null)
            } else {
              this.adornId = undefined
              this.selfMallDesignConfig = null
              this.selfBottomConfig = undefined
              resolve(null)
            }
          })
        })
        .catch(() => {
          this.adornId = undefined
          this.selfMallDesignConfig = null
          this.selfBottomConfig = undefined
          resolve(null)
        })
    })
  }

  /**
   * 获取使用中的C端商城模板
   */
  getClientMallDesignConfig(shopId?: any) {
    return new Promise((resolve) => {
      const param: any = {
        shopId: shopId || this.clientMallId || Store.userStore.shopAndSite?.id,
      }
      if (this.getMallConfigLoading) {
        return
      }
      this.getMallConfigLoading = true
      getCommodityAdornManageFindByShopId(param).then((res: { code: number; data: any }) => {
        runInAction(() => {
          this.getMallConfigLoading = false
          if (res.code === 1000) {
            this.clientMallDesignConfig = res.data?.adornContent || undefined
            this.adornId = res.data?.id
            const bottoms = res.data?.adornContent?.['BottomNavigation']?.children?.map((item: any) => item.props) || []
            if (bottoms && bottoms.length > 0) {
              const newList = bottoms.map((item) => {
                return {
                  url: getClientRouteByType(item.type),
                  lightPic: item.selectIcon || item.icon,
                  pic: item.icon || item.defaultIcon,
                  name: item.name,
                  type: item.type,
                }
              })
              this.selfBottomConfig = newList
            } else {
              this.selfBottomConfig = undefined
            }
            resolve(res.data)
          } else {
            resolve(null)
          }
        })
      })
    })
  }

  setClientMallId(id: any) {
    this.clientMallId = id
  }

  resetShopDesignConfig() {
    this.shopDesignConfig = undefined
  }
}
